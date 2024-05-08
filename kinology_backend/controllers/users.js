const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Movie = require("../models/movie");
const UserComment = require("../models/userComment");
const User = require("../models/user");
const movie = require("../models/movie");

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

    const user = request.user;
    let movieMongo;
    let savedMovie;
    let updatedSavedMovie;

    console.log(movie, button, user);

    switch (button) {
      case "watched":
        movieMongo = new Movie({
          tmdbId: movie,
          watchedBy: [user._id],
        });
        savedMovie = await movieMongo.save();
        user.watchedMovies = user.watchedMovies.concat(savedMovie._id);

        updatedSavedMovie = await Movie.findById(savedMovie.id).populate(
          "watchedBy",
          {
            username: 1,
            name: 1,
          }
        );
      case "watchList":
        movieMongo = new Movie({
          tmdbId: movie,
          favoritedBy: [user._id],
        });
        savedMovie = await movieMongo.save();
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

// usersRouter.put('/:id') will be used to upload avatar, biography, etc.
usersRouter.put(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const { biography, avatar, name } = request.body;

    user.biography = biography;
    user.avatar = avatar;
    user.name = name;

    const updatedUser = User.findByIdAndUpdate(request.params.id, user, {
      new: true,
    })
      .populate("watchedMovies")
      .populate("favoriteMovies")
      .populate("authoredComments")
      .populate("profileComments");

    response.json(updatedUser);
  }
);

module.exports = usersRouter;
