const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const path = require("path");
const app = express();
const cors = require("cors");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const moviesRouter = require("./controllers/movies");
const commentsRouter = require("./controllers/comments");
const contactRouter = require("./controllers/contact");

mongoose.set("strictQuery", false);

logger.info(`Connecting to ${config.MONGODB_URI}`);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((err) => {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
  });

app.use(express.static("dist"));

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/contact", contactRouter);

app.get("/health", (req, res) => {
  res.send("ok");
});

app.get("/*", function (req, res) {
  // eslint-disable-next-line no-undef
  res.sendFile(path.join(__dirname, "./dist/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
