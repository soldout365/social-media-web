import sharp from "../../node_modules/sharp/lib/index.js";
import cloudinary from "../lib/cloudinary.js";

import { getReceiverSocketId, io } from "../lib/socket.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import User from "../models/user.model.js";

//create post
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.user?._id || req.id;

    if (!image) {
      return res.status(400).json({ message: "Image file is required" });
    }
    //image upload logic here
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //buffer to datauri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
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

    //populate author field except password
    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "Post created successfully",
      post,
      success: true,
    });

    //
  } catch (error) {
    console.log("error in postController  ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

//get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
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
    console.log("error in getALlpost controller ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

//get user posts by userId
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

// Hàm xử lý toggle like/unlike bài post
export const toggleLikePost = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.id; // ID người dùng hiện tại
    const postId = req.params.id; // ID bài post

    const post = await Post.findById(postId); // Tìm bài post
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // Kiểm tra user đã like bài post này chưa
    const isAlreadyLiked = post.likes.includes(currentUserId);

    // Toggle: nếu đã like thì bỏ like, chưa like thì thêm like
    if (isAlreadyLiked) {
      await post.updateOne({ $pull: { likes: currentUserId } }); // Xóa user khỏi danh sách likes
    } else {
      await post.updateOne({ $addToSet: { likes: currentUserId } }); // Thêm user vào danh sách likes
    }

    await post.save(); // Lưu thay đổi vào DB

    // Lấy thông tin user để gửi thông báo
    const currentUser = await User.findById(currentUserId).select(
      "fullName profilePic"
    );
    const postAuthorId = post.author.toString();

    // Chỉ gửi thông báo nếu không phải tự like bài của mình
    if (postAuthorId !== currentUserId) {
      const notification = {
        type: isAlreadyLiked ? "dislike" : "like", // Loại thông báo
        userId: currentUserId,
        userDetails: currentUser,
        postId,
        message: isAlreadyLiked
          ? "disliked your post"
          : " đã thích bài viết của bạn",
      };

      const postAuthorSocketId = getReceiverSocketId(postAuthorId);
      io.to(postAuthorSocketId).emit("notification", notification); // Gửi thông báo realtime qua socket
    }

    return res.status(200).json({
      message: isAlreadyLiked ? "Post disliked" : "Post liked",
      success: true,
      isLiked: !isAlreadyLiked, // Trả về trạng thái mới sau khi toggle
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error", success: false });
  }
};

//add comment to post
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

//get comments of post
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "fullName profilePic"
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

//delete post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id; // ID bài post cần xóa
    const authorId = req.user._id; // ID user đang đăng nhập từ protectRoute middleware

    console.log("🗑️ Deleting post:", { postId, authorId: authorId.toString() });

    const post = await Post.findById(postId); // Tìm bài post
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
      authorId.toString()
    );

    // Kiểm tra có phải chủ bài post không
    if (post.author.toString() !== authorId.toString()) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    // BƯỚC 1: Xóa document Post trong collection "posts"
    await Post.findByIdAndDelete(postId);
    console.log("✅ Post deleted from DB");

    // BƯỚC 2: Xóa postId trong array "posts" của User (vì User lưu danh sách ID bài post)
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId); // Filter để loại bỏ postId
    await user.save();
    console.log("✅ Post removed from user's posts array");

    // BƯỚC 3: Xóa tất cả comments liên quan đến bài post này
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

//luu post
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id; // ID bài post
    const currentUserId = req.user?._id || req.id; // ID user hiện tại

    const post = await Post.findById(postId); // Tìm bài post
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(currentUserId); // Lấy thông tin user
    const isBookmarked = user.bookmarks.includes(postId); // Kiểm tra đã bookmark chưa

    if (isBookmarked) {
      // Đã bookmark → Bỏ bookmark
      await user.updateOne({ $pull: { bookmarks: postId } }); // Xóa khỏi array bookmarks
    } else {
      // Chưa bookmark → Thêm bookmark
      await user.updateOne({ $addToSet: { bookmarks: postId } }); // Thêm vào array bookmarks
    }

    await user.save(); // Lưu thay đổi

    return res.status(200).json({
      type: isBookmarked ? "unsaved" : "saved", // Trạng thái mới
      message: isBookmarked ? "Post removed from bookmark" : "Post bookmarked",
      success: true,
      isBookmarked: !isBookmarked, // Trả về trạng thái sau khi toggle
    });
  } catch (error) {
    console.log("error in bookmarkPost controller", error);
    return res
      .status(500)
      .json({ message: "Internal Server error", success: false });
  }
};
