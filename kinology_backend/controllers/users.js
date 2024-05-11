const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Movie = require("../models/movie");
const UserComment = require("../models/userComment");
const User = require("../models/user");
const movie = require("../models/movie");

// import * as v from "valibot";
const v = require("valibot");

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  if (
    !(
      body.username &&
      body.password &&
      body.password.length >= 3 &&
      body.username.length >= 3
    )
  )
    return response.status(400).json({
      error: "credentials are missing or are too short",
    });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name ?? "",
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
usersRouter.post(
  "/:id/movies",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { movie, button } = request.body;
    const { id, title, poster } = movie;

    const user = request.user;

    let updatedSavedMovie;

    console.log(
      "movie in backend when pressing adding buttons",
      id,
      title,
      poster
    );

    if (button === "watched") {
      const movieMongo = new Movie({
        tmdbId: id,
        title: title,
        poster: poster,
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
    if (button === "favorite") {
      const movieMongo = new Movie({
        tmdbId: id,
        title: title,
        poster: poster,
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

usersRouter.put(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const profileOwner = await User.findById(request.params.id);

    if (!profileOwner || user._id?.toString() !== profileOwner?._id?.toString())
      return response.status(401).json({ error: "token invalid" });

    const { biography, avatar, name } = request.body;

    user.biography = biography;
    user.avatar = avatar;
    user.name = name;

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
