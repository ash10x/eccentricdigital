import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT) || 465;

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port,
  secure: port === 465, // true for SSL (465), false for STARTTLS (587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Hostinger uses a cert chain Node.js doesn't trust by default
  },
});
