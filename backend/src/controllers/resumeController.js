import asyncHandler from "express-async-handler";
import PDFDocument from "pdfkit";
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

// @route GET /api/resumes/:id/export-pdf
export const exportResumePdf = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }

  const safeName = (resume.title || "resume").replace(/[^a-z0-9]+/gi, "_");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${safeName}.pdf"`);

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(res);

  const accent = "#7C5CFC";
  const dark = "#111111";
  const gray = "#555555";

  doc.font("Helvetica-Bold").fontSize(22).fillColor(dark).text(resume.fullName || "Your Name");
  doc.font("Helvetica").fontSize(10.5).fillColor(gray).text([resume.email, resume.phone].filter(Boolean).join("   |   "));
  if (resume.targetRole) {
    doc.moveDown(0.2).font("Helvetica-Bold").fontSize(12).fillColor(accent).text(resume.targetRole);
  }
  doc.moveDown(0.6);
  doc.strokeColor("#dddddd").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.8);

  const sectionTitle = (title) => {
    doc.font("Helvetica-Bold").fontSize(12).fillColor(dark).text(title.toUpperCase(), { characterSpacing: 0.5 });
    doc.moveDown(0.35);
  };

  if (resume.summary) {
    sectionTitle("Professional Summary");
    doc.font("Helvetica").fontSize(10.5).fillColor("#333333").text(resume.summary, { align: "left" });
    doc.moveDown(0.8);
  }

  if (resume.skills?.length) {
    sectionTitle("Skills");
    doc.font("Helvetica").fontSize(10.5).fillColor("#333333").text(resume.skills.join("   •   "));
    doc.moveDown(0.8);
  }

  if (resume.experience?.length) {
    sectionTitle("Experience");
    resume.experience.forEach((exp) => {
      doc.font("Helvetica-Bold").fontSize(11).fillColor(dark).text(`${exp.role || ""} — ${exp.company || ""}`);
      if (exp.duration) {
        doc.font("Helvetica-Oblique").fontSize(9.5).fillColor(gray).text(exp.duration);
      }
      if (exp.description) {
        doc.moveDown(0.15).font("Helvetica").fontSize(10.5).fillColor("#333333").text(exp.description);
      }
      doc.moveDown(0.6);
    });
  }

  if (resume.projects?.length) {
    sectionTitle("Projects");
    resume.projects.forEach((proj) => {
      doc.font("Helvetica-Bold").fontSize(11).fillColor(dark).text(proj.name || "");
      if (proj.techStack) {
        doc.font("Helvetica-Oblique").fontSize(9.5).fillColor(gray).text(proj.techStack);
      }
      if (proj.description) {
        doc.moveDown(0.15).font("Helvetica").fontSize(10.5).fillColor("#333333").text(proj.description);
      }
      doc.moveDown(0.6);
    });
  }

  if (resume.education?.length) {
    sectionTitle("Education");
    resume.education.forEach((edu) => {
      doc.font("Helvetica").fontSize(10.5).fillColor("#333333").text(`${edu.degree || ""} — ${edu.institute || ""}${edu.year ? ` (${edu.year})` : ""}`);
      doc.moveDown(0.3);
    });
  }

  doc.end();
});