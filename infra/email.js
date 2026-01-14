import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_STMP_HOST,
  port: process.env.EMAIL_STMP_PORT,
  auth: {
    user: process.env.EMAIL_STMP_USER,
    password: process.env.EMAIL_STMP_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production" ? true : false,
});

async function send(mailOptions) {
  await transporter.sendMail(mailOptions);
}

const email = {
  send,
};

export default email;
