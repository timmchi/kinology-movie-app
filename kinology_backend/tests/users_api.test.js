const { test, after, beforeEach, describe } = require("node:test");
const path = require("path");
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

const userPassword = "123123";

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

let createdUserId;

const userCredentials = {
  ...helper.users[0],
  name: "User Tester",
  password: userPassword,
  passwordConfirm: userPassword,
};

let token;

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

      test("a user can update their profile", async () => {
        const avatar = path.resolve(__dirname, "testImage.png");

        const usersAtStart = await helper.usersInDb();

        await api
          .put(`/api/users/${createdUserId}`)
          .set("Authorization", `Bearer ${token}`)
          .field("name", "New User Name")
          .field("bio", "I am testing")
          .attach("avatar", avatar)
          .expect(200);

        const usersAtEnd = await helper.usersInDb();

        assert.strictEqual(usersAtEnd[0].name, "New User Name");
        assert.strictEqual(usersAtEnd[0].biography, "I am testing");
        assert.strictEqual(
          usersAtEnd[0].avatar,
          `${usersAtEnd[0].username}-avatar`
        );
      });
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
