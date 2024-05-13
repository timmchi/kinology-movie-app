const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Movie = require("../models/movie");
const UserComment = require("../models/userComment");
const User = require("../models/user");
const movie = require("../models/movie");

// TODO - maybe add validation for ids - uuid?
const v = require("valibot");

const RegistrationSchema = v.object(
  {
    email: v.string([
      v.minLength(1, "Please enter your email."),
      v.email("The email address is badly formatted"),
    ]),
    username: v.string([
      v.minLength(1, "Please enter your username."),
      v.minLength(3, "Username should be 3 or more symbols"),
    ]),
    name: v.string([
      v.minLength(1, "Please enter your name or nickname."),
      v.minLength(3, "Name or nickname should be 3 or more symbols"),
    ]),
    password: v.string([
      v.minLength(1, "Please enter your password."),
      v.minLength(6, "Your password must have 6 characters or more."),
    ]),
    passwordConfirm: v.string([v.minLength(1, "Please confirm password")]),
  },
  [
    v.forward(
      v.custom(
        (input) => input.password === input.passwordConfirm,
        "The two password do not match"
      ),
      ["passwordConfirm"]
    ),
  ]
);

usersRouter.post("/", async (request, response) => {
  const { email, username, password, passwordConfirm, name } = request.body;

  const parsedCredentials = v.parse(RegistrationSchema, {
    email,
    username,
    password,
    passwordConfirm,
    name,
  });

  //   console.log(parsedCredentials);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(
    parsedCredentials.password,
    saltRounds
  );

  const user = new User({
    username: parsedCredentials.username,
    email: parsedCredentials.email,
    name: parsedCredentials.name,
    passwordHash,
    biography: "",
    avatar: "",
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({})
    .populate("watchedMovies")
    .populate("favoriteMovies")
    .populate("authoredComments")
    .populate("profileComments");
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const { id } = request.params;

  const user = await User.findById(id)
    .populate("watchedMovies")
    .populate("favoriteMovies")
    .populate("authoredComments")
    .populate("profileComments");

  if (!user)
    response.status(404).json({
      error: "no user with such id exists",
    });

  response.json(user);
});

// TODO in this route - Check if movie already exists in db, also disallow to add same movie multiple times to the same profile
const MovieActionSchema = v.object({
  id: v.union([v.string([v.minValue(2)]), v.number([v.minValue(2)])]),
  title: v.string(),
  poster: v.string([v.includes("/"), v.endsWith(".jpg")]),
  button: v.picklist(["watched", "favorite", "later"]),
});

const handleWatchLaterAction = async (movie, user) => {
  if (!movie.watchLaterBy.includes(user._id)) {
    movie.watchLaterBy = movie.watchLaterBy.concat(user._id);
  }
  if (!user.watchLaterMovies.includes(movie._id)) {
    user.watchLaterMovies = user.watchLaterMovies.concat(movie._id);
  }
};

const handleWatchedAction = async (movie, user) => {
  if (!movie.watchedBy.includes(user._id)) {
    movie.watchedBy = movie.watchedBy.concat(user._id);
  }
  if (!user.watchedMovies.includes(movie._id)) {
    user.watchedMovies = user.watchedMovies.concat(movie._id);
  }
};

const handleFavoriteAction = async (movie, user) => {
  if (!movie.favoritedBy.includes(user._id)) {
    movie.favoritedBy = movie.favoritedBy.concat(user._id);
  }
  if (!user.favoriteMovies.includes(movie._id)) {
    user.favoriteMovies = user.favoriteMovies.concat(movie._id);
  }
};

usersRouter.post(
  "/:id/movies",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { movie, button } = request.body;
    const parsedMovieAction = v.parse(MovieActionSchema, {
      id: movie.id,
      title: movie.title,
      poster: movie.poster,
      button,
    });

    console.log(parsedMovieAction);

    const user = request.user;
    let existingMovie = await Movie.findOne({ tmdbId: parsedMovieAction.id });

    if (!existingMovie) {
      existingMovie = new Movie({
        tmdbId: parsedMovieAction.id,
        title: parsedMovieAction.title,
        poster: parsedMovieAction.poster,
      });
    }

    if (parsedMovieAction.button === "watched")
      await handleWatchedAction(existingMovie, user);
    if (parsedMovieAction.button === "favorite")
      await handleFavoriteAction(existingMovie, user);
    if (parsedMovieAction.button === "later")
      await handleWatchLaterAction(existingMovie, user);

    await Promise.all([user.save(), existingMovie.save()]);

    // const updatedSavedMovie = await Movie.findById(existingMovie._id).populate(
    //   parsedMovieAction.button === "watched" ? "watchedBy" : "favoritedBy",
    //   { username: 1, name: 1 }
    // );
    const updatedSavedMovie = await Movie.findById(existingMovie._id).populate(
      parsedMovieAction.button === "watched"
        ? "watchedBy"
        : parsedMovieAction.button === "favorite"
        ? "favoritedBy"
        : parsedMovieAction.button === "later"
        ? "watchLaterBy"
        : null,
      { username: 1, name: 1 }
    );

    response.status(201).json(updatedSavedMovie);
  }
);

const handleUnwatchAction = async (movie, user) => {
  if (movie.watchLaterBy.includes(user._id)) {
    movie.watchLaterBy = movie.watchLaterBy.filter(
      (userId) => userId.toString() !== user._id.toString()
    );
  }
  if (user.watchLaterMovies.includes(movie._id)) {
    user.watchLaterMovies = user.watchLaterMovies.filter(
      (movieId) => movieId.toString() !== movie._id.toString()
    );
  }
};

const handleUnseeAction = async (movie, user) => {
  console.log(movie, user);
  if (movie.watchedBy.includes(user._id)) {
    // console.log("movie.watchedBy before filter", movie.watchedBy);
    movie.watchedBy = movie.watchedBy.filter(
      (userId) => userId.toString() !== user._id.toString()
    );
    // console.log("movie.watchedBy after filter", movie.watchedBy);
  }
  if (user.watchedMovies.includes(movie._id)) {
    // console.log("user.watchedMovies before filter", user.watchedMovies);
    user.watchedMovies = user.watchedMovies.filter(
      (movieId) => movieId.toString() !== movie._id.toString()
    );
    // console.log("user.watchedMovies after filter", user.watchedMovies);
  }
};

const handleUnfavoriteAction = async (movie, user) => {
  if (movie.favoritedBy.includes(user._id)) {
    // console.log("movie.favoritedBy before filter", movie.favoritedBy);
    movie.favoritedBy = movie.favoritedBy.filter(
      (userId) => userId.toString() !== user._id.toString()
    );
    // console.log("movie.favoritedBy after filter", movie.favoritedBy);
  }
  if (user.favoriteMovies.includes(movie._id)) {
    // console.log("user.favoriteMovies before filter", user.favoriteMovies);
    user.favoriteMovies = user.favoriteMovies.filter(
      (movieId) => movieId.toString() !== movie._id.toString()
    );
    // console.log("user.favoriteMovies after filter", user.favoriteMovies);
  }
};

usersRouter.delete(
  "/:id/movies/:movieId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { button } = request.body;
    const { movieId } = request.params;
    const user = request.user;

    console.log(movieId, button);

    const existingMovie = await Movie.findOne({ tmdbId: movieId });

    console.log(existingMovie);

    if (!existingMovie) return response.status(200);

    if (button === "watched") await handleUnseeAction(existingMovie, user);
    if (button === "favorite")
      await handleUnfavoriteAction(existingMovie, user);
    if (button === "later") await handleUnwatchAction(existingMovie, user);

    await Promise.all([user.save(), existingMovie.save()]);

    return response.status(201).send(existingMovie);
  }
);

const UserUpdateSchema = v.object({
  biography: v.string("About me should be a string", [
    v.minLength(1, "Please enter something about yourself."),
  ]),
  name: v.string("Name should be a string", [
    v.minLength(1, "Please enter your name"),
    v.minLength(3, "Name should be 3 or more symbols long"),
  ]),
});

usersRouter.put(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const profileOwner = await User.findById(request.params.id);

    if (!profileOwner || user._id?.toString() !== profileOwner?._id?.toString())
      return response.status(401).json({ error: "token invalid" });

    const { biography, name } = request.body;

    const parsedUserInfo = v.parse(UserUpdateSchema, { biography, name });

    console.log(parsedUserInfo);
    user.biography = parsedUserInfo.biography;
    // user.avatar = avatar;
    user.name = parsedUserInfo.name;

    console.log("user after updating", user);
    await user.save();

    response.json(user);
  }
);

usersRouter.delete(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const profileOwner = await User.findById(request.params.id);

    if (!profileOwner || user._id?.toString() !== profileOwner?._id?.toString())
      return response.status(401).json({ error: "token invalid" });

    await profileOwner.deleteOne();

    response.status(200).end();
  }
);

module.exports = usersRouter;
