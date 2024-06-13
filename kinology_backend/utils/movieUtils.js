const axios = require("axios");
const config = require("./config");
const { isoCountrySearch } = require("./isoSearch");

const basePersonUrl = config.BASE_PERSON_URL;
const headers = {
  accept: "application/json",
  Authorization: `Bearer ${config.TMDB_TOKEN}`,
};

// it is not possible to use people's names just as they are in TMDB's discover/find queries. The names need to be in the form of ids. This function takes care of that.
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
  const vote_gte = `vote_average.gte=${params.ratingLower}`;
  const vote_lte = `&vote_average.lte=${params.ratingUpper}`;
  const with_genres =
    params.genres.length === 0
      ? ""
      : `&with_genres=${params.genres.join("%2C%20")}`;
  const with_crew =
    params.director === "" ? "" : `&with_crew=${params.director}`;
  const with_people =
    params.actors.length === 0
      ? ""
      : `&with_people=${params.actors.join("%2C%20")}`;
  const year = params.year === "" ? "" : `&primary_release_year=${params.year}`;
  const origin_country =
    params.country === ""
      ? ""
      : `&with_origin_country=${isoCountrySearch(params.country)}`;
  const page = `&page=${params.page}`;

  return [
    vote_gte,
    vote_lte,
    with_genres,
    with_crew,
    with_people,
    year,
    page,
    origin_country,
  ].join("");
};

const titleSearchUrlCreator = (query) => {
  const url = `${config.BASE_TITLE_QUERY_URL}?query=${query}&include_adult=false&language=en-US&page=1`;

  return url;
};

module.exports = { queryCreator, peopleSearch, titleSearchUrlCreator };
