import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
const createTransport = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.MAIL_PASS,
    },
  });
};

const sendEmail = async (email, subject, body) => {
  const transporter = createTransport();
  const mailOptions = {
    from: `"BAU VTH" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: subject,
    html: body,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
