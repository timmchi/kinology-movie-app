const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert/strict");
const UserComment = require("../models/userComment");
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
