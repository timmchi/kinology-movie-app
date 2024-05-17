const UserComment = require("../models/userComment");
const Movie = require("../models/movie");

const initialComments = [
  { content: "This is a great movie" },
  { content: "This is a bad movie" },
  { content: "This user is my friend" },
  { content: "This user is my enemy" },
];

const initialUser = {
  username: "commentstester",
  email: "commentstester@example.com",
};

const secondUser = {
  username: "seconduser",
  email: "seconduser@example.com",
};

const initialMovie = {
  title: "Scarface",
  poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
  tmdbId: "111",
};

const commentsInDb = async () => {
  const comments = await UserComment.find({});
  return comments.map((comment) => comment.toJSON());
};

const moviesInDb = async () => {
  const movies = await Movie.find({});
  return movies.map((movie) => movie.toJSON());
};

const postComment = async (api, token, type, id, newComment) => {
  const response = await api
    .post(`/api/comments/${type}/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(newComment)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  return response.body;
};

const deleteComment = async (api, token, type, id, commentId, authorId) => {
  await api
    .delete(`/api/comments/${type}/${id}/${commentId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ authorId })
    .expect(204);
};

const failedDeleteComment = async (
  api,
  token,
  type,
  id,
  commentId,
  authorId
) => {
  await api
    .delete(`/api/comments/${type}/${id}/${commentId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ authorId })
    .expect(401);
};

module.exports = {
  initialComments,
  initialUser,
  commentsInDb,
  moviesInDb,
  postComment,
  deleteComment,
  failedDeleteComment,
  secondUser,
  initialMovie,
};
