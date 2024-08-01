import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

export function sendResetPasswordMail(receiverEmail, callbackUrl) {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: receiverEmail,
    subject: "Reset Your Password",
    html: `<p>We have received a reset password request from you, please <a href="${callbackUrl}">click here</a> to reset your password. Ignore the email if it wasn't you.<br>Regards,<br>Team NodeJs Authenticator</p>`,
  };
  transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log(info.response);
    })
    .catch((error) => {
      throw new ErrorHandler(500, "Mail sending failed!" + error);
    });
}
