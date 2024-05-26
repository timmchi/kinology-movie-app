const Movie = require("../models/movie");
const User = require("../models/user");

const users = [
  {
    username: "userstester",
    email: "userstester@example.com",
  },
  {
    username: "seconduser",
    email: "seconduser@example.com",
  },
  {
    username: "thirduser",
    email: "thirduser@example.com",
  },
];

const initialMovie = {
  title: "Scarface",
  poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
  tmdbId: "111",
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const moviesInDb = async () => {
  const movies = await Movie.find({});
  return movies.map((movie) => movie.toJSON());
};

module.exports = {
  users,
  moviesInDb,
  usersInDb,
  initialMovie,
};
