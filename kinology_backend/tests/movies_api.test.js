const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert/strict");
const Movie = require("../models/movie");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./movies_helper");

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

after(async () => {
  await mongoose.connection.close();
});
