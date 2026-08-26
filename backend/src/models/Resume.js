import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Resume" },
    fullName: String,
    email: String,
    phone: String,
    targetRole: String,
    summary: String,
    skills: [String],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        institute: String,
        degree: String,
        year: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        techStack: String,
      },
    ],
    aiSuggestions: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
