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
      ["password2"]
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
  id: v.string([v.minValue("2")]),
  title: v.string(),
  poster: v.string([v.includes("/"), v.endsWith(".jpg")]),
  button: v.picklist(["watched", "favorite", "later"]),
});

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

    let updatedSavedMovie;

    // there is a problem in this route - a new object is created, should first if there is already such a movie present and it should then append the user id to the watched/favorited list
    if (parsedMovieAction.button === "watched") {
      const movieMongo = new Movie({
        tmdbId: parsedMovieAction.id,
        title: parsedMovieAction.title,
        poster: parsedMovieAction.poster,
        watchedBy: [user._id],
      });
      const savedMovie = await movieMongo.save();
      user.watchedMovies = user.watchedMovies.concat(savedMovie._id);

      updatedSavedMovie = await Movie.findById(savedMovie.id).populate(
        "watchedBy",
        {
          username: 1,
          name: 1,
        }
      );
    }
    if (parsedMovieAction.button === "favorite") {
      const movieMongo = new Movie({
        tmdbId: parsedMovieAction.id,
        title: parsedMovieAction.title,
        poster: parsedMovieAction.poster,
        favoritedBy: [user._id],
      });
      const savedMovie = await movieMongo.save();
      user.favoriteMovies = user.favoriteMovies.concat(savedMovie._id);

      updatedSavedMovie = await Movie.findById(savedMovie.id).populate(
        "favoritedBy",
        {
          username: 1,
          name: 1,
        }
      );
    }

    await user.save();
    response.status(201).json(updatedSavedMovie);
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

// there is a bug right now when updating a user - movies added to profile become undefined, has to do with user's name?
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
