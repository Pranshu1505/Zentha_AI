import express from "express";
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  aiEnhanceResume,
  exportResumePdf,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").post(createResume).get(getResumes);
router.route("/:id").get(getResumeById).put(updateResume).delete(deleteResume);
router.post("/:id/ai-enhance", aiEnhanceResume);
router.get("/:id/export-pdf", exportResumePdf);

export default router;