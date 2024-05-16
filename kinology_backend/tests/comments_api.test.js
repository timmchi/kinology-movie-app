const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert/strict");
const UserComment = require("../models/userComment");
const User = require("../models/user");
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

// tokens are used for authentication
let token;
let secondUserToken;
let receiverId;
beforeEach(async () => {
  await UserComment.deleteMany({});

  const commentObjects = helper.initialComments.map(
    (comment) => new UserComment(comment)
  );
  const promiseArray = commentObjects.map((comment) => comment.save());
  await Promise.all(promiseArray);

  // creating a user
  await User.deleteMany({});
  const passwordHash = await getHash("123456");
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
    .send({ username: "commentstester", password: "123456" });

  token = result.body.token;
});

// npm test -- tests/note_api.test.js
// npm test -- --test-name-pattern="the first note is about HTTP methods"
// npm run test -- --test-name-pattern="notes"

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
    const passwordHash = await getHash("123456");
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
      .send({ username: "commentstester", password: "123456" });

    token = result.body.token;
  });

  describe("comment creation", async () => {
    test("a valid comment can be added to a user profile by a logged in user", async () => {
      const newComment = {
        content: "I am a comment created by a test user",
      };

      await api
        .post(`/api/comments/profile/${receiverId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const commentsAtEnd = await helper.commentsInDb();

      const contents = commentsAtEnd.map((c) => c.content);

      assert.strictEqual(commentsAtEnd.length, 1);

      assert(contents.includes("I am a comment created by a test user"));
    });

    test("a comment by a not logged in user will not be added", async () => {
      const newComment = {
        content: "I will not be added",
      };

      await api
        .post(`/api/comments/profile/${receiverId}`)
        .send(newComment)
        .expect(401);

      const commentsAtEnd = await helper.commentsInDb();

      const contents = commentsAtEnd.map((c) => c.content);

      assert.strictEqual(commentsAtEnd.length, 0);

      assert(!contents.includes(newComment.content));
    });

    test("empty comment is not added to a user profile", async () => {
      const newComment = {};

      await api
        .post(`/api/comments/profile/${receiverId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment)
        .expect(400);

      const commentsAtEnd = await helper.commentsInDb();

      assert.strictEqual(commentsAtEnd.length, 0);
    });
  });

  describe("comment deletion", async () => {
    test("a comment can be deleted by its author", async () => {
      const newComment = {
        content: "I am not long for this world",
      };

      await api
        .post(`/api/comments/profile/${receiverId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const commentsAtStart = await helper.commentsInDb();

      const commentToDelete = commentsAtStart.find(
        (comment) => comment.content === "I am not long for this world"
      );

      await api
        .delete(`/api/comments/profile/${receiverId}/${commentToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ authorId: commentToDelete.author.toString() })
        .expect(204);

      const commentsAtEnd = await helper.commentsInDb();

      const contents = commentsAtEnd.map((c) => c.content);
      assert(!contents.includes(commentToDelete.content));

      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1);
    });

    test("a comment can not be deleted when not logged in", async () => {
      const newComment = {
        content: "I will not be deleted",
      };

      await api
        .post(`/api/comments/profile/${receiverId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const commentsAtStart = await helper.commentsInDb();

      const commentToDelete = commentsAtStart[0];

      await api
        .delete(`/api/comments/profile/${receiverId}/${commentToDelete.id}`)
        .send({ authorId: commentToDelete.author.toString() })
        .expect(401);

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(contents.includes(commentToDelete.content));

      assert.strictEqual(commentsAtEnd.length, 1);
    });

    describe("there is another user in db", async () => {
      beforeEach(async () => {
        // creation of a second user
        const passwordHash = await getHash("654321");
        const user = new User({
          username: helper.secondUser.username,
          email: helper.secondUser.email,
          passwordHash,
        });
        await user.save();

        // logging in with second user's credentials
        const result = await api
          .post("/api/login")
          .send({ username: helper.secondUser.username, password: "654321" });

        secondUserToken = result.body.token;
      });

      test("a comment can not be deleted by another user if this user is not the profile owner", async () => {
        const newComment = {
          content: "I can only be deleted by my author",
        };

        await api
          .post(`/api/comments/profile/${receiverId}`)
          .set("Authorization", `Bearer ${token}`)
          .send(newComment)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const commentsAtStart = await helper.commentsInDb();

        const commentToDelete = commentsAtStart[0];

        await api
          .delete(`/api/comments/profile/${receiverId}/${commentToDelete.id}`)
          .set("Authorization", `Bearer ${secondUserToken}`)
          .send({ authorId: commentToDelete.author.toString() })
          .expect(401);

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(contents.includes(commentToDelete.content));

        assert.strictEqual(commentsAtEnd.length, 1);
      });

      test("a user can delete a comment on his profile even if he is not the author", async () => {
        const newComment = {
          content: "I can be deleted by my author or the profile owner",
        };

        await api
          .post(`/api/comments/profile/${receiverId}`)
          .set("Authorization", `Bearer ${secondUserToken}`)
          .send(newComment)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const commentsAtStart = await helper.commentsInDb();

        const commentToDelete = commentsAtStart[0];

        await api
          .delete(`/api/comments/profile/${receiverId}/${commentToDelete.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ authorId: commentToDelete.author.toString() })
          .expect(204);

        const commentsAtEnd = await helper.commentsInDb();
        const contents = commentsAtEnd.map((c) => c.content);

        assert(!contents.includes(commentToDelete.content));

        assert.strictEqual(commentsAtEnd.length, 0);
      });
    });
  });

  describe("editing a comment", async () => {
    test("a profile comment can be edited by its author", async () => {
      const newComment = {
        content: "I will be edited by my author",
      };

      await api
        .post(`/api/comments/profile/${receiverId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const commentsAtStart = await helper.commentsInDb();

      const commentToEdit = commentsAtStart[0];

      await api
        .put(`/api/comments/profile/${receiverId}/${commentToEdit.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "I have been edited",
          authorId: commentToEdit.author.toString(),
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(!contents.includes(commentToEdit.content));
      assert(contents.includes("I have been edited"));
    });

    test("a profile comment can not be edited by someone other than its author", async () => {
      const newComment = {
        content: "Users other than my author can not edit me",
      };

      await api
        .post(`/api/comments/profile/${receiverId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const commentsAtStart = await helper.commentsInDb();

      const commentToEdit = commentsAtStart[0];

      await api
        .put(`/api/comments/profile/${receiverId}/${commentToEdit.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({
          content: "These efforts are futile",
          authorId: commentToEdit.author.toString(),
        })
        .expect(401);

      const commentsAtEnd = await helper.commentsInDb();
      const contents = commentsAtEnd.map((c) => c.content);

      assert(contents.includes(commentToEdit.content));
      assert(!contents.includes("These efforts are futile"));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
