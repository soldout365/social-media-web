import express from "express";
import {
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import arcjetProtection from "../middleware/arcjet.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.use(arcjetProtection); // Apply Arcjet protection to all auth routes

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/:id/profile", protectRoute, getProfile);

router.post(
  "/profile/edit",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
);

router.get("/suggested", protectRoute, getSuggestedUsers);

router.post(
  "/follow-or-unfollow/:targetUserId",
  protectRoute,
  followOrUnfollow
);

router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user)
);

export default router;
