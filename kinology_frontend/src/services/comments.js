import axios from "axios";
const baseUrl = "/api/comments";

const getConfig = (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return config;
};

const getComments = async (id, type) => {
  const url = `${baseUrl}/${type}/${id}`;
  const response = await axios.get(url);
  return response.data;
};

const updateComment = async (
  receiverId,
  commentId,
  currentUser,
  content,
  authorId,
  type
) => {
  const url = `${baseUrl}/${type}/${receiverId}/${commentId}`;

  const config = getConfig(currentUser.token);

  const response = await axios.put(url, { content, authorId }, config);

  return response.data;
};

const deleteComment = async (
  receiverId,
  commentId,
  currentUser,
  authorId,
  type
) => {
  const config = {
    ...getConfig(currentUser.token),
    data: {
      authorId,
    },
  };

  const url = `${baseUrl}/${type}/${receiverId}/${commentId}`;

  const response = await axios.delete(url, config);
  return response.data;
};

const createComment = async (
  receiverId,
  comment,
  currentUser,
  type,
  movieTitle,
  moviePoster
) => {
  const config = getConfig(currentUser.token);

  const url = `${baseUrl}/${type}/${receiverId}`;
  const body = {
    content: comment,
    ...(type === "movie" && { movieTitle, moviePoster }),
  };

  const response = await axios.post(url, body, config);
  return response.data;
};

export default {
  getComments,
  createComment,
  deleteComment,
  updateComment,
};
