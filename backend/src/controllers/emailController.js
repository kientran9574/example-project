import nodemailer from "nodemailer";
import { EmailLog } from "../models/EmailLog.js";
import { config } from "dotenv";
config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to take messages");
  }
});
// Hàm gửi email và lưu log
export const sendEmail = async (req, res) => {
  const { nodeId, emailRecipient, emailContent } = req.body;
  console.log("🚀 ~ sendEmail ~ emailContent:", emailContent);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailRecipient,
    subject: "Workflow Automation Notification",
    text: emailContent,
  };
  console.log("🚀 ~ sendEmail ~ mailOptions:", mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("🚀 ~ sendEmail ~ info:", info);

    // Lưu email log
    const emailLog = new EmailLog({
      nodeId,
      emailRecipient,
      emailContent,
      emailStatus: "sent",
    });
    await emailLog.save();

    res.json({ status: "Email sent", info, emailLog });
  } catch (error) {
    console.error("Error sending email:", error);

    // Lưu email log với trạng thái "failed"
    const emailLog = new EmailLog({
      nodeId,
      emailRecipient,
      emailContent,
      emailStatus: "failed",
    });
    await emailLog.save();

    res.status(500).json({ error: error.message, emailLog });
  }
};

// Lấy tất cả log email
export const getEmailLogs = async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
