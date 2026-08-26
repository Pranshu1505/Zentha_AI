import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import codeReviewRoutes from "./routes/codeReviewRoutes.js";
import pdfChatRoutes from "./routes/pdfChatRoutes.js";

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // serves /widget.js for the embeddable chatbot

app.get("/", (req, res) => {
  res.json({ message: "Zentha AI API is running 🚀" });
});

// Feature routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/chatbots", chatbotRoutes);
app.use("/api/code-reviews", codeReviewRoutes);
app.use("/api/pdf-chat", pdfChatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
