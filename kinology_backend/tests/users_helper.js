const Movie = require("../models/movie");
const User = require("../models/user");
const bcrypt = require("bcrypt");

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
];

const initialMovie = {
  title: "Scarface",
  poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
  tmdbId: "111",
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const moviesInDb = async () => {
  const movies = await Movie.find({});
  return movies.map((movie) => movie.toJSON());
};

const returnMovie = async () => {
  const movies = await moviesInDb();
  return movies[0];
};

const getHash = async (pw) => {
  const testPasswordHash = await bcrypt.hash(pw, 10);
  return testPasswordHash;
};

const createUsers = async () => {
  const passwordHash = await getHash("123123");

  const userObjects = users.map(
    (user) =>
      new User({ username: user.username, email: user.email, passwordHash })
  );
  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
};

const createUser = async (api, userCredentials) => {
  await api
    .post("/api/users")
    .send(userCredentials)
    .expect(201)
    .expect("Content-Type", /application\/json/);
};

const getUser = async (api, userId) => {
  await api
    .get(`/api/users/${userId}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
};

const deleteUser = async (api, token, userId) => {
  await api
    .delete(`/api/users/${userId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);
};

const noTokenEdit = async (api, userId, avatar) => {
  await api
    .put(`/api/users/${userId}`)
    .field("name", "Unsuccessful user")
    .field("bio", "I will not be updated")
    .attach("avatar", avatar)
    .expect(401);
};

const successfulEdit = async (api, token, userId, avatar) => {
  await api
    .put(`/api/users/${userId}`)
    .set("Authorization", `Bearer ${token}`)
    .field("name", "New User Name")
    .field("bio", "I am testing")
    .attach("avatar", avatar)
    .expect(200);
};

const unauthorizedEdit = async (api, token, userId, avatar) => {
  await api
    .put(`/api/users/${userId}`)
    .set("Authorization", `Bearer ${token}`)
    .field("name", "Unsuccessful user")
    .field("bio", "I will not be updated")
    .attach("avatar", avatar)
    .expect(401);
};

const userLogin = async (api, username, password) => {
  const result = await api.post("/api/login").send({ username, password });
  return result;
};

const createMovie = async () => {
  const movie = new Movie({
    ...initialMovie,
  });

  await movie.save();
};

const addMovieToUser = async (api, token, userId, movie, button) => {
  await api
    .post(`/api/users/${userId}/movies`)
    .set("Authorization", `Bearer ${token}`)
    .send({ movie, button })
    .expect(201)
    .expect("Content-Type", /application\/json/);
};

const unauthorizedAddMovie = async (api, token, userId, movie, button) => {
  await api
    .post(`/api/users/${userId}/movies`)
    .set("Authorization", `Bearer ${token}`)
    .send({ movie, button })
    .expect(401);
};

const deleteMovieFromUser = async (api, token, userId, movieId, button) => {
  await api
    .delete(`/api/users/${userId}/movies/${movieId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ button })
    .expect(201)
    .expect("Content-Type", /application\/json/);
};

const unauthorizedDeleteMovieFromUser = async (
  api,
  token,
  userId,
  movieId,
  button
) => {
  await api
    .delete(`/api/users/${userId}/movies/${movieId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ button })
    .expect(401);
};

const noTokenDeleteMovieFromUser = async (api, userId, movieId, button) => {
  await api
    .delete(`/api/users/${userId}/movies/${movieId}`)
    .send({ button })
    .expect(401);
};

module.exports = {
  users,
  initialMovie,
  moviesInDb,
  returnMovie,
  usersInDb,
  createUsers,
  createUser,
  getUser,
  deleteUser,
  noTokenEdit,
  successfulEdit,
  unauthorizedEdit,
  userLogin,
  createMovie,
  addMovieToUser,
  deleteMovieFromUser,
  unauthorizedAddMovie,
  unauthorizedDeleteMovieFromUser,
  noTokenDeleteMovieFromUser,
};
