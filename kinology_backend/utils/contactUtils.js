const config = require("./config");
const nodemailer = require("nodemailer");

let transporter;

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "test") {
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: config.ETHEREAL_USER,
      pass: config.ETHEREAL_PW,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.GMAIL_USER,
      pass: config.GMAIL_PW,
    },
  });
}

const sendEmail = async (senderEmail, senderName, message) => {
  await transporter.sendMail({
    from: senderEmail,
    to: config.GMAIL_USER,
    subject: `Email from ${senderName}`,
    text: `${message}`,
    html: `<p>${senderName} at ${senderEmail}</p><p>${message}</p>`,
  });
};

module.exports = {
  transporter,
  sendEmail,
};
