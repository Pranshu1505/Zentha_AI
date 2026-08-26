import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    experienceLevel: { type: String, default: "Mid-level" },
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
    questions: [
      {
        question: String,
        answer: { type: String, default: "" },
        feedback: { type: String, default: "" },
        score: { type: Number, default: null },
      },
    ],
    overallFeedback: { type: String, default: "" },
    overallScore: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
