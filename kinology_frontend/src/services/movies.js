import axios from "axios";
const baseUrl = "/api/movies";

// search to get a list of movies that fit the query
const search = async (queryDetails) => {
  const response = await axios.post(baseUrl, queryDetails);
  return response.data;
};

// single movie for single Movie page
const getSingleMovie = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export default { search, getSingleMovie };
