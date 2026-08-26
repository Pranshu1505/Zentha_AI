import OpenAI from "openai";

// Google Gemini ka OpenAI-compatible endpoint use kar rahe hain —
// same OpenAI SDK, bas baseURL + model names alag hain.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const CHAT_MODEL = "gemini-3.5-flash";
const EMBED_MODEL = "gemini-embedding-001";

export const chatComplete = async (messages, options = {}) => {
  const response = await openai.chat.completions.create({
    model: options.model || CHAT_MODEL,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens || 1200,
    response_format: options.json ? { type: "json_object" } : undefined,
  });
  return response.choices[0].message.content;
};

export const createEmbeddings = async (textChunks) => {
  const response = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: textChunks,
  });
  return response.data.map((d) => d.embedding);
};

export const cosineSimilarity = (a, b) => {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

export default { chatComplete, createEmbeddings, cosineSimilarity };