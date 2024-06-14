const usersRouter = require("express").Router();
const middleware = require("../utils/middleware");
const config = require("../utils/config");
const routeUtils = require("../utils/routesUtils");
const usersUtils = require("../utils/usersUtils");
const { MovieActionSchema } = require("../utils/validationSchemas");
const validationMiddleware = require("../utils/validationMiddleware");
const Movie = require("../models/movie");
const User = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const bucketName = config.BUCKET_NAME;
const { s3Client } = require("../utils/awsConfig");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const v = require("valibot");

usersRouter.post(
  "/",
  validationMiddleware.validateRegistrationCredentials,
  async (request, response) => {
    const savedUser = await routeUtils.createUser(request.parsedCredentials);

    response.status(201).json(savedUser);
  }
);

usersRouter.get("/", async (request, response) => {
  const users = await User.find({})
    .populate("watchedMovies")
    .populate("favoriteMovies")
    .populate("authoredComments")
    .populate("profileComments")
    .populate("watchLaterMovies");

  response.json(users);
});

usersRouter.get(
  "/:id",
  validationMiddleware.validateUserId,
  async (request, response) => {
    const user = await routeUtils.fetchUser(request.parsedId);

    if (!user)
      response.status(404).json({
        error: "no user with such id exists",
      });

    // generating signed url
    const avatarUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: `${user.username}-avatar`,
      }),
      { expiresIn: 60 * 60 }
    );

    response.json({ user, avatarUrl });
  }
);

usersRouter.get(
  "/:id/avatar",
  validationMiddleware.validateUserId,
  async (request, response) => {
    const user = await routeUtils.fetchUser(request.parsedId);

    if (!user)
      response.status(404).json({
        error: "no user with such id exists",
      });

    const avatarUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: `${user.username}-avatar`,
      }),
      { expiresIn: 60 * 60 }
    );

    response.json(avatarUrl);
  }
);

usersRouter.post(
  "/:id/movies",
  middleware.tokenExtractor,
  middleware.userExtractor,
  validationMiddleware.validateUserId,
  validationMiddleware.validateMovieAction,
  async (request, response) => {
    const { id, title, poster, button } = request.parsedMovieAction;

    const existingUser = await routeUtils.fetchUser(request.parsedId);
    if (!existingUser)
      return response.status(404).json({ error: "user does not exist" });

    const user = request.user;

    if (user._id.toString() !== request.parsedId)
      return response.status(401).end();

    let existingMovie = await routeUtils.fetchMovie(id);

    if (!existingMovie) {
      existingMovie = await routeUtils.createMovie(id, title, poster);
    }

    if (button === "watched")
      await usersUtils.handleWatchedAction(existingMovie, user);
    if (button === "favorite")
      await usersUtils.handleFavoriteAction(existingMovie, user);
    if (button === "later")
      await usersUtils.handleWatchLaterAction(existingMovie, user);

    await Promise.all([user.save(), existingMovie.save()]);

    const updatedSavedMovie = await Movie.findById(existingMovie._id).populate(
      button === "watched"
        ? "watchedBy"
        : button === "favorite"
        ? "favoritedBy"
        : button === "later"
        ? "watchLaterBy"
        : null,
      { username: 1, name: 1 }
    );

    response.status(201).json(updatedSavedMovie);
  }
);

// deleting a movie from user profile
usersRouter.delete(
  "/:id/movies/:movieId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  validationMiddleware.validateUserId,
  async (request, response) => {
    const { button } = request.body;
    const { movieId } = request.params;
    const user = request.user;

    const parsedMovieAction = v.parse(MovieActionSchema, {
      id: movieId,
      button,
    });

    if (user._id.toString() !== request.parsedId)
      return response.status(401).end();

    const existingMovie = await routeUtils.fetchMovie(parsedMovieAction.id);

    if (!existingMovie) return response.status(404);

    if (parsedMovieAction.button === "watched")
      await usersUtils.handleUnseeAction(existingMovie, user);
    if (parsedMovieAction.button === "favorite")
      await usersUtils.handleUnfavoriteAction(existingMovie, user);
    if (parsedMovieAction.button === "later")
      await usersUtils.handleUnwatchAction(existingMovie, user);

    await Promise.all([user.save(), existingMovie.save()]);

    return response.status(201).send(existingMovie);
  }
);

usersRouter.put(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  upload.single("avatar"),
  validationMiddleware.validateUserId,
  validationMiddleware.validateUserUpdate,
  validationMiddleware.validateAvatar,
  async (request, response) => {
    const user = request.user;

    const profileOwner = await routeUtils.fetchUser(request.parsedId);

    if (!profileOwner)
      return response.status(404).json({ error: "user does not exist" });

    if (!profileOwner || user._id?.toString() !== profileOwner?._id?.toString())
      return response.status(401).json({ error: "token invalid" });

    const { biography, name } = request.parsedUserInfo;

    const parsedAvatar = request.parsedAvatar;

    // uploading avatar to s3 bucket
    const avatarBuffer = await sharp(parsedAvatar.buffer).toBuffer();

    const avatarUploadParams = {
      Bucket: bucketName,
      Body: avatarBuffer,
      Key: `${user.username}-avatar`,
      ContentType: parsedAvatar.mimetype,
    };

    await s3Client.send(new PutObjectCommand(avatarUploadParams));

    user.biography = biography;
    user.avatar = `${user.username}-avatar`;
    user.name = name;

    await user.save();

    // generating signed url so that avatar changes on update
    const avatarUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: `${user.username}-avatar`,
      }),
      { expiresIn: 60 * 60 }
    );

    response.status(200).json({ user, avatarUrl });
  }
);

usersRouter.delete(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  validationMiddleware.validateUserId,
  async (request, response) => {
    const user = request.user;

    const profileOwner = await routeUtils.fetchUser(request.parsedId);

    if (!profileOwner)
      return response.status(404).json({ error: "user does not exist" });

    if (user._id?.toString() !== profileOwner?._id?.toString())
      return response.status(401).json({ error: "token invalid" });

    await profileOwner.deleteOne();

    response.status(204).end();
  }
);

module.exports = usersRouter;
