import mongoose from "mongoose";

const pdfDocumentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    chunks: [
      {
        text: String,
        embedding: [Number],
      },
    ],
    chatHistory: [
      {
        role: { type: String, enum: ["user", "assistant"] },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("PdfDocument", pdfDocumentSchema);
