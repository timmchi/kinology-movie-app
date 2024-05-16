const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const UserComment = require("../models/userComment");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const initialComments = [
  { content: "This is a great movie" },
  { content: "This is a bad movie" },
  { content: "This user is my friend" },
  { content: "This user is my enemy" },
];

beforeEach(async () => {
  await UserComment.deleteMany({});
  let commentObject;
  initialComments.forEach(async (comment) => {
    commentObject = new UserComment(comment);
    await commentObject.save();
  });
});

test("comments are returned as json", async () => {
  await api
    .get("/api/comments")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are 4 comments", async () => {
  const response = await api.get("/api/comments");

  assert.strictEqual(response.body.length, initialComments.length);
});

after(async () => {
  await mongoose.connection.close();
});
