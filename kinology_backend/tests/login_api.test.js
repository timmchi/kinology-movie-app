const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert/strict");
const User = require("../models/user");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("./login_helper");

const api = supertest(app);

const getHash = async (pw) => {
  const testPasswordHash = await bcrypt.hash(pw, 10);
  return testPasswordHash;
};

const userPassword = "123123";
let createdUserId;

let token;
let secondUserToken;

describe("there is a user in the database", async () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await getHash(userPassword);
    const user = new User({
      username: helper.loginUser.username,
      email: helper.loginUser.email,
      passwordHash,
    });
    await user.save();

    const users = await helper.usersInDb();
    createdUserId = users[0].id;
  });

  test("a user can log in with correct credentials", async () => {
    await api
      .post("/api/login")
      .send({ username: helper.loginUser.username, password: userPassword })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("a log in attempt with incorrect credentials will fail", async () => {
    await api
      .post("/api/login")
      .send({ username: helper.loginUser.username, password: "321321" })
      .expect(401);
  });

  test("logging in successfully sets the token", async () => {
    assert.strictEqual(undefined, token);

    const result = await api
      .post("/api/login")
      .send({ username: helper.loginUser.username, password: userPassword })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    token = result.body.token;

    assert.notStrictEqual(undefined, token);
  });

  test("logging in with credentials of a deleted user will not succeed", async () => {
    // Log in to get a token
    const loginResult = await api
      .post("/api/login")
      .send({ username: helper.loginUser.username, password: userPassword })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    token = loginResult.body.token;
    assert.notStrictEqual(undefined, token);

    // Delete user
    await api
      .delete(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    // Try to log in again
    await api
      .post("/api/login")
      .send({ username: helper.loginUser.username, password: userPassword })
      .expect(401);
  });

  describe("and another user is in db and has logged in", async () => {
    beforeEach(async () => {
      const passwordHash = await getHash(userPassword);
      const user = new User({
        username: helper.secondLoginUser.username,
        email: helper.secondLoginUser.email,
        passwordHash,
      });
      await user.save();

      const result = await api.post("/api/login").send({
        username: helper.secondLoginUser.username,
        password: userPassword,
      });

      secondUserToken = result.body.token;
    });

    test("two users logging in have different tokens", async () => {
      const result = await api.post("/api/login").send({
        username: helper.loginUser.username,
        password: userPassword,
      });

      token = result.body.token;

      assert.notStrictEqual(undefined, secondUserToken);
      assert.notStrictEqual(undefined, token);
      assert.notStrictEqual(token, secondUserToken);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
