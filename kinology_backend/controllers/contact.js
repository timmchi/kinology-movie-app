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
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false,
//   auth: {
//     user: config.ETHEREAL_USER,
//     pass: config.ETHEREAL_PW,
//   },
// });
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PW,
  },
});

contactRouter.post("/", async (request, response) => {
  const { name, email, message } = request.body;

  const parsedMessage = v.parse(MessageSchema, { email, name, message });

  await transporter.sendMail({
    from: parsedMessage.email,
    to: config.GMAIL_USER,
    subject: `Email from ${parsedMessage.name}`,
    text: `${parsedMessage.message}`,
    html: `<p>${parsedMessage.name} at ${parsedMessage.email}</p><p>${parsedMessage.message}</p>`,
  });

  response.status(200).end();
});

module.exports = contactRouter;
