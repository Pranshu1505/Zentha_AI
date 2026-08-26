import express from "express";
import {
  createChatbot,
  getChatbots,
  getChatbotById,
  updateChatbot,
  deleteChatbot,
  publicChatMessage,
  publicChatbotConfig,
} from "../controllers/chatbotController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public widget routes (no auth) - must come before protect middleware applies
router.get("/public/:publicKey/config", publicChatbotConfig);
router.post("/public/:publicKey/message", publicChatMessage);

// Private (dashboard) routes
router.use(protect);
router.route("/").post(createChatbot).get(getChatbots);
router.route("/:id").get(getChatbotById).put(updateChatbot).delete(deleteChatbot);

export default router;
