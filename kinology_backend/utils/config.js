/* eslint-disable no-undef */
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const SECRET = process.env.SECRET;
const TMDB_TOKEN = process.env.TMDB_TOKEN;
const TMDB_API = process.env.TMDB_API_KEY;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;

const BASE_MOVIES_URL =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&";

const BASE_SINGLE_MOVIE_URL = "https://api.themoviedb.org/3/movie/";

const ETHEREAL_USER = process.env.ETHEREAL_USER;
const ETHEREAL_PW = process.env.ETHEREAL_PW;

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PW = process.env.GMAIL_PW;

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET,
  TMDB_TOKEN,
  TMDB_API,
  BASE_MOVIES_URL,
  BASE_SINGLE_MOVIE_URL,
  ACCESS_KEY,
  SECRET_ACCESS_KEY,
  BUCKET_NAME,
  BUCKET_REGION,
  ETHEREAL_USER,
  ETHEREAL_PW,
  GMAIL_USER,
  GMAIL_PW,
};
