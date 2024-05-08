import axios from "axios";
const baseUrl = "http://localhost:3001/api/users";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const createComment = async (newComment, userId) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(
    `${baseUrl}/${userId}/comments`,
    newComment,
    config
  );
  return response.data;
};

const getUsers = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUser = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export default { setToken, createComment, getUsers, getUser };
