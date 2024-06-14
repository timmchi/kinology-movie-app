const { sendEmail } = require("../utils/contactUtils");
const contactRouter = require("express").Router();
const validationMiddleware = require("../utils/validationMiddleware");

contactRouter.post(
  "/",
  validationMiddleware.validateMessage,
  async (request, response) => {
    const { name, email, message } = request.parsedContactData;

    await sendEmail(email, name, message);

    response.status(200).end();
  }
);

module.exports = contactRouter;
