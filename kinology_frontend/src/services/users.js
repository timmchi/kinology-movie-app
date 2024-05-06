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
