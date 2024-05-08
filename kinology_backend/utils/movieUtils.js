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
  console.log(
    "in query creator",
    params.director,
    params.actors,
    params.genres
  );

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
  const year = params.year === "" ? "" : `&year=${params.year}`;
  const origin_country =
    params.country === ""
      ? ""
      : `&with_origin_country=${isoCountrySearch(params.country)}`;

  return [
    vote_gte,
    vote_lte,
    with_genres,
    with_crew,
    with_people,
    year,
    origin_country,
  ].join("");
};