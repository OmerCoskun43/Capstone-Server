const nodemailer = require("nodemailer");

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

module.exports = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL,
      pass: USER_PASSWORD,
    },
  });

  transporter.sendMail(
    {
      from: USER_EMAIL,
      to: to,
      subject: subject,
      text: message,
      html: message,
    },
    (error, info) => {
      error ? console.log(error) : console.log(info);
    }
  );
};
