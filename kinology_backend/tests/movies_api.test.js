const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert/strict");
const User = require("../models/user");
const Movie = require("../models/movie");
const mongoose = require("mongoose");
const supertest = require("supertest");
const nock = require("nock");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("./test_helper");
const config = require("../utils/config");

const api = supertest(app);

describe("there are already movies in the db", async () => {
  beforeEach(async () => {
    await Movie.deleteMany({});

    const movieObjects = helper.mockMovies.map(
      (movie) =>
        new Movie({
          tmdbId: movie.tmdbId,
          title: movie.title,
          poster: movie.poster,
        })
    );
    const promiseArray = movieObjects.map((movie) => movie.save());
    await Promise.all(promiseArray);
  });

  test("movies are returned as json", async () => {
    await api
      .get("/api/movies")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there is a correct amount of movies", async () => {
    const movies = await helper.moviesInDb();

    assert.strictEqual(movies.length, helper.mockMovies.length);
  });

  test("there is a movie titled 'Easy Rider'", async () => {
    const moviesAtStart = await helper.moviesInDb();

    const titles = moviesAtStart.map((m) => m.title);
    assert(titles.includes("Easy Rider"));
  });
});

const mockResponse = {
  results: helper.mockMovies.map((movie) => ({
    id: movie.tmdbId,
    title: movie.title,
    poster_path: movie.poster,
  })),
  total_pages: 1,
};

after(async () => {
  await mongoose.connection.close();
});
