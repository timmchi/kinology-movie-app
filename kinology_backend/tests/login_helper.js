const User = require("../models/user");

const loginUser = {
  username: "logintester",
  email: "logintester@example.com",
}; // -

const secondLoginUser = {
  username: "logintester2",
  email: "logintester2@example.com",
}; // +

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
}; // -

module.exports = { loginUser, secondLoginUser, usersInDb };
