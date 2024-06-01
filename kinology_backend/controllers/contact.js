const nodemailer = require("nodemailer");
const config = require("../utils/config");

const contactRouter = require("express").Router();

const v = require("valibot");

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

  const info = await transporter.sendMail({
    from: email,
    to: config.ETHEREAL_USER,
    subject: `Email from ${name}`,
    text: `${message}`,
    html: `<p>${name}</p><p>${message}</p>`,
  });

  console.log("Message sent: %s", info.messageId);

  response.status(200).end();
});

module.exports = contactRouter;
