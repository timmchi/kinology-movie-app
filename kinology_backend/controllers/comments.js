const loginRouter = require("express").Router();
const middleware = require("../utils/middleware");
const UserComment = require("../models/userComment");

commentsRouter.get("/user/:id", async (request, response) => {
  const { id } = request.params.id;
  const comments = await UserComment.find({ receiver: id })
    .populate("author")
    .populate("receiver");

  response.status(200).send(comments);
});

commentsRouter.post(
  "/user/:id",
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
  "/user/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {}
);

commentsRouter.delete(
  "/user/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {}
);

commentsRouter.get("/movies/:id", async (request, response) => {});

commentsRouter.post(
  "/movies/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {}
);

commentsRouter.put(
  "/movies/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {}
);

commentsRouter.delete(
  "/movies/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {}
);

module.exports = loginRouter;
