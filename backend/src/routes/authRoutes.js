import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  googleAuth,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;