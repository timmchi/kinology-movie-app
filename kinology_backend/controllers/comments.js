const loginRouter = require("express").Router();
const middleware = require("../utils/middleware");
const UserComment = require("../models/userComment");

commentsRouter.get("/user/:id", async (request, response) => {});

commentsRouter.post("/user/:id", async (request, response) => {});

commentsRouter.put("/user/:id/:commentId", async (request, response) => {});

commentsRouter.delete("/user/:id/:commentId", async (request, response) => {});

commentsRouter.get("/movies/:id", async (request, response) => {});

commentsRouter.post("/movies/:id", async (request, response) => {});

commentsRouter.put("/movies/:id/:commentId", async (request, response) => {});

commentsRouter.delete(
  "/movies/:id/:commentId",
  async (request, response) => {}
);

module.exports = loginRouter;
