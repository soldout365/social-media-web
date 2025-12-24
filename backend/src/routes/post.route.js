import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  getAllPosts,
  getCommentsOfPost,
  getUserPost,
  toggleLikePost,
} from "../controllers/post.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.post("/addpost", upload.single("image"), addNewPost);

router.get("/allposts", getAllPosts);

router.get("/userpost/all", getUserPost); // chua dung

router.put("/:id/toggle-like", toggleLikePost);

router.post("/:id/comment", addComment);

router.get("/:id/comment/all", getCommentsOfPost);

router.delete("/delete/:id", deletePost);

router.post("/:id/bookmark", bookmarkPost);

export default router;
