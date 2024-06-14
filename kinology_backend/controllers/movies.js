const axios = require("axios");
const moviesRouter = require("express").Router();
const config = require("../utils/config");
const movieUtils = require("../utils/movieUtils");
const validationMiddleware = require("../utils/validationMiddleware");
const Movie = require("../models/movie");

const baseMovieUrl = config.BASE_MOVIES_URL;
const baseSingleMovieUrl = config.BASE_SINGLE_MOVIE_URL;

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${config.TMDB_TOKEN}`,
};

const turnIntoQuery = async (params) => {
  const { genres, year, ratingUpper, ratingLower, country, page } = params;

  let { director, actors } = params;

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

  return query;
};

moviesRouter.get("/", async (request, response) => {
  const movies = await Movie.find({});
  response.status(200).send(movies);
});

moviesRouter.post(
  "/",
  validationMiddleware.validateMovieQuery,
  async (request, response) => {
    let { genres, year, ratingUpper, ratingLower, country, page } =
      request.parsedMovieQuery;

    let { director, actors } = request.parsedMovieQuery;

    const query = await turnIntoQuery({
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

    const movieResponse = await axios.get(url, { headers });

    const movieResults = movieResponse.data.results;
    const totalPages = movieResponse.data.total_pages;

    const movieToFrontObjectArray = movieResults.map((movie) => ({
      id: movie.id,
      title: movie.title,
      image: movie.poster_path,
    }));

    response.status(200).send({ movieToFrontObjectArray, totalPages });
  }
);

moviesRouter.get(
  "/:movieId",
  validationMiddleware.validateParamsIds,
  async (request, response) => {
    const { movieId } = request.parsedParamsData;

    const url = `${baseSingleMovieUrl}${movieId}?language=en-US`;

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
  }
);

moviesRouter.post(
  "/title",
  validationMiddleware.validateTitleSearch,
  async (request, response) => {
    const { title } = request.parsedTitle;

    const titleQuery = title.replace(" ", "%20");

    const url = movieUtils.titleSearchUrlCreator(titleQuery);

    const movieResponse = await axios.get(url, { headers });

    const movieResults = movieResponse.data.results;

    const movies = movieResults.map((movie) => ({
      id: movie.id,
      title: movie.title,
      image: movie.poster_path,
    }));

    response.status(200).send(movies);
  }
);

module.exports = moviesRouter;
