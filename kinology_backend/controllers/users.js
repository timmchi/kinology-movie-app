const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const Movie = require("../models/movie");
const UserComment = require("../models/userComment");
const User = require("../models/user");

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

// usersRouter.post('/:id') will be used to upload avatar, biography, etc.

module.exports = usersRouter;
