const v = require("valibot");
const validationSchemas = require("./validationSchemas");

// comments route
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

// contact route
const validateMessage = (req, res, next) => {
  const { name, email, message } = req.body;

  const parsedContactData = v.parse(validationSchemas.MessageSchema, {
    email,
    name,
    message,
  });

  req.parsedContactData = parsedContactData;

  next();
};

// login route
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  const parsedLoginData = v.parse(validationSchemas.LoginSchema, {
    username,
    password,
  });

  req.parsedLoginData = parsedLoginData;

  next();
};

// movies route
const validateMovieQuery = (req, res, next) => {
  const {
    genres,
    year,
    ratingUpper,
    ratingLower,
    country,
    page,
    director,
    actors,
  } = req.body;

  const parsedMovieQuery = v.parse(validationSchemas.searchQuerySchema, {
    genres,
    year,
    ratingUpper,
    ratingLower,
    country,
    page,
    director,
    actors,
  });

  req.parsedMovieQuery = parsedMovieQuery;

  next();
};

const validateTitleSearch = (req, res, next) => {
  const { title } = req.body;

  const parsedTitle = v.parse(validationSchemas.searchByTitleSchema, { title });

  req.parsedTitle = parsedTitle;

  next();
};

// users route
const validateRegistrationCredentials = (req, res, next) => {
  const { email, username, password, passwordConfirm, name } = req.body;

  const parsedCredentials = v.parse(validationSchemas.RegistrationSchema, {
    email,
    username,
    password,
    passwordConfirm,
    name,
  });

  req.parsedCredentials = parsedCredentials;

  next();
};

const validateUserId = (req, res, next) => {
  const { id } = req.params;

  const parsedId = v.parse(validationSchemas.IdSchema, id);

  req.parsedId = parsedId;

  next();
};

const validateMovieAction = (req, res, next) => {
  const { movie, button } = req.body;

  const parsedMovieAction = v.parse(validationSchemas.MovieActionSchema, {
    id: movie.id,
    title: movie.title,
    poster: movie.poster,
    button,
  });

  req.parsedMovieAction = parsedMovieAction;

  next();
};

const validateUserUpdate = (req, res, next) => {
  const { bio, name } = req.body;

  const parsedUserInfo = v.parse(validationSchemas.UserUpdateSchema, {
    biography: bio,
    name,
  });

  req.parsedUserInfo = parsedUserInfo;

  next();
};

const validateAvatar = (req, res, next) => {
  const file = req.file;

  const parsedAvatar = v.parse(validationSchemas.AvatarSchema, {
    fieldname: file.fieldname,
    originalname: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype,
    size: file.size,
    buffer: file.buffer,
  });

  req.parsedAvatar = parsedAvatar;

  next();
};

module.exports = {
  validateComment,
  validateParamsIds,
  validateMovie,
  validateMessage,
  validateLogin,
  validateMovieQuery,
  validateTitleSearch,
  validateRegistrationCredentials,
  validateUserId,
  validateMovieAction,
  validateUserUpdate,
  validateAvatar,
};
