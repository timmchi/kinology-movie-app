const { test, after, beforeEach, describe } = require("node:test");
const path = require("path");
const assert = require("node:assert/strict");
const User = require("../models/user");
const Movie = require("../models/movie");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

const getHash = async (pw) => {
  const testPasswordHash = await bcrypt.hash(pw, 10);
  return testPasswordHash;
};

const userPassword = "123123";

let createdUserId;

const userCredentials = {
  ...helper.users[0],
  name: "User Tester",
  password: userPassword,
  passwordConfirm: userPassword,
};

const secondUserCredentials = {
  ...helper.users[1],
  name: "Second User",
  password: userPassword,
  passwordConfirm: userPassword,
};

let token;
let secondUserToken;

const commentReceivingMovieId = helper.initialMovie.tmdbId;

describe("when there are users in the db usersRouter", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await getHash(userPassword);

    const userObjects = helper.users.map(
      (user) =>
        new User({ username: user.username, email: user.email, passwordHash })
    );
    const promiseArray = userObjects.map((user) => user.save());
    await Promise.all(promiseArray);
  });

  test("users are returned as json usersRouter", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there is a correct amount of users usersRouter", async () => {
    const users = await helper.usersInDb();

    assert.strictEqual(users.length, helper.users.length);
  });

  test("there is a user with a username 'userstester'", async () => {
    const usersAtStart = await helper.usersInDb();

    const usernames = usersAtStart.map((c) => c.username);
    assert(usernames.includes("userstester"));
  });

  test("a specific user can be viewed", async () => {
    const users = await helper.usersInDb();
    const specificUserUd = users[0].id;

    await api
      .get(`/api/users/${specificUserUd}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("when there are no users in the db", async () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("a user can be created", async () => {
    const usersAtStart = await helper.usersInDb();

    await api
      .post("/api/users")
      .send(userCredentials)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    const usernames = usersAtEnd.map((c) => c.username);

    assert(usernames.includes(userCredentials.username));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
  });

  describe("and a single user has been created", async () => {
    beforeEach(async () => {
      await api
        .post("/api/users")
        .send(userCredentials)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      createdUserId = usersAtEnd[0].id;
    });

    test("a user page can be accessed", async () => {
      await api
        .get(`/api/users/${createdUserId}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("a non logged-in user can not delete a profile", async () => {
      const usersAtStart = await helper.usersInDb();

      await api.delete(`/api/users/${createdUserId}`).expect(401);

      const usersAtEnd = await helper.usersInDb();

      const usernames = usersAtEnd.map((c) => c.username);

      assert(usernames.includes(userCredentials.username));
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("a non logged-in user can not update a profile", async () => {
      const usersAtStart = await helper.usersInDb();

      const avatar = path.resolve(__dirname, "testImage.png");

      await api
        .put(`/api/users/${createdUserId}`)
        .field("name", "Unsuccessful user")
        .field("bio", "I will not be updated")
        .attach("avatar", avatar)
        .expect(401);

      const usersAtEnd = await helper.usersInDb();

      assert.strictEqual(usersAtEnd[0].name, usersAtStart[0].name);
      assert.strictEqual(usersAtEnd[0].biography, usersAtStart[0].biography);
      assert.strictEqual(usersAtEnd[0].avatar, usersAtStart[0].avatar);
    });

    describe("and a user has logged in", async () => {
      beforeEach(async () => {
        const result = await api
          .post("/api/login")
          .send({ username: userCredentials.username, password: userPassword });

        token = result.body.token;
      });

      test("a user can delete their profile", async () => {
        const usersAtStart = await helper.usersInDb();

        await api
          .delete(`/api/users/${createdUserId}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(204);

        const usersAtEnd = await helper.usersInDb();

        const usernames = usersAtEnd.map((c) => c.username);

        assert(!usernames.includes(userCredentials.username));
        assert.strictEqual(usersAtEnd.length, usersAtStart.length - 1);
      });

      //   test("a user can update their profile", async () => {
      //     const avatar = path.resolve(__dirname, "testImage.png");

      //     await api
      //       .put(`/api/users/${createdUserId}`)
      //       .set("Authorization", `Bearer ${token}`)
      //       .field("name", "New User Name")
      //       .field("bio", "I am testing")
      //       .attach("avatar", avatar)
      //       .expect(200);

      //     const usersAtEnd = await helper.usersInDb();

      //     assert.strictEqual(usersAtEnd[0].name, "New User Name");
      //     assert.strictEqual(usersAtEnd[0].biography, "I am testing");
      //     assert.strictEqual(
      //       usersAtEnd[0].avatar,
      //       `${usersAtEnd[0].username}-avatar`
      //     );
      //   });

      describe("and a movie exists in a db", async () => {
        beforeEach(async () => {
          await Movie.deleteMany({});

          const movie = new Movie({
            tmdbId: helper.initialMovie.tmdbId,
            title: helper.initialMovie.title,
            poster: helper.initialMovie.poster,
          });

          await movie.save();
        });

        test("a user can add a movie to his watch later", async () => {
          const movies = await helper.moviesInDb();
          const movieData = movies[0];
          const button = "later";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          await api
            .post(`/api/users/${createdUserId}/movies`)
            .set("Authorization", `Bearer ${token}`)
            .send({ movie, button })
            .expect(201)
            .expect("Content-Type", /application\/json/);

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(
            movieData.id.toString(),
            usersAtEnd[0].watchLaterMovies[0].toString()
          );
        });

        test("a user can remove a movie from his watch later", async () => {
          const movies = await helper.moviesInDb();
          const movieData = movies[0];
          const button = "later";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          // adding a movie
          await api
            .post(`/api/users/${createdUserId}/movies`)
            .set("Authorization", `Bearer ${token}`)
            .send({ movie, button })
            .expect(201)
            .expect("Content-Type", /application\/json/);

          // then removing it
          await api
            .delete(`/api/users/${createdUserId}/movies/${movieData.tmdbId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ button })
            .expect(201)
            .expect("Content-Type", /application\/json/);

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(0, usersAtEnd[0].watchLaterMovies.length);
        });

        test("a user can add a movie to his favorites", async () => {
          const movies = await helper.moviesInDb();
          const movieData = movies[0];
          const button = "favorite";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          await api
            .post(`/api/users/${createdUserId}/movies`)
            .set("Authorization", `Bearer ${token}`)
            .send({ movie, button })
            .expect(201)
            .expect("Content-Type", /application\/json/);

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(
            movieData.id.toString(),
            usersAtEnd[0].favoriteMovies[0].toString()
          );
        });

        test("a user can remove a movie from his favorites", async () => {
          const movies = await helper.moviesInDb();
          const movieData = movies[0];
          const button = "favorite";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          // adding a movie
          await api
            .post(`/api/users/${createdUserId}/movies`)
            .set("Authorization", `Bearer ${token}`)
            .send({ movie, button })
            .expect(201)
            .expect("Content-Type", /application\/json/);

          // then removing it
          await api
            .delete(`/api/users/${createdUserId}/movies/${movieData.tmdbId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ button })
            .expect(201)
            .expect("Content-Type", /application\/json/);

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(0, usersAtEnd[0].favoriteMovies.length);
        });

        test("a user can add a movie to his seen", async () => {
          const movies = await helper.moviesInDb();
          const movieData = movies[0];
          const button = "watched";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          await api
            .post(`/api/users/${createdUserId}/movies`)
            .set("Authorization", `Bearer ${token}`)
            .send({ movie, button })
            .expect(201)
            .expect("Content-Type", /application\/json/);

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(
            movieData.id.toString(),
            usersAtEnd[0].watchedMovies[0].toString()
          );
        });

        test("a user can remove a movie from his seen", async () => {
          const movies = await helper.moviesInDb();
          const movieData = movies[0];
          const button = "watched";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          // adding a movie
          await api
            .post(`/api/users/${createdUserId}/movies`)
            .set("Authorization", `Bearer ${token}`)
            .send({ movie, button })
            .expect(201)
            .expect("Content-Type", /application\/json/);

          // then removing it
          await api
            .delete(`/api/users/${createdUserId}/movies/${movieData.tmdbId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ button })
            .expect(201)
            .expect("Content-Type", /application\/json/);

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(0, usersAtEnd[0].watchedMovies.length);
        });
      });

      describe("and another user exists in a db", async () => {
        beforeEach(async () => {
          // creating a second user
          await api
            .post("/api/users")
            .send(secondUserCredentials)
            .expect(201)
            .expect("Content-Type", /application\/json/);

          // logging in
          const result = await api.post("/api/login").send({
            username: secondUserCredentials.username,
            password: userPassword,
          });

          secondUserToken = result.body.token;
        });

        test("a user can not delete profile of another user", async () => {
          const usersAtStart = await helper.usersInDb();

          await api
            .delete(`/api/users/${createdUserId}`)
            .set("Authorization", `Bearer ${secondUserToken}`)
            .expect(401);

          const usersAtEnd = await helper.usersInDb();

          const usernames = usersAtEnd.map((c) => c.username);

          assert(usernames.includes(userCredentials.username));
          assert.strictEqual(usersAtEnd.length, usersAtStart.length);
        });

        test("a user can not edit profile of another user", async () => {
          const usersAtStart = await helper.usersInDb();

          const avatar = path.resolve(__dirname, "testImage.png");

          await api
            .put(`/api/users/${createdUserId}`)
            .set("Authorization", `Bearer ${secondUserToken}`)
            .field("name", "Unsuccessful user")
            .field("bio", "I will not be updated")
            .attach("avatar", avatar)
            .expect(401);

          const usersAtEnd = await helper.usersInDb();

          assert.strictEqual(usersAtEnd[0].name, usersAtStart[0].name);
          assert.strictEqual(
            usersAtEnd[0].biography,
            usersAtStart[0].biography
          );
          assert.strictEqual(usersAtEnd[0].avatar, usersAtStart[0].avatar);
        });

        describe("and a movie exists in a db", async () => {
          beforeEach(async () => {
            await Movie.deleteMany({});

            const movie = new Movie({
              tmdbId: helper.initialMovie.tmdbId,
              title: helper.initialMovie.title,
              poster: helper.initialMovie.poster,
            });

            await movie.save();
          });

          test("a user can not add a movie to another user favorites", async () => {
            const movies = await helper.moviesInDb();
            const movieData = movies[0];
            const button = "favorite";
            const movie = {
              id: movieData.tmdbId,
              title: movieData.title,
              poster: movieData.poster,
            };

            await api
              .post(`/api/users/${createdUserId}/movies`)
              .set("Authorization", `Bearer ${secondUserToken}`)
              .send({ movie, button })
              .expect(401);

            const usersAtEnd = await helper.usersInDb();
            assert.strictEqual(0, usersAtEnd[0].favoriteMovies.length);
          });

          test("a user can not add a movie to another user watch list", async () => {
            const movies = await helper.moviesInDb();
            const movieData = movies[0];
            const button = "later";
            const movie = {
              id: movieData.tmdbId,
              title: movieData.title,
              poster: movieData.poster,
            };

            await api
              .post(`/api/users/${createdUserId}/movies`)
              .set("Authorization", `Bearer ${secondUserToken}`)
              .send({ movie, button })
              .expect(401);

            const usersAtEnd = await helper.usersInDb();
            assert.strictEqual(0, usersAtEnd[0].watchLaterMovies.length);
          });

          test("a user can not add a movie to another user seen", async () => {
            const movies = await helper.moviesInDb();
            const movieData = movies[0];
            const button = "watched";
            const movie = {
              id: movieData.tmdbId,
              title: movieData.title,
              poster: movieData.poster,
            };

            await api
              .post(`/api/users/${createdUserId}/movies`)
              .set("Authorization", `Bearer ${secondUserToken}`)
              .send({ movie, button })
              .expect(401);

            const usersAtEnd = await helper.usersInDb();
            assert.strictEqual(0, usersAtEnd[0].watchedMovies.length);
          });

          describe("and a user has a movie in his favorites, watch list and seen", async () => {
            beforeEach(async () => {
              const movies = await helper.moviesInDb();
              const movieData = movies[0];
              const buttons = ["watched", "later", "favorite"];
              const movie = {
                id: movieData.tmdbId,
                title: movieData.title,
                poster: movieData.poster,
              };

              for (const button of buttons) {
                await api
                  .post(`/api/users/${createdUserId}/movies`)
                  .set("Authorization", `Bearer ${token}`)
                  .send({ movie, button })
                  .expect(201)
                  .expect("Content-Type", /application\/json/);
              }
            });

            test("a user can not remove a movie from another user favorites", async () => {
              const button = "favorite";

              await api
                .delete(`/api/users/${createdUserId}/movies/111`)
                .set("Authorization", `Bearer ${secondUserToken}`)
                .send({ button })
                .expect(401);

              const movieCreator = await User.findOne({
                username: "userstester",
              });

              assert.strictEqual(1, movieCreator.favoriteMovies.length);
            });

            test("a user can not remove a movie from another user watch list", async () => {
              const button = "later";

              await api
                .delete(`/api/users/${createdUserId}/movies/111`)
                .set("Authorization", `Bearer ${secondUserToken}`)
                .send({ button })
                .expect(401);

              const movieCreator = await User.findOne({
                username: "userstester",
              });

              assert.strictEqual(1, movieCreator.watchLaterMovies.length);
            });

            test("a user can not remove a movie from another user seen", async () => {
              const button = "watched";

              await api
                .delete(`/api/users/${createdUserId}/movies/111`)
                .set("Authorization", `Bearer ${secondUserToken}`)
                .send({ button })
                .expect(401);

              const movieCreator = await User.findOne({
                username: "userstester",
              });

              assert.strictEqual(1, movieCreator.watchedMovies.length);
            });

            test("a non logged in user can not remove a movie from another user favorites", async () => {});

            test("a non logged in user can not remove a movie from another user watch list", async () => {});

            test("a non logged in user can not remove a movie from another user seen", async () => {});
          });
        });
      });
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
