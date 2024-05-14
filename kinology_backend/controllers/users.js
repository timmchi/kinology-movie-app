const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const middleware = require("../utils/middleware");
const config = require("../utils/config");
const Movie = require("../models/movie");
const UserComment = require("../models/userComment");
const User = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const bucketName = config.BUCKET_NAME;
const { s3Client } = require("../utils/awsConfig");

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
    .populate("profileComments")
    .populate("watchLaterMovies");
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const { id } = request.params;

  const user = await User.findById(id)
    .populate("watchedMovies")
    .populate("favoriteMovies")
    .populate("authoredComments")
    .populate("profileComments")
    .populate("watchLaterMovies");

  if (!user)
    response.status(404).json({
      error: "no user with such id exists",
    });

  response.json(user);
});

// TODO in this route - Check if movie already exists in db, also disallow to add same movie multiple times to the same profile
const MovieActionSchema = v.object({
  id: v.union([v.string([v.minValue(2)]), v.number([v.minValue(2)])]),
  title: v.optional(v.string()),
  poster: v.optional(v.string([v.includes("/"), v.endsWith(".jpg")])),
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
    movie.watchedBy = movie.watchedBy.filter(
      (userId) => userId.toString() !== user._id.toString()
    );
  }
  if (user.watchedMovies.includes(movie._id)) {
    user.watchedMovies = user.watchedMovies.filter(
      (movieId) => movieId.toString() !== movie._id.toString()
    );
  }
};

const handleUnfavoriteAction = async (movie, user) => {
  if (movie.favoritedBy.includes(user._id)) {
    movie.favoritedBy = movie.favoritedBy.filter(
      (userId) => userId.toString() !== user._id.toString()
    );
  }
  if (user.favoriteMovies.includes(movie._id)) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (movieId) => movieId.toString() !== movie._id.toString()
    );
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

    const parsedMovieAction = v.parse(MovieActionSchema, {
      id: movieId,
      button,
    });

    // console.log(movieId, button);

    const existingMovie = await Movie.findOne({ tmdbId: parsedMovieAction.id });

    // console.log(existingMovie);

    if (!existingMovie) return response.status(200);

    if (parsedMovieAction.button === "watched")
      await handleUnseeAction(existingMovie, user);
    if (parsedMovieAction.button === "favorite")
      await handleUnfavoriteAction(existingMovie, user);
    if (parsedMovieAction.button === "later")
      await handleUnwatchAction(existingMovie, user);

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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

usersRouter.put(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  upload.single("avatar"),
  async (request, response) => {
    const user = request.user;
    const profileOwner = await User.findById(request.params.id);

    if (!profileOwner || user._id?.toString() !== profileOwner?._id?.toString())
      return response.status(401).json({ error: "token invalid" });

    const { bio, name } = request.body;
    const file = request.file;

    // console.log("request.file", request.file);

    const avatarBuffer = await sharp(file.buffer).toBuffer();

    const avatarUploadParams = {
      Bucket: bucketName,
      Body: avatarBuffer,
      Key: `${user.username}-avatar`,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(avatarUploadParams));

    const parsedUserInfo = v.parse(UserUpdateSchema, { biography: bio, name });

    console.log(parsedUserInfo);
    user.biography = parsedUserInfo.biography;
    user.avatar = `${user.username}-avatar`;
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

usersRouter.post(
  "/test",
  upload.single("picture"),
  async (request, response) => {
    const file = request.file;

    const fileBuffer = await sharp(file.buffer).toBuffer();

    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: file.originalname, // "username-avatar"
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    response.status(200).end();
  }
);

module.exports = usersRouter;
