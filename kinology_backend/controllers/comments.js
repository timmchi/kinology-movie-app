const commentsRouter = require("express").Router();
const middleware = require("../utils/middleware");
const UserComment = require("../models/userComment");
const User = require("../models/user");
const Movie = require("../models/movie");

commentsRouter.get("/profile/:id", async (request, response) => {
  const { id } = request.params;
  const comments = await UserComment.find({ receiver: id })
    .populate("author", { name: 1, avatar: 1, username: 1 })
    .populate("receiver");

  response.status(200).send(comments);
});

commentsRouter.post(
  "/profile/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { id } = request.params;
    const user = request.user;

    const newComment = new UserComment({
      content: request.body.content,
      author: user._id,
      receiver: id,
    });

    const savedComment = await newComment.save();

    const addedComment = await UserComment.findById(savedComment._id)
      .populate("author", { name: 1, avatar: 1, username: 1 })
      .populate("receiver");

    response.status(201).send(addedComment);
  }
);

commentsRouter.put(
  "/profile/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { id, commentId } = request.params;
    const { authorId, content } = request.body;
    const user = request.user;

    if (!user || user._id.toString() !== authorId)
      return response.status(401).json({ error: "not authorized" });

    const updatedComment = await UserComment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    )
      .populate("author", { name: 1, avatar: 1, username: 1 })
      .populate("receiver");

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
    const { id, commentId } = request.params;
    const { authorId } = request.body;
    const user = request.user;

    console.log("authorId in backend in profile comment delete", authorId);

    if (!user || user._id.toString() !== authorId)
      return response.status(401).json({ error: "not authorized" });

    const commentToDelete = await UserComment.findByIdAndDelete(commentId);

    response.status(200).end();
  }
);

commentsRouter.get("/movie/:id", async (request, response) => {
  const { id } = request.params;

  const movie = await Movie.findOne({ tmdbId: id });

  if (!movie) return response.status(200).send([]);

  // not sure if any of these commented out lines should stay...
  //   await movie.populate("comments", { author: 1, content: 1 });
  //   await movie.populate({
  //     path: "comments",
  //     populate: {
  //       path: "author",
  //       select: "name",
  //     },
  //     select: "content",
  //   });

  const comments = await UserComment.find({
    movieReceiver: movie?._id,
  }).populate("author", { name: 1, id: 1, username: 1, avatar: 1 });

  response.status(200).send(comments);
});

commentsRouter.post(
  "/movie/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { id } = request.params;
    const user = request.user;
    const { content } = request.body;

    let movie = await Movie.findOne({ tmdbId: id });

    if (!movie) {
      movie = new Movie({
        tmdbId: id,
      });
      await movie.save();
    }

    const movieComment = new UserComment({
      content,
      author: user._id,
      movieReceiver: movie._id,
    });
    const savedComment = await movieComment.save();

    // not sure if any of these commented out lines should stay...
    // await movie.populate("comments", { author: 1, content: 1 });
    // await movie.populate({
    //   path: "comments",
    //   populate: {
    //     path: "author",
    //     select: "name",
    //   },
    //   select: "content",
    // });

    await savedComment.populate("author", {
      name: 1,
      id: 1,
      username: 1,
      avatar: 1,
    });

    response.status(201).send(savedComment);
  }
);

commentsRouter.put(
  "/movie/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { commentId } = request.params;
    const user = request.user;
    const { authorId, content } = request.body;

    if (!user || user._id.toString() !== authorId)
      return response.status(401).json({ error: "not authorized" });

    const updatedComment = await UserComment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    )
      .populate("author", { name: 1, avatar: 1, username: 1, id: 1 })
      .populate("movieReceiver");

    if (!updatedComment)
      return response.status(404).json({ error: "no note found" });

    response.status(200).send(updatedComment);
  }
);

commentsRouter.delete(
  "/movie/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { commentId } = request.params;
    const user = request.user;
    const { authorId } = request.body;

    // console.log("ids in backend", user._id, authorId, commentId);

    if (!user || user._id.toString() !== authorId)
      return response.status(401).json({ error: "not authorized" });

    const commentToDelete = await UserComment.findByIdAndDelete(commentId);

    response.status(200).end();
  }
);

module.exports = commentsRouter;
