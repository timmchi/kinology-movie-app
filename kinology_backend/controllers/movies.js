const axios = require("axios");
const { isoCountrySearch } = require("../utils/isoSearch");
const moviesRouter = require("express").Router();
const config = require("../utils/config");

const baseMovieUrl =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US";
const basePersonUrl =
  "https://api.themoviedb.org/3/search/person?include_adult=false&page=1&";
const authorizationHeader = `Authorization: Bearer ${config.TMDB_TOKEN}`;
const headers = {
  accept: "application/json",
  Authorization: `Bearer ${config.TMDB_TOKEN}`,
};

const peopleSearch = async (people) => {
  const peopleIds = await Promise.all(
    people.map(async (name) => {
      const response = await axios.get(`${basePersonUrl}&query=${name}`, {
        headers,
      });
      return response.data.results[0].id;
    })
  );

  return peopleIds;
};

const queryCreator = (params) => {
  const vote_gte = `&vote_average.gte=${params.ratingLower}`;
  const vote_lte = `&vote_average.lte=${params.ratingUpper}`;
  const with_genres = `&with_genres=${params.genres.join("%2C%20")}`;
  const with_crew = `&with_crew=${params.director}`;
  const with_people = `&with_people=${params.actors.join("%2C%20")}`;
  const year = `&year=${params.year}`;
  const origin_country = `&with_origin_country=${isoCountrySearch(
    params.country
  )}`;

  console.log(
    [
      vote_gte,
      vote_lte,
      with_genres,
      with_crew,
      with_people,
      year,
      origin_country,
    ].join("")
  );
};

moviesRouter.post("/", async (request, response) => {
  // these parts are fine as they are to put into query
  const { genres, year, ratingUpper, ratingLower, country } = request.body;

  // these need to be turned into ids with peopleSearch
  let { director, actors } = request.body;

  if (director !== "") director = await peopleSearch([director]);

  if (actors.length !== 0) actors = await peopleSearch(actors);

  queryCreator({
    genres,
    year,
    ratingUpper,
    ratingLower,
    country,
    director,
    actors,
  });
  response.status(200).send({ actors, director });
});

module.exports = moviesRouter;
