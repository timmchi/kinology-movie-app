const { sendEmail } = require("../utils/contactUtils");
const contactRouter = require("express").Router();
const { MessageSchema } = require("../utils/validationSchemas");
const v = require("valibot");

contactRouter.post("/", async (request, response) => {
  const { name, email, message } = request.body;

  const parsedMessage = v.parse(MessageSchema, { email, name, message });

  await sendEmail(
    parsedMessage.email,
    parsedMessage.name,
    parsedMessage.message
  );

  response.status(200).end();
});

module.exports = contactRouter;
