const commentsRouter = require("express").Router();
const middleware = require("../utils/middleware");
const UserComment = require("../models/userComment");

commentsRouter.get("/profile/:id", async (request, response) => {
  const { id } = request.params.id;
  const comments = await UserComment.find({ receiver: id })
    .populate("author", { name: 1, avatar: 1 })
    .populate("receiver");

  response.status(200).send(comments);
});

commentsRouter.post(
  "/profile/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { id } = request.params.id;
    const user = request.user;

    const newComment = new UserComment({
      content: request.body.content,
      author: user._id,
      receiver: id,
    });

    const savedComment = await newComment.save();

    response.status(201).send(savedComment);
  }
);

commentsRouter.put(
  "/profile/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {}
);

commentsRouter.delete(
  "/profile/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {}
);

commentsRouter.get("/movie/:id", async (request, response) => {});

commentsRouter.post(
  "/movie/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {}
);

commentsRouter.put(
  "/movie/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {}
);

commentsRouter.delete(
  "/movie/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {}
);

module.exports = commentsRouter;
