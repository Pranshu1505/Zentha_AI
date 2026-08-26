import mongoose from "mongoose";

const codeReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Review" },
    language: { type: String, default: "javascript" },
    code: { type: String, required: true },
    review: { type: String, default: "" },
    bugScore: { type: Number, default: null }, // 0-10, 10 = very clean
  },
  { timestamps: true }
);

export default mongoose.model("CodeReview", codeReviewSchema);
