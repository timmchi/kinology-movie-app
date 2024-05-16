const UserComment = require("../models/userComment");
const Movie = require("../models/movie");

const initialComments = [
  { content: "This is a great movie" },
  { content: "This is a bad movie" },
  { content: "This user is my friend" },
  { content: "This user is my enemy" },
];

const initialUser = {
  username: "commentstester",
  email: "commentstester@example.com",
};

const secondUser = {
  username: "seconduser",
  email: "seconduser@example.com",
};

const initialMovie = {
  title: "Scarface",
  poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
  tmdbId: "111",
};

const commentsInDb = async () => {
  const comments = await UserComment.find({});
  return comments.map((comment) => comment.toJSON());
};

const moviesInDb = async () => {
  const movies = await Movie.find({});
  return movies.map((movie) => movie.toJSON());
};

module.exports = {
  initialComments,
  initialUser,
  commentsInDb,
  moviesInDb,
  secondUser,
  initialMovie,
};
