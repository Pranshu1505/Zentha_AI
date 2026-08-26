import express from "express";
import {
  startInterview,
  getInterviews,
  getInterviewById,
  submitAnswer,
  finishInterview,
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/start", startInterview);
router.get("/", getInterviews);
router.get("/:id", getInterviewById);
router.post("/:id/answer", submitAnswer);
router.post("/:id/finish", finishInterview);

export default router;
