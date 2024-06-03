import axios from "axios";
const baseUrl = "/api/users";

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

const getUserAvatar = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}/avatar`);
  return response.data;
};

const addMovieToProfile = async (movie, button, userId) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(
    `${baseUrl}/${userId}/movies`,
    { movie, button },
    config
  );
  return response.data;
};

const removeMovieFromProfile = async (movie, button, userId) => {
  const config = {
    headers: { Authorization: token },
    data: {
      button,
    },
  };

  const response = await axios.delete(
    `${baseUrl}/${userId}/movies/${movie.id}`,
    config
  );
  return response.data;
};

const updateUser = async (id, formData) => {
  const config = {
    headers: { Authorization: token, "Content-Type": "multipart/form-data" },
  };
  const response = await axios.put(`${baseUrl}/${id}`, formData, config);
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
  removeMovieFromProfile,
  getUserAvatar,
};
