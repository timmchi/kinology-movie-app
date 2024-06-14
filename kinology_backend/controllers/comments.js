const commentsRouter = require("express").Router();
const middleware = require("../utils/middleware");
const validationMiddleware = require("../utils/validationMiddleware");
const UserComment = require("../models/userComment");
const commentsUtils = require("../utils/commentsUtils");
const routesUtils = require("../utils/routesUtils");

commentsRouter.get("/", async (request, response) => {
  const comments = await UserComment.find({});
  response.status(200).send(comments);
});

commentsRouter.get(
  "/profile/:id",
  validationMiddleware.validateComment,
  async (request, response) => {
    const { receiver } = request.parsedData;

    const comments = await UserComment.find({ receiver })
      .populate("author", { name: 1, avatar: 1, username: 1 })
      .populate("receiver");

    await routesUtils.fetchUser(receiver);

    response.status(200).send(comments);
  }
);

commentsRouter.post(
  "/profile/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  validationMiddleware.validateComment,
  async (request, response) => {
    const user = request.user;

    if (!user) return response.status(401).send({ error: "not authorized" });

    const savedComment = await commentsUtils.createComment(
      request.parsedData.content,
      request.parsedData.author,
      request.parsedData.receiver,
      "profile"
    );

    const addedComment = await commentsUtils.fetchComment(savedComment._id);

    const author = await routesUtils.fetchUser(user._id);
    const receiver = await routesUtils.fetchUser(user._id);

    if (author._id.toString() === receiver._id.toString()) {
      await commentsUtils.handleSameProfileComment(addedComment, author);
      await author.save();
    }

    if (author._id.toString() !== receiver._id.toString()) {
      await commentsUtils.handleDifferentProfileComment(
        addedComment,
        author,
        receiver
      );
      await Promise.all([author.save(), receiver.save()]);
    }

    response.status(201).send(addedComment);
  }
);

commentsRouter.put(
  "/profile/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  validationMiddleware.validateParamsIds,
  validationMiddleware.validateComment,
  async (request, response) => {
    const user = request.user;

    const { commentId } = request.parsedParamsData;
    const { author, content } = request.parsedData;

    if (!user || user._id.toString() !== author)
      return response.status(401).json({ error: "not authorized" });

    const updatedComment = await UserComment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    )
      .populate("author", { name: 1, avatar: 1, username: 1 })
      .populate("receiver");

    if (!updatedComment)
      return response.status(404).json({ error: "no comment found" });

    response.status(200).send(updatedComment);
  }
);

commentsRouter.delete(
  "/profile/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  validationMiddleware.validateParamsIds,
  validationMiddleware.validateComment,
  async (request, response) => {
    const user = request.user;

    const { commentId } = request.parsedParamsData;

    if (
      !user ||
      (user._id.toString() !== request.parsedData.author.toString() &&
        user._id.toString() !== request.parsedData.receiver.toString())
    )
      return response.status(401).json({ error: "not authorized" });

    const commentToDelete = await UserComment.findByIdAndDelete(commentId);

    if (!commentToDelete)
      return response.status(404).json({ error: "no comment found" });

    const author = await routesUtils.fetchUser(user._id);
    const receiver = await routesUtils.fetchUser(request.parsedData.receiver);

    if (author._id.toString() === receiver._id.toString()) {
      await commentsUtils.handleSameProfileCommentDeletion(
        commentToDelete,
        author
      );
      await author.save();
    }

    if (author._id.toString() !== receiver._id.toString()) {
      await commentsUtils.handleDifferentProfileCommentDeletion(
        commentToDelete,
        author,
        receiver
      );
      await Promise.all([author.save(), receiver.save()]);
    }

    response.status(204).end();
  }
);

commentsRouter.get(
  "/movie/:movieId",
  validationMiddleware.validateParamsIds,
  async (request, response) => {
    const { movieId } = request.parsedParamsData;

    const movie = await routesUtils.fetchMovie(movieId);

    if (!movie) return response.status(200).send([]);

    const comments = await UserComment.find({
      movieReceiver: movie?._id,
    }).populate("author", { name: 1, id: 1, username: 1, avatar: 1 });

    movie.populate("comments");

    response.status(200).send(comments);
  }
);

commentsRouter.post(
  "/movie/:movieId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  validationMiddleware.validateParamsIds,
  validationMiddleware.validateComment,
  validationMiddleware.validateMovie,
  async (request, response) => {
    const user = request.user;

    const { movieId } = request.parsedParamsData;
    const { title, poster } = request.parsedMovieData;

    let movie = await routesUtils.fetchMovie(movieId);

    if (!movie) {
      movie = await routesUtils.createMovie(movieId, title, poster);
    }

    const { receiver, content, author } = request.parsedData;

    const savedComment = await commentsUtils.createComment(
      content,
      author,
      receiver,
      "movie"
    );

    await savedComment.populate("author", {
      name: 1,
      id: 1,
      username: 1,
      avatar: 1,
    });

    const commentAuthor = await routesUtils.fetchUser(user._id);

    commentAuthor.authoredComments = commentAuthor.authoredComments.concat(
      savedComment._id
    );
    movie.comments = movie.comments.concat(savedComment._id);
    await Promise.all([commentAuthor.save(), movie.save()]);

    response.status(201).send(savedComment);
  }
);

commentsRouter.put(
  "/movie/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  validationMiddleware.validateParamsIds,
  validationMiddleware.validateComment,
  async (request, response) => {
    const user = request.user;

    const { commentId } = request.parsedParamsData;
    const { content, author } = request.parsedData;

    if (!user || user._id.toString() !== author)
      return response.status(401).json({ error: "not authorized" });

    const updatedComment = await UserComment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    )
      .populate("author", { name: 1, avatar: 1, username: 1, id: 1 })
      .populate("movieReceiver");

    if (!updatedComment)
      return response.status(404).json({ error: "no comment found" });

    response.status(200).send(updatedComment);
  }
);

commentsRouter.delete(
  "/movie/:movieId/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  validationMiddleware.validateParamsIds,
  validationMiddleware.validateComment,
  async (request, response) => {
    const user = request.user;

    const { commentId, movieId } = request.parsedParamsData;
    const { author } = request.parsedData;

    if (!user || user._id.toString() !== author)
      return response.status(401).json({ error: "not authorized" });

    const commentToDelete = await UserComment.findByIdAndDelete(commentId);

    if (!commentToDelete)
      return response.status(404).json({ error: "no comment found" });

    const movie = await routesUtils.fetchMovie(movieId);
    const commentAuthor = await routesUtils.fetchUser(user._id);

    movie.comments = movie.comments.filter(
      (c) => c._id.toString() !== commentId.toString()
    );
    commentAuthor.authoredComments = commentAuthor.authoredComments.filter(
      (c) => c._id.toString() !== commentId.toString()
    );

    await Promise.all([commentAuthor.save(), movie.save()]);

    response.status(204).end();
  }
);

module.exports = commentsRouter;
