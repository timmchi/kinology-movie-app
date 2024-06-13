const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");
const config = require("./config");
const v = require("valibot");
const validationSchemas = require("./validationSchemas");

const requestLogger = (request, response, next) => {
  logger.info("Method: ", request.method);
  logger.info("Path: ", request.path);
  logger.info("Body: ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) =>
  response.status(404).send({ error: "unknown endpoint" });

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError")
    return response.status(400).send({ error: "malformatted id" });

  if (error.name === "ValidationError" || error.name === "ValiError")
    return response.status(400).json({ error: error.message });

  if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  )
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });

  if (error.name === "TokenExpiredError")
    return response.status(401).json({ error: "token expired" });

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (!authorization) return res.status(401).json({ error: "token required" });

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), config.SECRET);
      req.token = authorization.substring(7);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET);

  if (!decodedToken.id || !decodedToken)
    return response.status(401).json({ error: "token invalid" });

  const user = await User.findById(decodedToken.id);

  request.user = user;

  next();
};

const validateComment = (req, res, next) => {
  try {
    const parsedData = v.parse(validationSchemas.CommentSchema, req.body);
    req.validatedBody = parsedData;
    next();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const validateParamsId = (req, res, next) => {
  try {
    const parsedParams = v.parse(validationSchemas.paramsIdSchema, req.params);
    req.validatedParams = parsedParams;
    next();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const validateMovie = (req, res, next) => {
  try {
    const parsedData = v.parse(validationSchemas.MovieSchema, req.body);
    req.validatedBody = parsedData;
    next();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  validateComment,
  validateParamsId,
  validateMovie,
};
