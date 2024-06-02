const nodemailer = require("nodemailer");
const config = require("../utils/config");

const contactRouter = require("express").Router();

const v = require("valibot");

const MessageSchema = v.object({
  email: v.string([
    v.minLength(1, "Please enter your email."),
    v.email("The email address is badly formatted"),
  ]),
  name: v.string([
    v.minLength(1, "Please enter your name or nickname."),
    v.minLength(3, "Name or nickname should be 3 or more symbols"),
  ]),
  message: v.string([
    v.minLength(1, "Please enter your message"),
    v.minLength(3, "Message should be 3 or more symbols"),
  ]),
});

// same can be configured for gmail
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: config.ETHEREAL_USER,
    pass: config.ETHEREAL_PW,
  },
});

contactRouter.post("/", async (request, response) => {
  const { name, email, message } = request.body;

  console.log(name, email, message);

  const parsedMessage = v.parse(MessageSchema, { email, name, message });

  console.log(parsedMessage);

  const info = await transporter.sendMail({
    from: parsedMessage.email,
    to: config.ETHEREAL_USER,
    subject: `Email from ${parsedMessage.name}`,
    text: `${parsedMessage.message}`,
    html: `<p>${parsedMessage.name}</p><p>${parsedMessage.message}</p>`,
  });

  console.log("Message sent: %s", info.messageId);

  response.status(200).end();
});

module.exports = contactRouter;
