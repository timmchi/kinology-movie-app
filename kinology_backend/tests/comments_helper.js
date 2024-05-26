const UserComment = require("../models/userComment");

const initialComments = [
  { content: "This is a great movie" },
  { content: "This is a bad movie" },
  { content: "This user is my friend" },
  { content: "This user is my enemy" },
]; // +

const initialUser = {
  username: "commentstester",
  email: "commentstester@example.com",
}; // +

const secondUser = {
  username: "seconduser",
  email: "seconduser@example.com",
}; // +

const users = [
  {
    username: "userstester",
    email: "userstester@example.com",
  },
  {
    username: "seconduser",
    email: "seconduser@example.com",
  },
  {
    username: "thirduser",
    email: "thirduser@example.com",
  },
]; // -

const secondLoginUser = {
  username: "logintester2",
  email: "logintester2@example.com",
}; // +

const initialMovie = {
  title: "Scarface",
  poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
  tmdbId: "111",
}; // +

const commentsInDb = async () => {
  const comments = await UserComment.find({});
  return comments.map((comment) => comment.toJSON());
}; // +

const postComment = async (api, token, type, id, newComment) => {
  const response = await api
    .post(`/api/comments/${type}/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(newComment)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  return response.body;
}; // +

const unauthorizedPostComment = async (api, type, id, newComment) => {
  const response = await api
    .post(`/api/comments/${type}/${id}`)
    .send(newComment)
    .expect(401);

  return response.body;
}; // +

const invalidPostComment = async (api, token, type, id, newComment) => {
  const response = await api
    .post(`/api/comments/${type}/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(newComment)
    .expect(400);

  return response.body;
}; // +

const deleteComment = async (api, token, type, id, commentId, authorId) => {
  await api
    .delete(`/api/comments/${type}/${id}/${commentId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ authorId })
    .expect(204);
}; // +

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
}; // +

const unauthorizedNoTokenDeleteComment = async (
  api,
  type,
  id,
  commentId,
  authorId
) => {
  await api
    .delete(`/api/comments/${type}/${id}/${commentId}`)
    .send({ authorId })
    .expect(401);
}; // +

const editComment = async (
  api,
  token,
  type,
  id,
  commentId,
  authorId,
  content
) => {
  await api
    .put(`/api/comments/${type}/${id}/${commentId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      content,
      authorId,
    })
    .expect(200)
    .expect("Content-Type", /application\/json/);
}; // +

const unauthorizedNoTokenEditComment = async (
  api,
  type,
  id,
  commentId,
  authorId,
  content
) => {
  await api
    .put(`/api/comments/${type}/${id}/${commentId}`)
    .send({
      content,
      authorId,
    })
    .expect(401);
}; // +

const unauthorizedEditComment = async (
  api,
  token,
  type,
  id,
  commentId,
  authorId,
  content
) => {
  await api
    .put(`/api/comments/${type}/${id}/${commentId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      content,
      authorId,
    })
    .expect(401);
}; // +

module.exports = {
  initialComments,
  initialUser,
  secondUser,
  users,
  initialMovie,
  commentsInDb,
  postComment,
  deleteComment,
  failedDeleteComment,
  unauthorizedPostComment,
  invalidPostComment,
  unauthorizedNoTokenDeleteComment,
  editComment,
  unauthorizedNoTokenEditComment,
  unauthorizedEditComment,
};
