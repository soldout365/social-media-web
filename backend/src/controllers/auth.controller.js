import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";
import getDataUri from "../lib/datauri.js";
// SIGNUP CONTROLLER
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check if emailis valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // tim email trong db
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // hasding password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();

      // Tạo user trên Stream
      try {
        await upsertStreamUser({
          id: savedUser._id.toString(),
          name: savedUser.fullName,
          image: savedUser.profilePic || "",
        });
        console.log(`Stream user created for ${savedUser.fullName}`);
      } catch (streamError) {
        console.error("Error creating Stream user:", streamError);
      }

      // Generate JWT token
      generateToken(newUser._id, res);

      // Send response to client
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      // Sử dụng setImmediate để chạy sau khi response đã gửi
      setImmediate(async () => {
        try {
          await sendWelcomeEmail(
            savedUser.email,
            savedUser.fullName,
            ENV.CLIENT_URL
          );
          console.log(`Welcome email sent to ${savedUser.email}`);
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
        }
      });
    }
  } catch (error) {
    console.log("error in signup controller : ", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN CONTROLLER
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
      // never reveal which one is incorrect because anyone can use this info to hack
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " Internal Server error" });
  }
};

// LOGOUT CONTROLLER
export const logout = async (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

// UPDATE PROFILE CONTROLLER
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - userId missing", success: false });
    }

    const { profilePic, bio, gender } = req.body; // from chatapp
    const profilePictureFile = req.file; // from socialapp

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    let cloudResponse;

    if (profilePictureFile) {
      // from socialapp
      const fileUri = getDataUri(profilePictureFile);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
      user.profilePic = cloudResponse.secure_url;
    } else if (profilePic) {
      // from chatapp
      cloudResponse = await cloudinary.uploader.upload(profilePic);
      user.profilePic = cloudResponse.secure_url;
    }

    if (bio !== undefined) user.bio = bio;
    if (gender !== undefined) user.gender = gender;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("error in updateProfile controller : ", error);
    res.status(500).json({ message: "Server error" });
  }
};
// GET PROFILE CONTROLLER
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: "author",
            select: "fullName profilePic",
          },
          {
            path: "comments",
            options: { sort: { createdAt: -1 } },
            populate: {
              path: "author",
              select: "fullName profilePic",
            },
          },
        ],
      })
      .populate({
        path: "bookmarks",
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: "author",
            select: "fullName profilePic",
          },
          {
            path: "comments",
            options: { sort: { createdAt: -1 } },
            populate: {
              path: "author",
              select: "fullName profilePic",
            },
          },
        ],
      })
      .populate("followers", "fullName profilePic")
      .populate("following", "fullName profilePic");

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log("error in GetProfile controller : ", error);
    res.status(500).json({ message: " Internal Server error" });
  }
};

// SUGGESTED USERS CONTROLLER
export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user?._id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    // Lấy thông tin user hiện tại để biết danh sách đang follow
    const currentUser = await User.findById(currentUserId).select("following");

    // Tìm users chưa được follow (không có trong danh sách following)
    const suggestedUsers = await User.find({
      _id: {
        $ne: currentUserId, // Không phải chính mình
        $nin: currentUser.following, // Chưa được follow
      },
    })
      .select("-password")
      .limit(10);

    return res.status(200).json({
      message: "Suggested users found",
      users: suggestedUsers,
      success: true,
    });
  } catch (error) {
    console.log("error in getSuggestUsers controller ", error);
    res.status(500).json({ message: " Internal Server error" });
  }
};
// follow unfollow controller
export const followOrUnfollow = async (req, res) => {
  try {
    const requestingUserId = req.user._id; // ID của người dùng đang thực hiện hành động (từ token/middleware)
    const targetUserId = req.params.targetUserId; // ID của người dùng được follow/unfollow (từ URL params)

    // Kiểm tra không cho phép tự follow chính mình
    if (requestingUserId === targetUserId) {
      return res.status(400).json({
        message: "Bạn không thể theo dõi hoặc hủy theo dõi chính mình",
        success: false,
      });
    }

    // Lấy thông tin cả 2 users song song để tối ưu hiệu suất
    const [requestingUser, targetUser] = await Promise.all([
      User.findById(requestingUserId), // Tìm user đang thực hiện hành động
      User.findById(targetUserId), // Tìm user mục tiêu
    ]);

    // Kiểm tra xem cả 2 users có tồn tại không
    if (!requestingUser || !targetUser) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    // Kiểm tra xem user đã follow target chưa (kiểm tra trong mảng following)
    const isFollowing = requestingUser.following.includes(targetUserId);

    if (isFollowing) {
      // === TRƯỜNG HỢP UNFOLLOW ===
      await Promise.all([
        User.updateOne(
          { _id: requestingUserId },
          { $pull: { following: targetUserId } } // Xóa targetUserId khỏi mảng following của requesting user
        ),
        User.updateOne(
          { _id: targetUserId },
          { $pull: { followers: requestingUserId } } // Xóa requestingUserId khỏi mảng followers của target user
        ),
      ]);

      // Lấy thông tin user đã cập nhật
      const updatedUser = await User.findById(requestingUserId).select(
        "-password"
      );

      return res.status(200).json({
        message: "Người dùng đã hủy theo dõi thành công",
        success: true,
        user: updatedUser,
      });
    } else {
      // === TRƯỜNG HỢP FOLLOW ===
      await Promise.all([
        User.updateOne(
          { _id: requestingUserId },
          { $addToSet: { following: targetUserId } } // Thêm targetUserId vào mảng following (addToSet tránh duplicate)
        ),
        User.updateOne(
          { _id: targetUserId },
          { $addToSet: { followers: requestingUserId } } // Thêm requestingUserId vào mảng followers (addToSet tránh duplicate)
        ),
      ]);

      // Lấy thông tin user đã cập nhật
      const updatedUser = await User.findById(requestingUserId).select(
        "-password"
      );

      return res.status(200).json({
        message: "Theo dõi người dùng thành công",
        success: true,
        user: updatedUser,
      });
    }
  } catch (error) {
    console.log("error in followOrUnfollow controller ", error); // Log lỗi để debug
    res.status(500).json({ message: " Internal Server error" }); // Trả về lỗi server
  }
};
