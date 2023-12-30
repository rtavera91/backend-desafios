import nodemailer from "nodemailer";
import config from "./config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.gmail_user,
    pass: config.gmail_password,
  },
});

export default transporter;
