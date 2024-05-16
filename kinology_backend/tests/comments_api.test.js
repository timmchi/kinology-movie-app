const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const UserComment = require("../models/userComment");
const User = require("../models/user");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

const getHash = async () => {
  const testPasswordHash = await bcrypt.hash("123456", 10);
  return testPasswordHash;
};

let token;
let receiverId;
beforeEach(async () => {
  await UserComment.deleteMany({});
  let commentObject;
  helper.initialComments.forEach(async (comment) => {
    commentObject = new UserComment(comment);
    await commentObject.save();
  });

  // creating a user
  await User.deleteMany({});
  const passwordHash = await getHash();
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

  assert.strictEqual(commentsAtEnd.length, helper.initialComments.length + 1);

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

  assert.strictEqual(commentsAtEnd.length, helper.initialComments.length);

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

  assert.strictEqual(commentsAtEnd.length, helper.initialComments.length);
});

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

after(async () => {
  await mongoose.connection.close();
});
