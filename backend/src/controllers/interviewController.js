import asyncHandler from "express-async-handler";
import Interview from "../models/Interview.js";
import { chatComplete } from "../services/aiService.js";

// @route POST /api/interviews/start
// Generates 5 AI interview questions for the given role
export const startInterview = asyncHandler(async (req, res) => {
  const { role, experienceLevel } = req.body;
  if (!role) {
    res.status(400);
    throw new Error("Role is required");
  }

  const prompt = `Generate exactly 5 realistic technical + behavioral interview questions for a "${
    experienceLevel || "Mid-level"
  }" candidate applying for the role "${role}".
Return ONLY a JSON object like: {"questions": ["question 1", "question 2", "question 3", "question 4", "question 5"]}`;

  const aiText = await chatComplete(
    [
      { role: "system", content: "You are an experienced technical interviewer. Always respond with valid JSON only." },
      { role: "user", content: prompt },
    ],
    { json: true }
  );

  let parsed;
  try {
    parsed = JSON.parse(aiText);
  } catch {
    parsed = { questions: ["Tell me about yourself.", "Describe a challenging project you worked on."] };
  }

  const interview = await Interview.create({
    user: req.user._id,
    role,
    experienceLevel: experienceLevel || "Mid-level",
    questions: parsed.questions.map((q) => ({ question: q })),
  });

  res.status(201).json(interview);
});

// @route GET /api/interviews
export const getInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(interviews);
});

// @route GET /api/interviews/:id
export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }
  res.json(interview);
});

// @route POST /api/interviews/:id/answer
// Submits an answer for a specific question index, gets AI feedback + score for it
export const submitAnswer = asyncHandler(async (req, res) => {
  const { questionIndex, answer } = req.body;
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }

  const q = interview.questions[questionIndex];
  if (!q) {
    res.status(400);
    throw new Error("Invalid question index");
  }

  const prompt = `Role: ${interview.role}
Question: ${q.question}
Candidate's Answer: ${answer}

Evaluate this answer. Return ONLY JSON: {"feedback": "2-3 sentence constructive feedback", "score": number_out_of_10}`;

  const aiText = await chatComplete(
    [
      { role: "system", content: "You are a strict but fair technical interviewer. Respond with valid JSON only." },
      { role: "user", content: prompt },
    ],
    { json: true }
  );

  let parsed;
  try {
    parsed = JSON.parse(aiText);
  } catch {
    parsed = { feedback: "Could not evaluate automatically.", score: null };
  }

  q.answer = answer;
  q.feedback = parsed.feedback;
  q.score = parsed.score;
  await interview.save();

  res.json(interview);
});

// @route POST /api/interviews/:id/finish
// Generates overall feedback + score summary
export const finishInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }

  const summaryPrompt = `Here is a completed mock interview for the role "${interview.role}":
${interview.questions
  .map((q, i) => `Q${i + 1}: ${q.question}\nAnswer: ${q.answer}\nScore: ${q.score}/10`)
  .join("\n\n")}

Write a short overall performance summary (strengths, weaknesses, and 2 tips to improve) in markdown.`;

  const summary = await chatComplete([
    { role: "system", content: "You are a career coach summarizing mock interview performance." },
    { role: "user", content: summaryPrompt },
  ]);

  const scores = interview.questions.map((q) => q.score).filter((s) => typeof s === "number");
  const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  interview.overallFeedback = summary;
  interview.overallScore = avgScore;
  interview.status = "completed";
  await interview.save();

  res.json(interview);
});
