import asyncHandler from "express-async-handler";
import CodeReview from "../models/CodeReview.js";
import { chatComplete } from "../services/aiService.js";

// @route POST /api/code-reviews
// Creates a review entry AND immediately runs AI review
export const createCodeReview = asyncHandler(async (req, res) => {
  const { title, language, code } = req.body;
  if (!code) {
    res.status(400);
    throw new Error("Code is required");
  }

  const prompt = `You are a senior software engineer performing a thorough code review.
Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide a code review in markdown covering:
1. **Bugs / Correctness issues** (if any)
2. **Security concerns** (if any)
3. **Performance suggestions**
4. **Readability / Best practices**
5. **Overall Bug Score** — end with exactly this line: "SCORE: X/10" where X is how clean/bug-free the code is (10 = excellent).`;

  const aiText = await chatComplete([
    { role: "system", content: "You are an expert, precise, and constructive code reviewer." },
    { role: "user", content: prompt },
  ]);

  const scoreMatch = aiText.match(/SCORE:\s*(\d+(\.\d+)?)\s*\/\s*10/i);
  const bugScore = scoreMatch ? parseFloat(scoreMatch[1]) : null;

  const review = await CodeReview.create({
    user: req.user._id,
    title: title || "Untitled Review",
    language,
    code,
    review: aiText,
    bugScore,
  });

  res.status(201).json(review);
});

// @route GET /api/code-reviews
export const getCodeReviews = asyncHandler(async (req, res) => {
  const reviews = await CodeReview.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(reviews);
});

// @route GET /api/code-reviews/:id
export const getCodeReviewById = asyncHandler(async (req, res) => {
  const review = await CodeReview.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  res.json(review);
});

// @route DELETE /api/code-reviews/:id
export const deleteCodeReview = asyncHandler(async (req, res) => {
  const review = await CodeReview.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  res.json({ message: "Review deleted" });
});
