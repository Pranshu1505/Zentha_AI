import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const chatbotSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    publicKey: { type: String, default: uuidv4, unique: true },
    websiteUrl: String,
    businessInfo: { type: String, default: "" }, // knowledge base text (about the business/product)
    welcomeMessage: { type: String, default: "Hi! How can I help you today?" },
    theme: { type: String, default: "#7C5CFC" },
    chatHistory: [
      {
        sessionId: String,
        role: { type: String, enum: ["user", "assistant"] },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Chatbot", chatbotSchema);
