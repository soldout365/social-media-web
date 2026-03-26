import sharp from "../../node_modules/sharp/lib/index.js";
import cloudinary from "../lib/cloudinary.js";

import { getReceiverSocketId, io } from "../lib/socket.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import User from "../models/user.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.user?._id || req.id;

    if (!image) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64",
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "Post created successfully",
      post,
      success: true,
    });

  } catch (error) {
    console.log("error in postController  ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {

    const limit = parseInt(req.query.limit) || 10; 
    const cursor = req.query.cursor; 

    let query = {};
    if (cursor) {

      query._id = { $lt: cursor };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1, _id: -1 }) 
      .limit(limit + 1) 
      .populate({
        path: "author",
        select: "fullName profilePic",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "fullName profilePic" },
      });

    const hasMore = posts.length > limit;
    const result = hasMore ? posts.slice(0, limit) : posts;

    const nextCursor = result.length > 0 ? result[result.length - 1]._id : null;

    return res.status(200).json({
      posts: result,
      nextCursor,
      hasMore,
      success: true,
    });
  } catch (error) {
    console.log("error in getALlpost controller ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.user?._id || req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "fullName profilePic",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "fullName profilePic" },
      });
    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.log("error in getUserPost controller", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.id; 
    const postId = req.params.id; 

    const post = await Post.findById(postId); 
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const isAlreadyLiked = post.likes.includes(currentUserId);

    if (isAlreadyLiked) {
      await post.updateOne({ $pull: { likes: currentUserId } }); 
    } else {
      await post.updateOne({ $addToSet: { likes: currentUserId } }); 
    }

    await post.save(); 

    const currentUser = await User.findById(currentUserId).select(
      "fullName profilePic",
    );
    const postAuthorId = post.author.toString();

    if (postAuthorId !== currentUserId) {
      const notification = {
        type: isAlreadyLiked ? "dislike" : "like", 
        userId: currentUserId,
        userDetails: currentUser,
        postId,
        message: isAlreadyLiked
          ? "disliked your post"
          : " đã thích bài viết của bạn",
      };

      const postAuthorSocketId = getReceiverSocketId(postAuthorId);
      io.to(postAuthorSocketId).emit("notification", notification); 
    }

    return res.status(200).json({
      message: isAlreadyLiked ? "Post disliked" : "Post liked",
      success: true,
      isLiked: !isAlreadyLiked, 
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error", success: false });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;

    const authorCommentId = req.user?._id || req.id;

    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!text)
      return res
        .status(400)
        .json({ message: "Comment text is required", success: false });

    const comment = await Comment.create({
      text,
      author: authorCommentId,
      post: postId,
    });

    await comment.populate({ path: "author", select: "fullName profilePic" });
    post.comments.push(comment._id);
    await post.save();

    return res
      .status(201)
      .json({ comment, success: true, message: "Comment added" });
  } catch (error) {
    console.log("error in addcmtPost controller", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "fullName profilePic",
    );

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found for this post", success: false });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log("error in getCommentsOfPost controller", error);
    res.status(500).json({ message: "Internal Server error", success: false });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id; 
    const authorId = req.user._id; 

    console.log("🗑️ Deleting post:", { postId, authorId: authorId.toString() });

    const post = await Post.findById(postId); 
    if (!post) {
      console.log("❌ Post not found:", postId);
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    console.log(
      "📝 Post author:",
      post.author.toString(),
      "Current user:",
      authorId.toString(),
    );

    if (post.author.toString() !== authorId.toString()) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    await Post.findByIdAndDelete(postId);
    console.log("✅ Post deleted from DB");

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId); 
    await user.save();
    console.log("✅ Post removed from user's posts array");

    await Comment.deleteMany({ post: postId });
    console.log("✅ Comments deleted");

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log("❌ Error in deletePost:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id; 
    const currentUserId = req.user?._id || req.id; 

    const post = await Post.findById(postId); 
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(currentUserId); 
    const isBookmarked = user.bookmarks.includes(postId); 

    if (isBookmarked) {

      await user.updateOne({ $pull: { bookmarks: postId } }); 
    } else {

      await user.updateOne({ $addToSet: { bookmarks: postId } }); 
    }

    await user.save(); 

    return res.status(200).json({
      type: isBookmarked ? "unsaved" : "saved", 
      message: isBookmarked ? "Post removed from bookmark" : "Post bookmarked",
      success: true,
      isBookmarked: !isBookmarked, 
    });
  } catch (error) {
    console.log("error in bookmarkPost controller", error);
    return res
      .status(500)
      .json({ message: "Internal Server error", success: false });
  }
};
