const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert/strict");
const UserComment = require("../models/userComment");
const User = require("../models/user");
const Movie = require("../models/movie");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("./comments_helper");

const api = supertest(app);

const getHash = async (pw) => {
  const testPasswordHash = await bcrypt.hash(pw, 10);
  return testPasswordHash;
};

// tokens are used for authentication
let token;
let secondUserToken;
// receiverId is the profile to which the comments will be sent
let receiverId;
const commentReceivingMovieId = helper.initialMovie.tmdbId;

describe("when there are comments in the db", () => {
  beforeEach(async () => {
    await UserComment.deleteMany({});

    const commentObjects = helper.initialComments.map(
      (comment) => new UserComment(comment)
    );
    const promiseArray = commentObjects.map((comment) => comment.save());
    await Promise.all(promiseArray);
  });

  test("comments are returned as json", async () => {
    await api
      .get("/api/comments")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there is a correct amount of comments", async () => {
    const commentsAtEnd = await helper.commentsInDb();

    assert.strictEqual(commentsAtEnd.length, helper.initialComments.length);
  });

  test("there is a comment about a great movie", async () => {
    const commentsAtEnd = await helper.commentsInDb();

    const contents = commentsAtEnd.map((c) => c.content);
    assert(contents.includes("This is a great movie"));
  });
});

describe("a user already exists and no comments in db", async () => {
  beforeEach(async () => {
    await UserComment.deleteMany({});

    // creating a user
    await User.deleteMany({});
    const passwordHash = await getHash("Secret123");
    const user = new User({
      username: helper.initialUser.username,
      email: helper.initialUser.email,
      passwordHash,
    });
    await user.save();
    receiverId = user._id.toString();

    // logging in and getting a token
    const result = await api
      .post("/api/login")
      .send({ username: "commentstester", password: "Secret123" });

    token = result.body.token;
  });

  // CREATION TESTS
  describe("comment creation", async () => {
    test("a valid comment can be added to a user profile by a logged in user", async () => {
      const newComment = { content: "I am a comment created by a test user" };

      await helper.postComment(api, token, "profile", receiverId, newComment);

      const commentsAtEnd = await helper.commentsInDb();

      const contents = commentsAtEnd.map((c) => c.content);

      assert.strictEqual(commentsAtEnd.length, 1);

      assert(contents.includes("I am a comment created by a test user"));
    });

    test("a profile comment by a not logged in user will not be added", async () => {
      const newComment = {
        content: "I will not be added",
      };

      await helper.unauthorizedPostComment(
        api,
        "profile",
        receiverId,
        newComment
      );

      const commentsAtEnd = await helper.commentsInDb();

      const contents = commentsAtEnd.map((c) => c.content);

      assert.strictEqual(commentsAtEnd.length, 0);

      assert(!contents.includes(newComment.content));
    });

    test("empty comment is not added to a user profile", async () => {
      const newComment = {};

      await helper.invalidPostComment(
        api,
        token,
        "profile",
        receiverId,
        newComment
      );

      const commentsAtEnd = await helper.commentsInDb();

      assert.strictEqual(commentsAtEnd.length, 0);
    });

    describe("and there are no movies in db", async () => {
      beforeEach(async () => {
        await Movie.deleteMany({});
      });

      test("a valid comment can be added to a movie by a logged in user", async () => {
        const newMovieComment = {
          content: "I love Scarface",
          movieTitle: helper.initialMovie.title,
          moviePoster: helper.initialMovie.poster,
        };

        await helper.postComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newMovieComment
        );

        const commentsAtEnd = await helper.commentsInDb();

        const contents = commentsAtEnd.map((c) => c.content);

        assert.strictEqual(commentsAtEnd.length, 1);

        assert(contents.includes("I love Scarface"));
      });

      test("a comment will not be added to a movie if the user is not logged in", async () => {
        const newMovieComment = {
          content: "I love Scarface",
          movieTitle: helper.initialMovie.title,
          moviePoster: helper.initialMovie.poster,
        };

        await helper.unauthorizedPostComment(
          api,
          "movie",
          commentReceivingMovieId,
          newMovieComment
        );

        const commentsAtEnd = await helper.commentsInDb();

        const contents = commentsAtEnd.map((c) => c.content);

        assert.strictEqual(commentsAtEnd.length, 0);

        assert(!contents.includes("I love Scarface"));
      });

      test("empty comment is not added to a movie", async () => {
        const newMovieComment = {
          movieTitle: helper.initialMovie.title,
          moviePoster: helper.initialMovie.poster,
        };

        await helper.invalidPostComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newMovieComment
        );

        const commentsAtEnd = await helper.commentsInDb();

        assert.strictEqual(commentsAtEnd.length, 0);
      });
    });

    describe("and a movie already exists in a db", async () => {
      beforeEach(async () => {
        // creating a movie
        await Movie.deleteMany({});

        const movie = new Movie({
          tmdbId: helper.initialMovie.tmdbId,
          title: helper.initialMovie.title,
          poster: helper.initialMovie.poster,
        });

        await movie.save();
      });

      test("a valid comment can be added to a movie by a logged in user", async () => {
        const newComment = {
          content: "I love Scarface",
        };

        await helper.postComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newComment
        );

        const commentsAtEnd = await helper.commentsInDb();

        const contents = commentsAtEnd.map((c) => c.content);

        assert.strictEqual(commentsAtEnd.length, 1);

        assert(contents.includes("I love Scarface"));
      });

      test("a comment will not be added to a movie if the user is not logged in", async () => {
        const newComment = {
          content: "I am not logged in but I love this movie",
        };

        await helper.unauthorizedPostComment(
          api,
          "movie",
          commentReceivingMovieId,
          newComment
        );

        const commentsAtEnd = await helper.commentsInDb();

        const contents = commentsAtEnd.map((c) => c.content);

        assert.strictEqual(commentsAtEnd.length, 0);

        assert(!contents.includes("I am not logged in but I love this movie"));
      });

      test("empty comment is not added to a movie", async () => {
        const newComment = {};

        await helper.invalidPostComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newComment
        );

        const commentsAtEnd = await helper.commentsInDb();

        assert.strictEqual(commentsAtEnd.length, 0);
      });
    });
  });

  // DELETION TESTS
  describe("comment deletion", async () => {
    test("a profile comment can be deleted by its author", async () => {
      const newComment = { content: "I am not long for this world" };

      await helper.postComment(api, token, "profile", receiverId, newComment);

      const commentsAtStart = await helper.commentsInDb();
      const commentToDelete = commentsAtStart.find(
        (comment) => comment.content === newComment.content
      );

      await helper.deleteComment(
        api,
        token,
        "profile",
        receiverId,
        commentToDelete.id,
        commentToDelete.author.toString()
      );

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(!contents.includes(commentToDelete.content));
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1);
    });

    test("a profile comment cannot be deleted when not logged in", async () => {
      const newComment = { content: "I will not be deleted" };

      await helper.postComment(api, token, "profile", receiverId, newComment);

      const commentsAtStart = await helper.commentsInDb();
      const commentToDelete = commentsAtStart[0];

      helper.unauthorizedNoTokenDeleteComment(
        api,
        "profile",
        receiverId,
        commentToDelete.id,
        commentToDelete.author.toString()
      );

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(contents.includes(commentToDelete.content));
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length);
    });

    describe("and there are no movies in db", async () => {
      beforeEach(async () => {
        await Movie.deleteMany({});
      });

      test("a movie comment can be deleted by its author", async () => {
        const newMovieComment = {
          content: "I am the author and I will delete this comment",
          movieTitle: helper.initialMovie.title,
          moviePoster: helper.initialMovie.poster,
        };

        await helper.postComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newMovieComment
        );

        const commentsAtStart = await helper.commentsInDb();

        const commentToDelete = commentsAtStart.find(
          (comment) =>
            comment.content === "I am the author and I will delete this comment"
        );

        await helper.deleteComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          commentToDelete.id,
          commentToDelete.author.toString()
        );

        const commentsAtEnd = await helper.commentsInDb();

        const contents = commentsAtEnd.map((c) => c.content);
        assert(!contents.includes(commentToDelete.content));

        assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1);
      });

      test("a movie comment can not be deleted when not logged in", async () => {
        const newMovieComment = {
          content: "I am a movie comment and I will not be deleted",
          movieTitle: helper.initialMovie.title,
          moviePoster: helper.initialMovie.poster,
        };

        await helper.postComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newMovieComment
        );

        const commentsAtStart = await helper.commentsInDb();

        const commentToDelete = commentsAtStart[0];

        await helper.unauthorizedNoTokenDeleteComment(
          api,
          "movie",
          commentReceivingMovieId,
          commentToDelete.id,
          commentToDelete.author.toString()
        );

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(contents.includes(commentToDelete.content));

        assert.strictEqual(commentsAtEnd.length, 1);
      });
    });

    describe("and a movie already exists in a db", async () => {
      beforeEach(async () => {
        // creating a movie
        await Movie.deleteMany({});

        const movie = new Movie({
          tmdbId: helper.initialMovie.tmdbId,
          title: helper.initialMovie.title,
          poster: helper.initialMovie.poster,
        });

        await movie.save();
      });
      test("a movie comment can be deleted by its author", async () => {
        const newComment = {
          content: "I am the author and I will delete this comment",
        };

        await helper.postComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newComment
        );

        const commentsAtStart = await helper.commentsInDb();

        const commentToDelete = commentsAtStart.find(
          (comment) =>
            comment.content === "I am the author and I will delete this comment"
        );

        await helper.deleteComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          commentToDelete.id,
          commentToDelete.author.toString()
        );

        const commentsAtEnd = await helper.commentsInDb();

        const contents = commentsAtEnd.map((c) => c.content);
        assert(!contents.includes(commentToDelete.content));

        assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1);
      });

      test("a movie comment can not be deleted when not logged in", async () => {
        const newComment = {
          content: "I am a movie comment and I will not be deleted",
        };

        await helper.postComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newComment
        );

        const commentsAtStart = await helper.commentsInDb();

        const commentToDelete = commentsAtStart[0];

        await helper.unauthorizedNoTokenDeleteComment(
          api,
          "movie",
          commentReceivingMovieId,
          commentToDelete.id,
          commentToDelete.author.toString()
        );

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(contents.includes(commentToDelete.content));

        assert.strictEqual(commentsAtEnd.length, 1);
      });
    });

    describe("there is another user in db when deleting", async () => {
      beforeEach(async () => {
        // creation of a second user
        const passwordHash = await getHash("Secret654321");
        const user = new User({
          username: helper.secondUser.username,
          email: helper.secondUser.email,
          passwordHash,
        });
        await user.save();

        // logging in with second user's credentials
        const result = await api
          .post("/api/login")
          .send({
            username: helper.secondUser.username,
            password: "Secret654321",
          });

        secondUserToken = result.body.token;
      });

      test("a profile comment can not be deleted by another user if this user is not the profile owner", async () => {
        const newComment = {
          content: "I can only be deleted by my author",
        };

        await helper.postComment(api, token, "profile", receiverId, newComment);

        const commentsAtStart = await helper.commentsInDb();

        const commentToDelete = commentsAtStart[0];

        await helper.failedDeleteComment(
          api,
          secondUserToken,
          "profile",
          receiverId,
          commentToDelete.id,
          commentToDelete.author.toString()
        );

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(contents.includes(commentToDelete.content));

        assert.strictEqual(commentsAtEnd.length, 1);
      });

      test("a user can delete a comment on his profile even if he is not the author", async () => {
        const newComment = {
          content: "I can be deleted by my author or the profile owner",
        };

        await helper.postComment(
          api,
          secondUserToken,
          "profile",
          receiverId,
          newComment
        );

        const commentsAtStart = await helper.commentsInDb();

        const commentToDelete = commentsAtStart[0];

        await helper.deleteComment(
          api,
          token,
          "profile",
          receiverId,
          commentToDelete.id,
          commentToDelete.author.toString()
        );

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(!contents.includes(commentToDelete.content));

        assert.strictEqual(commentsAtEnd.length, 0);
      });

      describe("and there are no movies in db", async () => {
        beforeEach(async () => {
          // creating a movie
          await Movie.deleteMany({});
        });

        test("a movie comment can not be deleted by another user", async () => {
          const newMovieComment = {
            content: "I can only be deleted by my author",
            movieTitle: helper.initialMovie.title,
            moviePoster: helper.initialMovie.poster,
          };

          await helper.postComment(
            api,
            token,
            "movie",
            commentReceivingMovieId,
            newMovieComment
          );

          const commentsAtStart = await helper.commentsInDb();

          const commentToDelete = commentsAtStart[0];

          await helper.failedDeleteComment(
            api,
            secondUserToken,
            "movie",
            commentReceivingMovieId,
            commentToDelete.id,
            commentToDelete.author.toString()
          );

          const commentsAtEnd = await helper.commentsInDb();
          const contents = commentsAtEnd.map((c) => c.content);

          assert(contents.includes(commentToDelete.content));

          assert.strictEqual(commentsAtEnd.length, 1);
        });
      });

      describe("and a movie already exists in a db", async () => {
        beforeEach(async () => {
          // creating a movie
          await Movie.deleteMany({});

          const movie = new Movie({
            tmdbId: helper.initialMovie.tmdbId,
            title: helper.initialMovie.title,
            poster: helper.initialMovie.poster,
          });

          await movie.save();
        });

        test("a movie comment can not be deleted by another user", async () => {
          const newComment = {
            content: "I can only be deleted by my author",
          };

          await helper.postComment(
            api,
            token,
            "movie",
            commentReceivingMovieId,
            newComment
          );

          const commentsAtStart = await helper.commentsInDb();

          const commentToDelete = commentsAtStart[0];

          await helper.failedDeleteComment(
            api,
            secondUserToken,
            "movie",
            commentReceivingMovieId,
            commentToDelete.id,
            commentToDelete.author.toString()
          );

          const commentsAtEnd = await helper.commentsInDb();
          const contents = commentsAtEnd.map((c) => c.content);

          assert(contents.includes(commentToDelete.content));

          assert.strictEqual(commentsAtEnd.length, 1);
        });
      });
    });
  });

  describe("editing a comment", async () => {
    test("a profile comment can be edited by its author", async () => {
      const newComment = {
        content: "I will be edited by my author",
      };

      await helper.postComment(api, token, "profile", receiverId, newComment);

      const commentsAtStart = await helper.commentsInDb();

      const commentToEdit = commentsAtStart[0];

      await helper.editComment(
        api,
        token,
        "profile",
        receiverId,
        commentToEdit.id,
        commentToEdit.author.toString(),
        "I have been edited"
      );

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(!contents.includes(commentToEdit.content));
      assert(contents.includes("I have been edited"));
    });

    test("a profile comment can not be edited without logging in", async () => {
      const newComment = {
        content: "Users other than my author can not edit me",
      };

      await helper.postComment(api, token, "profile", receiverId, newComment);

      const commentsAtStart = await helper.commentsInDb();

      const commentToEdit = commentsAtStart[0];

      await helper.unauthorizedNoTokenEditComment(
        api,
        "profile",
        receiverId,
        commentToEdit.id,
        commentToEdit.author.toString(),
        "These efforts are futile"
      );

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(contents.includes(commentToEdit.content));
      assert(!contents.includes("These efforts are futile"));
    });

    describe("and there are no movies in db", async () => {
      beforeEach(async () => {
        await Movie.deleteMany({});
      });

      test("a movie comment author can edit their comment", async () => {
        const newMovieComment = {
          content: "I will be edited by my author",
          movieTitle: helper.initialMovie.title,
          moviePoster: helper.initialMovie.poster,
        };

        await helper.postComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newMovieComment
        );

        const commentsAtStart = await helper.commentsInDb();

        const commentToEdit = commentsAtStart[0];

        await helper.editComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          commentToEdit.id,
          commentToEdit.author.toString(),
          "I have been edited"
        );

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(!contents.includes(commentToEdit.content));
        assert(contents.includes("I have been edited"));
      });

      test("a movie comment can not be edited when not logged in", async () => {
        const newMovieComment = {
          content: "Users other than my author can not edit me",
          movieTitle: helper.initialMovie.title,
          moviePoster: helper.initialMovie.poster,
        };

        await helper.postComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newMovieComment
        );

        const commentsAtStart = await helper.commentsInDb();

        const commentToEdit = commentsAtStart[0];

        await helper.unauthorizedNoTokenEditComment(
          api,
          "movie",
          commentReceivingMovieId,
          commentToEdit.id,
          commentToEdit.author.toString(),
          "These efforts are futile"
        );

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(contents.includes(commentToEdit.content));
        assert(!contents.includes("These efforts are futile"));
      });
    });

    describe("and a movie already exists in a db", async () => {
      beforeEach(async () => {
        // creating a movie
        await Movie.deleteMany({});

        const movie = new Movie({
          tmdbId: helper.initialMovie.tmdbId,
          title: helper.initialMovie.title,
          poster: helper.initialMovie.poster,
        });

        await movie.save();
      });

      test("a movie comment author can edit their comment", async () => {
        const newComment = {
          content: "I will be edited by my author",
        };

        await helper.postComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newComment
        );

        const commentsAtStart = await helper.commentsInDb();

        const commentToEdit = commentsAtStart[0];

        await helper.editComment(
          api,
          token,
          "profile",
          commentReceivingMovieId,
          commentToEdit.id,
          commentToEdit.author.toString(),
          "I have been edited"
        );

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(!contents.includes(commentToEdit.content));
        assert(contents.includes("I have been edited"));
      });

      test("a movie comment can not be edited when not logged in", async () => {
        const newComment = {
          content: "Users other than my author can not edit me",
        };

        await helper.postComment(
          api,
          token,
          "movie",
          commentReceivingMovieId,
          newComment
        );

        const commentsAtStart = await helper.commentsInDb();

        const commentToEdit = commentsAtStart[0];

        await helper.unauthorizedNoTokenEditComment(
          api,
          "movie",
          commentReceivingMovieId,
          commentToEdit.id,
          commentToEdit.author.toString(),
          "These efforts are futile"
        );

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(contents.includes(commentToEdit.content));
        assert(!contents.includes("These efforts are futile"));
      });
    });

    describe("there is another user in db when editing", async () => {
      beforeEach(async () => {
        // creation of a second user
        const passwordHash = await getHash("Secret654321");
        const user = new User({
          username: helper.secondUser.username,
          email: helper.secondUser.email,
          passwordHash,
        });
        await user.save();

        // logging in with second user's credentials
        const result = await api
          .post("/api/login")
          .send({
            username: helper.secondUser.username,
            password: "Secret654321",
          });

        secondUserToken = result.body.token;
      });

      test("only the comment author can edit the comment, author = receiver", async () => {
        const newComment = {
          content:
            "In this case author of the comment and the receiver of the comment are the same",
        };

        await helper.postComment(api, token, "profile", receiverId, newComment);

        const commentsAtStart = await helper.commentsInDb();

        const commentToEdit = commentsAtStart[0];

        await helper.unauthorizedEditComment(
          api,
          secondUserToken,
          "profile",
          receiverId,
          commentToEdit.id,
          commentToEdit.author.toString(),
          "These efforts are futile"
        );

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(contents.includes(commentToEdit.content));
        assert(!contents.includes("These efforts are futile"));
      });

      test("only the comment author can edit the comment, author != receiver", async () => {
        const newComment = {
          content:
            "In this case author of the comment and the receiver of the comment are different",
        };

        await helper.postComment(
          api,
          secondUserToken,
          "profile",
          receiverId,
          newComment
        );

        const commentsAtStart = await helper.commentsInDb();

        const commentToEdit = commentsAtStart[0];

        await helper.unauthorizedEditComment(
          api,
          token,
          "profile",
          receiverId,
          commentToEdit.id,
          commentToEdit.author.toString(),
          "These efforts are futile"
        );

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(contents.includes(commentToEdit.content));
        assert(!contents.includes("These efforts are futile"));
      });

      describe("and there are no movies in db", async () => {
        beforeEach(async () => {
          await Movie.deleteMany({});
        });

        test("another user can not edit a movie comment", async () => {
          const newMovieComment = {
            content: "Other users can not edit my comment",
            movieTitle: helper.initialMovie.title,
            moviePoster: helper.initialMovie.poster,
          };

          await helper.postComment(
            api,
            token,
            "movie",
            commentReceivingMovieId,
            newMovieComment
          );

          const commentsAtStart = await helper.commentsInDb();

          const commentToEdit = commentsAtStart[0];

          await helper.unauthorizedEditComment(
            api,
            secondUserToken,
            "movie",
            commentReceivingMovieId,
            commentToEdit.id,
            commentToEdit.author.toString(),
            "These efforts are futile"
          );

          const commentsAtEnd = await helper.commentsInDb();
          const contents = commentsAtEnd.map((c) => c.content);

          assert(contents.includes(commentToEdit.content));
          assert(!contents.includes("These efforts are futile"));
        });
      });

      describe("and a movie already exists in a db", async () => {
        beforeEach(async () => {
          // creating a movie
          await Movie.deleteMany({});

          const movie = new Movie({
            tmdbId: helper.initialMovie.tmdbId,
            title: helper.initialMovie.title,
            poster: helper.initialMovie.poster,
          });

          await movie.save();
        });

        test("another user can not edit a movie comment", async () => {
          const newComment = {
            content: "Other users can not edit my comment",
          };

          await helper.postComment(
            api,
            token,
            "movie",
            commentReceivingMovieId,
            newComment
          );

          const commentsAtStart = await helper.commentsInDb();

          const commentToEdit = commentsAtStart[0];

          await helper.unauthorizedEditComment(
            api,
            secondUserToken,
            "movie",
            commentReceivingMovieId,
            commentToEdit.id,
            commentToEdit.author.toString(),
            "These efforts are futile"
          );

          const commentsAtEnd = await helper.commentsInDb();
          const contents = commentsAtEnd.map((c) => c.content);

          assert(contents.includes(commentToEdit.content));
          assert(!contents.includes("These efforts are futile"));
        });
      });
    });
  });
  describe("working with a comment with a valid id that has been already deleted", async () => {
    const newComment = { content: "I will not exist soon" };
    beforeEach(async () => {
      // creating a movie
      await Movie.deleteMany({});

      const movie = new Movie({
        tmdbId: helper.initialMovie.tmdbId,
        title: helper.initialMovie.title,
        poster: helper.initialMovie.poster,
      });

      await movie.save();
    });

    test("deleting a non existing profile comment fails with 404", async () => {
      // create a valid comment

      await helper.postComment(api, token, "profile", receiverId, newComment);

      // delete a valid comment
      const commentsAtStart = await helper.commentsInDb();
      const commentToDelete = commentsAtStart[0];

      await helper.deleteComment(
        api,
        token,
        "profile",
        receiverId,
        commentToDelete.id,
        commentToDelete.author.toString()
      );

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(!contents.includes(commentToDelete.content));
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1);

      // attempt to delete it again

      await api
        .delete(`/api/comments/profile/${receiverId}/${commentToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ authorId: commentToDelete.author.toString() })
        .expect(404);
    });

    test("deleting a non existing movie comment fails with 404", async () => {
      // create a valid comment
      await helper.postComment(
        api,
        token,
        "movie",
        commentReceivingMovieId,
        newComment
      );

      // delete a valid comment
      const commentsAtStart = await helper.commentsInDb();
      const commentToDelete = commentsAtStart[0];

      await helper.deleteComment(
        api,
        token,
        "movie",
        commentReceivingMovieId,
        commentToDelete.id,
        commentToDelete.author.toString()
      );

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(!contents.includes(commentToDelete.content));
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1);

      // attempt to delete it again

      await api
        .delete(
          `/api/comments/movie/${commentReceivingMovieId}/${commentToDelete.id}`
        )
        .set("Authorization", `Bearer ${token}`)
        .send({ authorId: commentToDelete.author.toString() })
        .expect(404);
    });

    test("editing a non existing profile comment fails with 404", async () => {
      // create a valid comment

      await helper.postComment(api, token, "profile", receiverId, newComment);

      // delete a valid comment
      const commentsAtStart = await helper.commentsInDb();
      const commentToDelete = commentsAtStart[0];

      await helper.deleteComment(
        api,
        token,
        "profile",
        receiverId,
        commentToDelete.id,
        commentToDelete.author.toString()
      );

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(!contents.includes(commentToDelete.content));
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1);

      // attempt to delete it again

      await api
        .put(`/api/comments/profile/${receiverId}/${commentToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          authorId: commentToDelete.author.toString(),
          content: "I am a ghost",
        })
        .expect(404);

      assert(!contents.includes("I am a ghost"));
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1);
    });

    test("deleting a non existing movie comment fails with 404", async () => {
      // create a valid comment
      await helper.postComment(
        api,
        token,
        "movie",
        commentReceivingMovieId,
        newComment
      );

      // delete a valid comment
      const commentsAtStart = await helper.commentsInDb();
      const commentToDelete = commentsAtStart[0];

      await helper.deleteComment(
        api,
        token,
        "movie",
        commentReceivingMovieId,
        commentToDelete.id,
        commentToDelete.author.toString()
      );

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(!contents.includes(commentToDelete.content));
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1);

      // attempt to delete it again

      await api
        .put(
          `/api/comments/movie/${commentReceivingMovieId}/${commentToDelete.id}`
        )
        .set("Authorization", `Bearer ${token}`)
        .send({
          authorId: commentToDelete.author.toString(),
          content: "I am a ghost",
        })
        .expect(404);

      assert(!contents.includes("I am a ghost"));
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
