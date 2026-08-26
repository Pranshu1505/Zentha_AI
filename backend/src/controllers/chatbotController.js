import asyncHandler from "express-async-handler";
import Chatbot from "../models/Chatbot.js";
import { chatComplete } from "../services/aiService.js";

// @route POST /api/chatbots
export const createChatbot = asyncHandler(async (req, res) => {
  const chatbot = await Chatbot.create({ ...req.body, user: req.user._id });
  res.status(201).json(chatbot);
});

// @route GET /api/chatbots
export const getChatbots = asyncHandler(async (req, res) => {
  const chatbots = await Chatbot.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(chatbots);
});

// @route GET /api/chatbots/:id
export const getChatbotById = asyncHandler(async (req, res) => {
  const chatbot = await Chatbot.findOne({ _id: req.params.id, user: req.user._id });
  if (!chatbot) {
    res.status(404);
    throw new Error("Chatbot not found");
  }
  res.json(chatbot);
});

// @route PUT /api/chatbots/:id
export const updateChatbot = asyncHandler(async (req, res) => {
  const chatbot = await Chatbot.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!chatbot) {
    res.status(404);
    throw new Error("Chatbot not found");
  }
  res.json(chatbot);
});

// @route DELETE /api/chatbots/:id
export const deleteChatbot = asyncHandler(async (req, res) => {
  const chatbot = await Chatbot.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!chatbot) {
    res.status(404);
    throw new Error("Chatbot not found");
  }
  res.json({ message: "Chatbot deleted" });
});

// @route POST /api/chatbots/public/:publicKey/message
// PUBLIC endpoint (no auth) - this is what the embedded widget script calls
export const publicChatMessage = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  const { message, sessionId } = req.body;

  const chatbot = await Chatbot.findOne({ publicKey });
  if (!chatbot) {
    res.status(404);
    throw new Error("Chatbot not found");
  }

  const recentHistory = chatbot.chatHistory
    .filter((m) => m.sessionId === sessionId)
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content }));

  const systemPrompt = `You are a helpful, friendly customer support chatbot for "${chatbot.name}".
Use ONLY the following business information to answer questions. If you don't know the answer, politely say you'll connect them with a human.

Business Information:
${chatbot.businessInfo || "No specific business information provided yet."}`;

  const aiReply = await chatComplete([
    { role: "system", content: systemPrompt },
    ...recentHistory,
    { role: "user", content: message },
  ]);

  chatbot.chatHistory.push(
    { sessionId, role: "user", content: message },
    { sessionId, role: "assistant", content: aiReply }
  );
  await chatbot.save();

  res.json({ reply: aiReply });
});

// @route GET /api/chatbots/public/:publicKey/config
// PUBLIC - widget fetches basic config (name, welcome message, theme)
export const publicChatbotConfig = asyncHandler(async (req, res) => {
  const chatbot = await Chatbot.findOne({ publicKey: req.params.publicKey }).select(
    "name welcomeMessage theme"
  );
  if (!chatbot) {
    res.status(404);
    throw new Error("Chatbot not found");
  }
  res.json(chatbot);
});
