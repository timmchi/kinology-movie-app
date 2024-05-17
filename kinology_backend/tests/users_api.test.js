const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert/strict");
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

describe("when there are users in the db usersRouter", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await getHash("123123");

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
});

after(async () => {
  await mongoose.connection.close();
});
