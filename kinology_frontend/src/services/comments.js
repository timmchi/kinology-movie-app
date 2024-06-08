import axios from "axios";
const baseUrl = "/api/comments";

const getConfig = (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return config;
};

// Movie and profile comments used to have their own functions, but were refactored to use type instead, which is either 'movie' or 'profile'. Type is used to craft the link, and the backend then handles the rest.

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
  // to delete the comment, there is a check in the backend which uses the comment author id. The proper way to send body with delete request is through the config.
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

  // movieTitle and moviePoster are sent with a movieComment so that a movie can be created in the backend if it is not yet created. This is because TMDB is used for the movies unless there user comments or adds the movie to the their profile as to not clutter the db.
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
