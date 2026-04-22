// src/utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `"KataKara E-Commerce Store" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send it
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;