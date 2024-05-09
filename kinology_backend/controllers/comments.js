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
  async (request, response) => {
    const { id } = request.params.id;
    const { commentId } = request.params.id;
    const user = request.user;

    if (!user || user._id.toString() !== id)
      return response.status(401).json({ error: "not authorized" });

    const updatedComment = await UserComment.findByIdAndUpdate(
      commentId,
      { content: request.body.content },
      { new: true }
    );

    if (!updatedComment)
      return response.status(404).json({ error: "no note found" });

    response.status(200).send(updatedComment);
  }
);

commentsRouter.delete(
  "/profile/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { id } = request.params.id;
    const { commentId } = request.params.id;
    const user = request.user;

    if (!user || user._id.toString() !== id)
      return response.status(401).json({ error: "not authorized" });

    const commentToDelete = await UserComment.findByIdAndDelete(commentId);

    response.status(200);
  }
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
