import axios from "axios";
const baseUrl = "http://localhost:3001/api/comments";

const getComments = async (id, type) => {
  const url = `${baseUrl}/${type}/${id}`;
  const response = await axios.get(url);
  return response.data;
};

const createProfileComment = async (profileId, comment, currentUser) => {
  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
  };

  const response = await axios.post(
    `${baseUrl}/profile/${profileId}`,
    { content: comment },
    config
  );
  return response.data;
};

const updateProfileComment = async (
  profileId,
  commentId,
  currentUser,
  content,
  authorId
) => {
  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
  };

  const response = await axios.put(
    `${baseUrl}/profile/${profileId}/${commentId}`,
    { content: content, authorId },
    config
  );
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

  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
  };

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
    headers: { Authorization: `Bearer ${currentUser.token}` },
    data: {
      authorId,
    },
  };

  const url = `${baseUrl}/${type}/${receiverId}/${commentId}`;

  const response = await axios.delete(url, config);
  return response.data;
};

const createMovieComment = async (
  movieId,
  comment,
  currentUser,
  movieTitle,
  moviePoster
) => {
  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
  };

  const response = await axios.post(
    `${baseUrl}/movie/${movieId}`,
    { content: comment, movieTitle, moviePoster },
    config
  );
  return response.data;
};

const updateMovieComment = async (
  movieId,
  commentId,
  currentUser,
  content,
  authorId
) => {
  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
  };

  const response = await axios.put(
    `${baseUrl}/movie/${movieId}/${commentId}`,
    { content: content, authorId: authorId },
    config
  );
  return response.data;
};

export default {
  getComments,
  createProfileComment,
  updateProfileComment,
  createMovieComment,
  updateMovieComment,
  deleteComment,
  updateComment,
};
