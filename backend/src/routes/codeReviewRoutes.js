import express from "express";
import {
  createCodeReview,
  getCodeReviews,
  getCodeReviewById,
  deleteCodeReview,
} from "../controllers/codeReviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").post(createCodeReview).get(getCodeReviews);
router.route("/:id").get(getCodeReviewById).delete(deleteCodeReview);

export default router;
