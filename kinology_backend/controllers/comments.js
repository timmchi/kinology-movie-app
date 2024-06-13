const commentsRouter = require("express").Router();
const middleware = require("../utils/middleware");
const UserComment = require("../models/userComment");
const commentsUtils = require("../utils/commentsUtils");
const routesUtils = require("../utils/routesUtils");
const v = require("valibot");

const CommentSchema = v.object({
  content: v.optional(
    v.pipe(
      v.string("Comment must be a string"),
      v.minLength(1, "Comments can not be empty")
    )
  ),
  author: v.optional(
    v.string(v.hexadecimal("The authorId hexadecimal is badly formatted."))
  ),
  receiver: v.optional(
    v.string(v.hexadecimal("The receiverId hexadecimal is badly formatted."))
  ),
});

const paramsIdSchema = v.object({
  commentId: v.optional(
    v.string(v.hexadecimal("The commentId hexadecimal is badly formatted"))
  ),
  movieId: v.optional(v.string(v.minValue("2"))),
});

const MovieSchema = v.object({
  title: v.optional(v.string()),
  poster: v.optional(v.pipe(v.string(), v.includes("/"), v.endsWith(".jpg"))),
});

commentsRouter.get("/", async (request, response) => {
  const comments = await UserComment.find({});
  response.status(200).send(comments);
});

commentsRouter.get("/profile/:id", async (request, response) => {
  const { id } = request.params;

  const parsedParams = v.parse(CommentSchema, { receiver: id });

  const comments = await UserComment.find({ receiver: parsedParams.receiver })
    .populate("author", { name: 1, avatar: 1, username: 1 })
    .populate("receiver");

  await routesUtils.fetchUser(parsedParams.receiver);

  response.status(200).send(comments);
});

commentsRouter.post(
  "/profile/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { id } = request.params;
    const user = request.user;
    const { content } = request.body;

    if (!user) return response.status(401).send({ error: "not authorized" });

    const parsedComment = v.parse(CommentSchema, {
      content,
      author: user._id.toString(),
      receiver: id,
    });

    const savedComment = await commentsUtils.createComment(
      parsedComment.content,
      parsedComment.author,
      parsedComment.receiver,
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
  async (request, response) => {
    const { commentId } = request.params;
    const { authorId, content } = request.body;
    const user = request.user;

    const parsedComment = v.parse(CommentSchema, { content, author: authorId });
    const parsedParams = v.parse(paramsIdSchema, { commentId });

    if (!user || user._id.toString() !== parsedComment.author)
      return response.status(401).json({ error: "not authorized" });

    const updatedComment = await UserComment.findByIdAndUpdate(
      parsedParams.commentId,
      { content: parsedComment.content },
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
  async (request, response) => {
    const { id, commentId } = request.params;
    const { authorId } = request.body;
    const user = request.user;

    const parsedComment = v.parse(CommentSchema, {
      author: authorId,
      receiver: id,
    });
    const parsedParams = v.parse(paramsIdSchema, { commentId });

    if (
      !user ||
      (user._id.toString() !== parsedComment.author.toString() &&
        user._id.toString() !== parsedComment.receiver.toString())
    )
      return response.status(401).json({ error: "not authorized" });

    const commentToDelete = await UserComment.findByIdAndDelete(
      parsedParams.commentId
    );

    if (!commentToDelete)
      return response.status(404).json({ error: "no comment found" });

    const author = await routesUtils.fetchUser(user._id);
    const receiver = await routesUtils.fetchUser(parsedComment.receiver);

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

commentsRouter.get("/movie/:id", async (request, response) => {
  const { id } = request.params;

  const parsedParams = v.parse(paramsIdSchema, { movieId: id });

  //   const movie = await Movie.findOne({ tmdbId: parsedParams.movieId });
  const movie = await routesUtils.fetchMovie(parsedParams.movieId);

  if (!movie) return response.status(200).send([]);

  const comments = await UserComment.find({
    movieReceiver: movie?._id,
  }).populate("author", { name: 1, id: 1, username: 1, avatar: 1 });

  movie.populate("comments");

  response.status(200).send(comments);
});

commentsRouter.post(
  "/movie/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { id } = request.params;
    const user = request.user;
    const { content, movieTitle, moviePoster } = request.body;

    const parsedMovie = v.parse(MovieSchema, {
      title: movieTitle,
      poster: moviePoster,
    });

    const parsedParams = v.parse(paramsIdSchema, { movieId: id });

    let movie = await routesUtils.fetchMovie(parsedParams.movieId);

    if (!movie) {
      movie = await routesUtils.createMovie(
        parsedParams.movieId,
        parsedMovie.title,
        parsedMovie.poster
      );
    }

    const parsedComment = v.parse(CommentSchema, {
      content,
      author: user._id.toString(),
      receiver: movie._id.toString(),
    });

    const savedComment = await commentsUtils.createComment(
      parsedComment.content,
      parsedComment.author,
      parsedComment.receiver,
      "movie"
    );

    await savedComment.populate("author", {
      name: 1,
      id: 1,
      username: 1,
      avatar: 1,
    });

    const author = await routesUtils.fetchUser(user._id);

    author.authoredComments = author.authoredComments.concat(savedComment._id);
    movie.comments = movie.comments.concat(savedComment._id);
    await Promise.all([author.save(), movie.save()]);

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

    const parsedParams = v.parse(paramsIdSchema, { commentId });

    const parsedComment = v.parse(CommentSchema, { content, author: authorId });

    if (!user || user._id.toString() !== parsedComment.author)
      return response.status(401).json({ error: "not authorized" });

    const updatedComment = await UserComment.findByIdAndUpdate(
      parsedParams.commentId,
      { content: parsedComment.content },
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
  "/movie/:id/:commentId",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { id, commentId } = request.params;
    const user = request.user;
    const { authorId } = request.body;

    const parsedParams = v.parse(paramsIdSchema, { commentId, movieId: id });
    const parsedComment = v.parse(CommentSchema, { author: authorId });

    if (!user || user._id.toString() !== parsedComment.author)
      return response.status(401).json({ error: "not authorized" });

    const commentToDelete = await UserComment.findByIdAndDelete(
      parsedParams.commentId
    );

    if (!commentToDelete)
      return response.status(404).json({ error: "no comment found" });

    const movie = await routesUtils.fetchMovie(parsedParams.movieId);
    const author = await routesUtils.fetchUser(user._id);

    movie.comments = movie.comments.filter(
      (c) => c._id.toString() !== parsedParams.commentId.toString()
    );
    author.authoredComments = author.authoredComments.filter(
      (c) => c._id.toString() !== parsedParams.commentId.toString()
    );

    await Promise.all([author.save(), movie.save()]);

    response.status(204).end();
  }
);

module.exports = commentsRouter;
