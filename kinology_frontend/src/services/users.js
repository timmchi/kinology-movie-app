import axios from "axios";
const baseUrl = "http://localhost:3001/api/users";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getUsers = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUser = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const addMovieToProfile = async (movie, button, userId) => {
  const config = {
    headers: { Authorization: token },
  };

  console.log("movie in service", movie);

  const response = await axios.post(
    `${baseUrl}/${userId}/movies`,
    { movie, button },
    config
  );
  return response.data;
};

const updateUser = async (id, updatedInformation) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(
    `${baseUrl}/${id}`,
    updatedInformation,
    config
  );
  return response.data;
};

const deleteUser = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);

  return response.data;
};

export default {
  setToken,
  getUsers,
  getUser,
  addMovieToProfile,
  updateUser,
  deleteUser,
};
