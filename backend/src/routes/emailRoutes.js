import express from "express";
import { sendEmail, getEmailLogs } from "../controllers/emailController.js";

const router = express.Router();
console.log(1231231231231231312)
// Gửi email
router.post("/send-email", sendEmail);

// Lấy tất cả email log
router.get("/email-logs", getEmailLogs);

export default router;
