import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  googleAuth,
  forgotPassword,
  resetPassword,
  updateProfile,
  updateAvatar,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import avatarUpload from "../middleware/avatarUploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/avatar", protect, avatarUpload.single("avatar"), updateAvatar);

export default router;