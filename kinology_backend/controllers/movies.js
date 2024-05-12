const axios = require("axios");
const moviesRouter = require("express").Router();
const config = require("../utils/config");
const movieUtils = require("../utils/movieUtils");
const v = require("valibot");

const baseMovieUrl = config.BASE_MOVIES_URL;
const baseSingleMovieUrl = config.BASE_SINGLE_MOVIE_URL;

const basePersonUrl =
  "https://api.themoviedb.org/3/search/person?include_adult=false&page=1&";

const authorizationHeader = `Authorization: Bearer ${config.TMDB_TOKEN}`;
const headers = {
  accept: "application/json",
  Authorization: `Bearer ${config.TMDB_TOKEN}`,
};

const searchQuerySchema = v.object({
  genres: v.array(v.string("Genre should be a string")),
  year: v.union([
    v.string([
      v.minValue("1874", "Movies can not be shot before 1874"),
      v.maxValue(
        `${new Date().getFullYear()}`,
        "Can not search for movies shot after current year"
      ),
    ]),
    v.literal(""),
  ]),
  ratingUpper: v.number("Rating should be a number", [
    v.minValue(0, "Rating can not be lower than 0"),
    v.maxValue(10, "Rating can not be higher than 10"),
  ]),
  ratingLower: v.number("Rating should be a number", [
    v.minValue(0, "Rating can not be lower than 0"),
    v.maxValue(10, "Rating can not be higher than 10"),
  ]),
  country: v.string("Country should be a string", [
    v.maxLength(100, "Country name can not be this long"),
  ]),
  page: v.number("Page should be a number", [
    v.maxValue(10, "Can not search for movies past page 10"),
  ]),
  director: v.string("Director should be a string"),
  actors: v.array(v.string("Actor should be a string")),
});

// TODO could refactor this into 2 functions - one for parsing and one for making the api request
moviesRouter.post("/", async (request, response) => {
  // these parts are fine as they are to put into query
  let { genres, year, ratingUpper, ratingLower, country, page } = request.body;

  // these need to be turned into ids with peopleSearch
  let { director, actors } = request.body;

  const parsedQueryParams = v.parse(searchQuerySchema, {
    genres,
    year,
    ratingUpper,
    ratingLower,
    country,
    page,
    director,
    actors,
  });

  ({ genres, year, ratingUpper, ratingLower, country, page, director, actors } =
    parsedQueryParams);

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
    page,
  });

  const url = `${baseMovieUrl}${query}&sort_by=popularity.desc`;
  console.log(url);

  const movieResponse = await axios.get(url, { headers });

  const movieResults = movieResponse.data.results;
  const totalPages = movieResponse.data.total_pages;

  const movieToFrontObjectArray = movieResults.map((movie) => ({
    id: movie.id,
    title: movie.title,
    image: movie.poster_path,
  }));

  response.status(200).send({ movieToFrontObjectArray, totalPages });
});

moviesRouter.get("/:id", async (request, response) => {
  const { id } = request.params;

  const url = `${baseSingleMovieUrl}${id}?language=en-US`;

  const movieResponse = await axios.get(url, { headers });

  const movieResults = movieResponse.data;

  const movieObject = {
    image: movieResults.poster_path,
    genres: movieResults.genres,
    overview: movieResults.overview,
    release: movieResults.release_date,
    runtime: movieResults.runtime,
    title: movieResults.title,
    slogan: movieResults.tagline,
    rating: movieResults.vote_average,
    imdb: movieResults.imdb_id,
  };

  response.status(200).send(movieObject);
});

module.exports = moviesRouter;
