import axios from "axios";
const baseUrl = "http://localhost:3001/api/comments";

const getProfileComments = async (profileId) => {
  const response = await axios.get(`${baseUrl}/profile/${profileId}`);
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

const deleteProfileComment = async (
  profileId,
  commentId,
  currentUser,
  authorId
) => {
  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
    data: {
      authorId,
    },
  };

  const response = await axios.delete(
    `${baseUrl}/profile/${profileId}/${commentId}`,
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

// Big TODO - refactor these so I can use same service for both movie and profile comments. These functions repeat a lot, so I'm thinking base it on a word movie/profile?

const getMovieComments = async (movieId) => {
  const response = await axios.get(`${baseUrl}/movie/${movieId}`);
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

const deleteMovieComment = async (
  movieId,
  commentId,
  currentUser,
  authorId
) => {
  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
    data: {
      authorId,
    },
  };

  const response = await axios.delete(
    `${baseUrl}/movie/${movieId}/${commentId}`,
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
  getProfileComments,
  createProfileComment,
  deleteProfileComment,
  updateProfileComment,
  getMovieComments,
  createMovieComment,
  deleteMovieComment,
  updateMovieComment,
};
