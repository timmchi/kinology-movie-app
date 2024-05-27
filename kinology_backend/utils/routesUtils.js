const bcrypt = require("bcrypt");
const Movie = require("../models/movie");
const User = require("../models/user");

const createMovie = async (tmdbId, title, poster) => {
  const movie = new Movie({
    tmdbId,
    title,
    poster,
  });
  const savedMovie = await movie.save();

  return savedMovie;
};

const fetchMovie = async (movieId) => {
  const movie = await Movie.findOne({ tmdbId: movieId });
  return movie;
};

const fetchUser = async (userId) => {
  const user = await User.findById(userId)
    .populate("watchedMovies")
    .populate("favoriteMovies")
    .populate("authoredComments")
    .populate("profileComments")
    .populate("watchLaterMovies");

  return user;
};

const createUser = async ({ password, username, email, name }) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    email,
    name,
    passwordHash,
    biography: "",
    avatar: "",
  });

  const savedUser = await user.save();

  return savedUser;
};

module.exports = { createMovie, fetchMovie, fetchUser, createUser };
