import asyncHandler from "express-async-handler";
import Resume from "../models/Resume.js";
import { chatComplete } from "../services/aiService.js";

// @route POST /api/resumes
export const createResume = asyncHandler(async (req, res) => {
  const resume = await Resume.create({ ...req.body, user: req.user._id });
  res.status(201).json(resume);
});

// @route GET /api/resumes
export const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(resumes);
});

// @route GET /api/resumes/:id
export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }
  res.json(resume);
});

// @route PUT /api/resumes/:id
export const updateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }
  res.json(resume);
});

// @route DELETE /api/resumes/:id
export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }
  res.json({ message: "Resume deleted" });
});

// @route POST /api/resumes/:id/ai-enhance
// Uses AI to write a strong professional summary + improve skills/experience wording
export const aiEnhanceResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }

  const prompt = `You are an expert resume writer and ATS optimization specialist.
Given this candidate data (JSON), do the following:
1. Write a compelling 3-4 sentence professional summary tailored to the target role.
2. Suggest 5 strong, ATS-friendly bullet point rewrites for their most recent experience.
3. Suggest 5 relevant skills they might be missing for their target role.

Candidate data:
${JSON.stringify({
  fullName: resume.fullName,
  targetRole: resume.targetRole,
  skills: resume.skills,
  experience: resume.experience,
  education: resume.education,
  projects: resume.projects,
})}

Respond in clean markdown with headings: "Professional Summary", "Improved Bullet Points", "Suggested Skills to Add".`;

  const aiText = await chatComplete([
    { role: "system", content: "You are a professional resume writing assistant." },
    { role: "user", content: prompt },
  ]);

  resume.aiSuggestions = aiText;
  await resume.save();

  res.json({ aiSuggestions: aiText, resume });
});
