const router = require("express").Router();
const Movie = require("../models/movie");
const User = require("../models/user");
const UserComment = require("../models/userComment");

router.post("/reset", async (request, response) => {
  await NodeIterator.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = router;
