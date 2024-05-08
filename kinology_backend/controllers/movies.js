const axios = require("axios");
const moviesRouter = require("express").Router();
const config = require("../utils/config");
const movieUtils = require("../utils/movieUtils");

const baseMovieUrl =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&";
const basePersonUrl =
  "https://api.themoviedb.org/3/search/person?include_adult=false&page=1&";
const authorizationHeader = `Authorization: Bearer ${config.TMDB_TOKEN}`;
const headers = {
  accept: "application/json",
  Authorization: `Bearer ${config.TMDB_TOKEN}`,
};

moviesRouter.post("/", async (request, response) => {
  // these parts are fine as they are to put into query
  const { genres, year, ratingUpper, ratingLower, country } = request.body;

  // these need to be turned into ids with peopleSearch
  let { director, actors } = request.body;

  if (director !== "") director = await movieUtils.peopleSearch([director]);

  if (actors.length !== 0) actors = await movieUtils.peopleSearch(actors);

  const query = movieUtils.queryCreator({
    genres,
    year,
    ratingUpper,
    ratingLower,
    country,
    director,
    actors,
  });

  const url = `${baseMovieUrl}${query}&sort_by=popularity.desc`;
  console.log(url);

  const movieResponse = await axios.get(url, { headers });

  const movieResults = movieResponse.data.results;

  const movieToFrontObjectArray = movieResults.map((movie) => ({
    id: movie.id,
    title: movie.title,
    image: movie.poster_path,
  }));

  response.status(200).send({ movieToFrontObjectArray });
});

module.exports = moviesRouter;
