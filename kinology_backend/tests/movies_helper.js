const User = require("../models/user");
const Movie = require("../models/movie");

const mockMovies = [
  { title: "Casino", poster: "/4TS5O1IP42bY2BvgMxL156EENy.jpg", tmdbId: "524" },
  {
    title: "GoodFellas",
    poster: "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    tmdbId: "769",
  },
  {
    title: "Easy Rider",
    poster: "/mmGEB6ly9OG8SYVfvAoa6QqHNvN.jpg",
    tmdbId: "624",
  },
];

const moviesInDb = async () => {
  const movies = await Movie.find({});
  return movies.map((movie) => movie.toJSON());
};

module.exports = { mockMovies, moviesInDb };
