import express from "express";
import {
  uploadPdf,
  getPdfDocuments,
  getPdfDocumentById,
  askPdfQuestion,
  deletePdfDocument,
} from "../controllers/pdfChatController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/upload", upload.single("pdf"), uploadPdf);
router.get("/", getPdfDocuments);
router.get("/:id", getPdfDocumentById);
router.post("/:id/ask", askPdfQuestion);
router.delete("/:id", deletePdfDocument);

export default router;
