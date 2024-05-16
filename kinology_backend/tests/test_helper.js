const UserComment = require("../models/userComment");

const initialComments = [
  { content: "This is a great movie" },
  { content: "This is a bad movie" },
  { content: "This user is my friend" },
  { content: "This user is my enemy" },
];

const initialUser = {
  username: "commentstester",
  email: "commentstester@example.com",
};

const secondUser = {
  username: "seconduser",
  email: "seconduser@example.com",
};

const commentsInDb = async () => {
  const comments = await UserComment.find({});
  return comments.map((comment) => comment.toJSON());
};

module.exports = {
  initialComments,
  initialUser,
  commentsInDb,
  secondUser,
};
