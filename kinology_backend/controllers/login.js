const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const config = require("../utils/config");

const v = require("valibot");

const LoginSchema = v.object({
  username: v.string("Username must be a string.", [
    v.minLength(1, "Please enter your username."),
  ]),
  password: v.string("Your password must be a string.", [
    v.minLength(1, "Please enter your password."),
    v.minLength(6, "Your password must have 6 characters or more."),
  ]),
});

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const parsedCredentials = v.parse(LoginSchema, { username, password });

  //   console.log(parsedCredentials);

  const user = await User.findOne({ username: parsedCredentials.username });
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(parsedCredentials.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET, {
    expiresIn: 60 * 60,
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
