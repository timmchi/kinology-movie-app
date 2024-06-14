const v = require("valibot");
const validationSchemas = require("./validationSchemas");

const validateComment = (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;
  const author = req.body.authorId
    ? req.body.authorId
    : req.user?._id.toString();

  const parsedData = v.parse(validationSchemas.CommentSchema, {
    // receiver: id,
    ...(id !== undefined && { receiver: id }),
    ...(content !== undefined && { content }),
    ...(author !== undefined && { author }),
  });

  req.parsedData = parsedData;

  next();
};

const validateParamsIds = (req, res, next) => {
  const { commentId, movieId } = req.params;

  const parsedParamsData = v.parse(validationSchemas.paramsIdSchema, {
    ...(commentId !== undefined && { commentId }),
    ...(movieId !== undefined && { movieId }),
  });

  req.parsedParamsData = parsedParamsData;

  next();
};

const validateMovie = (req, res, next) => {
  const { movieTitle, moviePoster } = req.body;

  const parsedMovieData = v.parse(validationSchemas.MovieSchema, {
    title: movieTitle,
    poster: moviePoster,
  });

  req.parsedMovieData = parsedMovieData;

  next();
};

module.exports = { validateComment, validateParamsIds, validateMovie };
