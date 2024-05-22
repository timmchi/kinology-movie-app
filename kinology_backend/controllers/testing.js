const router = require("express").Router();
const Movie = require("../models/movie");
const User = require("../models/user");
const UserComment = require("../models/userComment");

router.post("/reset", async (request, response) => {
  await Movie.deleteMany({});
  await User.deleteMany({});
  await UserComment.deleteMany({});

  response.status(204).end();
});

module.exports = router;
