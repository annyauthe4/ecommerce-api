// src/utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: 'E-Commerce <noreply@mystore.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional: for styled emails
  };

  // 3. Send it
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;