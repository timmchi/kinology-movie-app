const axios = require("axios");
0;
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

// genres, director, year, rating (bottom - top), actors, country
// with_genres, with_crew, year, vote_average.gte - vote_average.lte, with_cast, with_origin_country
// query=leonardo%20dicaprio

const peopleSearch = async (people) => {
  return people.map(async (name) => {
    const response = await axios.get(`${basePersonUrl}&query=${name}`, {
      headers,
    });
    console.log(response.data.results[0].id);
    return response.data.results[0].id;
  });
};

moviesRouter.post("/", async (request, response) => {
  console.log(request.body);
  const actorIds = await peopleSearch(request.body.actors);
  console.log(actorIds);
  response.status(200);
});

module.exports = moviesRouter;
