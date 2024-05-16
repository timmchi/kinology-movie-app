const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const UserComment = require("../models/userComment");
const User = require("../models/user");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");

const api = supertest(app);

const initialComments = [
  { content: "This is a great movie" },
  { content: "This is a bad movie" },
  { content: "This user is my friend" },
  { content: "This user is my enemy" },
];

const getHash = async () => {
  const testPasswordHash = await bcrypt.hash("123456", 10);
  return testPasswordHash;
};

const initialUser = {
  username: "commentstester",
  email: "commentstester@example.com",
};

let token;
let receiverId;
beforeEach(async () => {
  await UserComment.deleteMany({});
  let commentObject;
  initialComments.forEach(async (comment) => {
    commentObject = new UserComment(comment);
    await commentObject.save();
  });

  // creating a user
  await User.deleteMany({});
  const passwordHash = await getHash();
  const user = new User({
    username: initialUser.username,
    email: initialUser.email,
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
  const response = await api.get("/api/comments");

  assert.strictEqual(response.body.length, initialComments.length);
});

test("there is a comment about a great movie", async () => {
  const response = await api.get("/api/comments");

  const contents = response.body.map((c) => c.content);
  assert(contents.includes("This is a great movie"));
});

test("a valid comment can be added to a user profile", async () => {
  const newComment = {
    content: "I am a comment created by a test user",
  };

  await api
    .post(`/api/comments/profile/${receiverId}`)
    .set("Authorization", `Bearer ${token}`)
    .send(newComment)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/comments");

  const contents = response.body.map((c) => c.content);

  assert.strictEqual(response.body.length, initialComments.length + 1);

  assert(contents.includes("I am a comment created by a test user"));
});

after(async () => {
  await mongoose.connection.close();
});
