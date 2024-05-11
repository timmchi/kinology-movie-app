require("dotenv").config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
const SECRET = process.env.SECRET;
const TMDB_TOKEN = process.env.TMDB_TOKEN;
const TMDB_API = process.env.TMDB_API_KEY;

const BASE_MOVIES_URL =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&";

const BASE_SINGLE_MOVIE_URL = "https://api.themoviedb.org/3/movie/";

module.exports = {
  PORT,
  MONGODB_URI,
  TEST_MONGODB_URI,
  SECRET,
  TMDB_TOKEN,
  TMDB_API,
  BASE_MOVIES_URL,
  BASE_SINGLE_MOVIE_URL,
};
