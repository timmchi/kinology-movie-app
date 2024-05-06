require("dotenv").config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
const SECRET = process.env.SECRET;
const TMDB_TOKEN = process.env.TMDB_TOKEN;
const TMDB_API = process.env.TMDB_API_KEY;

module.exports = {
  PORT,
  MONGODB_URI,
  TEST_MONGODB_URI,
  SECRET,
  TMDB_TOKEN,
  TMDB_API,
};
