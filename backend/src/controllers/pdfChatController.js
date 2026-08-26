import asyncHandler from "express-async-handler";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import PdfDocument from "../models/PdfDocument.js";
import { chatComplete, createEmbeddings, cosineSimilarity } from "../services/aiService.js";
import { chunkText } from "../services/textChunker.js";

// @route POST /api/pdf-chat/upload
export const uploadPdf = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No PDF file uploaded");
  }

  const parsed = await pdfParse(req.file.buffer);
  const textChunks = chunkText(parsed.text);

  if (textChunks.length === 0) {
    res.status(400);
    throw new Error("Could not extract any readable text from this PDF");
  }

  // Batch embeddings in groups of 50 to avoid oversized requests
  const embeddings = [];
  for (let i = 0; i < textChunks.length; i += 50) {
    const batch = textChunks.slice(i, i + 50);
    const batchEmbeddings = await createEmbeddings(batch);
    embeddings.push(...batchEmbeddings);
  }

  const doc = await PdfDocument.create({
    user: req.user._id,
    fileName: req.file.originalname,
    chunks: textChunks.map((text, i) => ({ text, embedding: embeddings[i] })),
  });

  res.status(201).json({
    _id: doc._id,
    fileName: doc.fileName,
    chunkCount: doc.chunks.length,
    createdAt: doc.createdAt,
  });
});

// @route GET /api/pdf-chat
export const getPdfDocuments = asyncHandler(async (req, res) => {
  const docs = await PdfDocument.find({ user: req.user._id })
    .select("fileName createdAt chatHistory")
    .sort({ createdAt: -1 });

  const summarized = docs.map((d) => ({
    _id: d._id,
    fileName: d.fileName,
    createdAt: d.createdAt,
    messageCount: d.chatHistory.length,
  }));
  res.json(summarized);
});

// @route GET /api/pdf-chat/:id
export const getPdfDocumentById = asyncHandler(async (req, res) => {
  const doc = await PdfDocument.findOne({ _id: req.params.id, user: req.user._id }).select(
    "fileName chatHistory createdAt"
  );
  if (!doc) {
    res.status(404);
    throw new Error("Document not found");
  }
  res.json(doc);
});

// @route POST /api/pdf-chat/:id/ask
// RAG: embed the question, find top-K similar chunks, answer using only that context
export const askPdfQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question) {
    res.status(400);
    throw new Error("Question is required");
  }

  const doc = await PdfDocument.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) {
    res.status(404);
    throw new Error("Document not found");
  }

  const [questionEmbedding] = await createEmbeddings([question]);

  const scored = doc.chunks
    .map((c) => ({ text: c.text, score: cosineSimilarity(questionEmbedding, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const context = scored.map((c) => c.text).join("\n\n---\n\n");

  const systemPrompt = `You are a helpful assistant answering questions strictly based on the provided PDF excerpts.
If the answer is not contained in the excerpts, say you couldn't find that information in the document.

PDF Excerpts:
${context}`;

  const recentHistory = doc.chatHistory.slice(-6).map((m) => ({ role: m.role, content: m.content }));

  const answer = await chatComplete([
    { role: "system", content: systemPrompt },
    ...recentHistory,
    { role: "user", content: question },
  ]);

  doc.chatHistory.push({ role: "user", content: question }, { role: "assistant", content: answer });
  await doc.save();

  res.json({ answer, sources: scored.map((s) => s.text.slice(0, 150) + "...") });
});

// @route DELETE /api/pdf-chat/:id
export const deletePdfDocument = asyncHandler(async (req, res) => {
  const doc = await PdfDocument.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!doc) {
    res.status(404);
    throw new Error("Document not found");
  }
  res.json({ message: "Document deleted" });
});
