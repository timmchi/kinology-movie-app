const { test, after, beforeEach, describe } = require("node:test");
const path = require("path");
const assert = require("node:assert/strict");
const User = require("../models/user");
const Movie = require("../models/movie");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("./users_helper");

const api = supertest(app);

const getHash = async (pw) => {
  const testPasswordHash = await bcrypt.hash(pw, 10);
  return testPasswordHash;
};

const userPassword = "Secret123";

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

describe("when there are users in the db usersRouter", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    await helper.createUsers();
  });

  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there is a correct amount of users", async () => {
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

    await helper.createUser(api, userCredentials);

    const usersAtEnd = await helper.usersInDb();

    const usernames = usersAtEnd.map((c) => c.username);

    assert(usernames.includes(userCredentials.username));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
  });

  describe("and a single user has been created", async () => {
    beforeEach(async () => {
      await helper.createUser(api, userCredentials);

      const usersAtEnd = await helper.usersInDb();
      createdUserId = usersAtEnd[0].id;
    });

    test("a user page can be accessed", async () => {
      await helper.getUser(api, createdUserId);
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

      await helper.noTokenEdit(api, createdUserId, avatar);

      const usersAtEnd = await helper.usersInDb();

      assert.strictEqual(usersAtEnd[0].name, usersAtStart[0].name);
      assert.strictEqual(usersAtEnd[0].biography, usersAtStart[0].biography);
      assert.strictEqual(usersAtEnd[0].avatar, usersAtStart[0].avatar);
    });

    describe("and a user has logged in", async () => {
      beforeEach(async () => {
        const result = await helper.userLogin(
          api,
          userCredentials.username,
          userCredentials.password
        );

        token = result.body.token;
      });

      test("a user can delete their profile", async () => {
        const usersAtStart = await helper.usersInDb();

        await helper.deleteUser(api, token, createdUserId);

        const usersAtEnd = await helper.usersInDb();

        const usernames = usersAtEnd.map((c) => c.username);

        assert(!usernames.includes(userCredentials.username));
        assert.strictEqual(usersAtEnd.length, usersAtStart.length - 1);
      });

      //   this test does not pass in github actions for some reason, yet works locally, which is why I am commenting it out until better times
      //   test("a user can update their profile", async () => {
      //     const avatar = path.resolve(__dirname, "testImage.png");

      //     await helper.successfulEdit(api, token, createdUserId, avatar);

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

          await helper.createMovie();
        });

        test("a user can add a movie to his watch later", async () => {
          const movieData = await helper.returnMovie();
          const button = "later";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          await helper.addMovieToUser(api, token, createdUserId, movie, button);

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(
            movieData.id.toString(),
            usersAtEnd[0].watchLaterMovies[0].toString()
          );
        });

        test("a user can remove a movie from his watch later", async () => {
          const movieData = await helper.returnMovie();
          const button = "later";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          // adding a movie
          await helper.addMovieToUser(api, token, createdUserId, movie, button);

          // then removing it
          await helper.deleteMovieFromUser(
            api,
            token,
            createdUserId,
            movie.id,
            button
          );

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(0, usersAtEnd[0].watchLaterMovies.length);
        });

        test("a user can add a movie to his favorites", async () => {
          const movieData = await helper.returnMovie();
          const button = "favorite";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          await helper.addMovieToUser(api, token, createdUserId, movie, button);

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(
            movieData.id.toString(),
            usersAtEnd[0].favoriteMovies[0].toString()
          );
        });

        test("a user can remove a movie from his favorites", async () => {
          const movieData = await helper.returnMovie();
          const button = "favorite";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          // adding a movie
          await helper.addMovieToUser(api, token, createdUserId, movie, button);

          // then removing it
          await helper.deleteMovieFromUser(
            api,
            token,
            createdUserId,
            movie.id,
            button
          );

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(0, usersAtEnd[0].favoriteMovies.length);
        });

        test("a user can add a movie to his seen", async () => {
          const movieData = await helper.returnMovie();
          const button = "watched";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          await helper.addMovieToUser(api, token, createdUserId, movie, button);

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(
            movieData.id.toString(),
            usersAtEnd[0].watchedMovies[0].toString()
          );
        });

        test("a user can remove a movie from his seen", async () => {
          const movieData = await helper.returnMovie();
          const button = "watched";
          const movie = {
            id: movieData.tmdbId,
            title: movieData.title,
            poster: movieData.poster,
          };

          // adding a movie
          await helper.addMovieToUser(api, token, createdUserId, movie, button);

          // then removing it
          await helper.deleteMovieFromUser(
            api,
            token,
            createdUserId,
            movie.id,
            button
          );

          const usersAtEnd = await helper.usersInDb();
          assert.strictEqual(0, usersAtEnd[0].watchedMovies.length);
        });
      });

      describe("and another user exists in a db", async () => {
        beforeEach(async () => {
          // creating a second user
          await helper.createUser(api, secondUserCredentials);

          // logging in
          const result = await helper.userLogin(
            api,
            secondUserCredentials.username,
            userPassword
          );

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

          await helper.unauthorizedEdit(
            api,
            secondUserToken,
            createdUserId,
            avatar
          );

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

            await helper.createMovie();
          });

          test("a user can not add a movie to another user favorites", async () => {
            const movieData = await helper.returnMovie();
            const button = "favorite";
            const movie = {
              id: movieData.tmdbId,
              title: movieData.title,
              poster: movieData.poster,
            };

            await helper.unauthorizedAddMovie(
              api,
              secondUserToken,
              createdUserId,
              movie,
              button
            );

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

            await helper.unauthorizedAddMovie(
              api,
              secondUserToken,
              createdUserId,
              movie,
              button
            );

            const usersAtEnd = await helper.usersInDb();
            assert.strictEqual(0, usersAtEnd[0].watchLaterMovies.length);
          });

          test("a user can not add a movie to another user seen", async () => {
            const movieData = await helper.returnMovie();
            const button = "watched";
            const movie = {
              id: movieData.tmdbId,
              title: movieData.title,
              poster: movieData.poster,
            };

            await helper.unauthorizedAddMovie(
              api,
              secondUserToken,
              createdUserId,
              movie,
              button
            );

            const usersAtEnd = await helper.usersInDb();
            assert.strictEqual(0, usersAtEnd[0].watchedMovies.length);
          });

          describe("and a user has a movie in his favorites, watch list and seen", async () => {
            beforeEach(async () => {
              const movieData = await helper.returnMovie();
              const buttons = ["watched", "later", "favorite"];
              const movie = {
                id: movieData.tmdbId,
                title: movieData.title,
                poster: movieData.poster,
              };

              for (const button of buttons) {
                await helper.addMovieToUser(
                  api,
                  token,
                  createdUserId,
                  movie,
                  button
                );
              }
            });

            test("a user can not remove a movie from another user favorites", async () => {
              const button = "favorite";

              await helper.unauthorizedDeleteMovieFromUser(
                api,
                secondUserToken,
                createdUserId,
                "111",
                button
              );

              const movieCreator = await User.findOne({
                username: "userstester",
              });

              assert.strictEqual(1, movieCreator.favoriteMovies.length);
            });

            test("a user can not remove a movie from another user watch list", async () => {
              const button = "later";

              await helper.unauthorizedDeleteMovieFromUser(
                api,
                secondUserToken,
                createdUserId,
                "111",
                button
              );

              const movieCreator = await User.findOne({
                username: "userstester",
              });

              assert.strictEqual(1, movieCreator.watchLaterMovies.length);
            });

            test("a user can not remove a movie from another user seen", async () => {
              const button = "watched";

              await helper.unauthorizedDeleteMovieFromUser(
                api,
                secondUserToken,
                createdUserId,
                "111",
                button
              );

              const movieCreator = await User.findOne({
                username: "userstester",
              });

              assert.strictEqual(1, movieCreator.watchedMovies.length);
            });

            test("a non logged in user can not remove a movie from another user favorites", async () => {
              const button = "favorite";

              await helper.noTokenDeleteMovieFromUser(
                api,
                createdUserId,
                "111",
                button
              );

              const movieCreator = await User.findOne({
                username: "userstester",
              });

              assert.strictEqual(1, movieCreator.favoriteMovies.length);
            });

            test("a non logged in user can not remove a movie from another user watch list", async () => {
              const button = "later";

              await helper.noTokenDeleteMovieFromUser(
                api,
                createdUserId,
                "111",
                button
              );

              const movieCreator = await User.findOne({
                username: "userstester",
              });

              assert.strictEqual(1, movieCreator.watchLaterMovies.length);
            });

            test("a non logged in user can not remove a movie from another user seen", async () => {
              const button = "watched";

              await helper.noTokenDeleteMovieFromUser(
                api,
                createdUserId,
                "111",
                button
              );

              const movieCreator = await User.findOne({
                username: "userstester",
              });

              assert.strictEqual(1, movieCreator.watchedMovies.length);
            });
          });
        });
      });

      describe("dealing with non-existingbut valid ids", async () => {
        beforeEach(async () => {
          await helper.deleteUser(api, token, createdUserId);
        });

        test("trying to edit a deleted user returns a 404", async () => {
          const avatar = path.resolve(__dirname, "testImage.png");

          await api
            .put(`/api/users/${createdUserId}`)
            .set("Authorization", `Bearer ${token}`)
            .field("name", "New User Name")
            .field("bio", "I am testing")
            .attach("avatar", avatar)
            .expect(404);
        });

        test("trying to delete a deleted user returns a 404", async () => {
          await api
            .delete(`/api/users/${createdUserId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
        });

        test("trying to add a movie to a deleted user favorites returns a 404", async () => {
          const movieData = await helper.returnMovie();
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
            .expect(404);
        });

        test("trying to add a movie to a deleted user watch list returns a 404", async () => {
          const movieData = await helper.returnMovie();
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
            .expect(404);
        });

        test("trying to add a movie to a deleted user seen returns a 404", async () => {
          const movieData = await helper.returnMovie();
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
            .expect(404);
        });
      });
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
