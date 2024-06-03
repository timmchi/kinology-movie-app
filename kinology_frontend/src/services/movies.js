import axios from "axios";
const baseUrl = "/api/movies";

const search = async (queryDetails) => {
  console.log("query deatils in movies service in frontend", queryDetails);
  const response = await axios.post(baseUrl, queryDetails);
  return response.data;
};

const getSingleMovie = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export default { search, getSingleMovie };
