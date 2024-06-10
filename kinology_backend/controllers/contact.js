const { sendEmail } = require("../utils/contactUtils");
const contactRouter = require("express").Router();
const v = require("valibot");

const MessageSchema = v.object({
  email: v.pipe(v.string(), v.minLength(1, "Please enter your email."),
    v.email("The email address is badly formatted"),),
  name: v.pipe(v.string(), v.minLength(1, "Please enter your name or nickname."),
    v.minLength(3, "Name or nickname should be 3 or more symbols"),),
  message: v.pipe(v.string(), v.minLength(1, "Please enter your message"),
    v.minLength(3, "Message should be 3 or more symbols"),),
});

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
