import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema({
  nodeId: { type: String, required: true },
  emailRecipient: { type: String, required: true },
  emailContent: { type: String, required: true },
  emailStatus: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const EmailLog = mongoose.model("EmailLog", emailLogSchema);
