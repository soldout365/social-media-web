import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";
import getDataUri from "../lib/datauri.js";

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();

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

      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      setImmediate(async () => {
        try {
          await sendWelcomeEmail(
            savedUser.email,
            savedUser.fullName,
            ENV.CLIENT_URL,
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

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });

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
      role: user.role,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " Internal Server error" });
  }
};

export const logout = async (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - userId missing", success: false });
    }

    const { profilePic, bio, gender } = req.body; 
    const profilePictureFile = req.file; 

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    let cloudResponse;

    if (profilePictureFile) {

      const fileUri = getDataUri(profilePictureFile);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
      user.profilePic = cloudResponse.secure_url;
    } else if (profilePic) {

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

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user?._id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const currentUser = await User.findById(currentUserId).select("following");

    const suggestedUsers = await User.find({
      _id: {
        $ne: currentUserId, 
        $nin: currentUser.following, 
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

export const followOrUnfollow = async (req, res) => {
  try {
    const requestingUserId = req.user._id; 
    const targetUserId = req.params.targetUserId; 

    if (requestingUserId === targetUserId) {
      return res.status(400).json({
        message: "Bạn không thể theo dõi hoặc hủy theo dõi chính mình",
        success: false,
      });
    }

    const [requestingUser, targetUser] = await Promise.all([
      User.findById(requestingUserId), 
      User.findById(targetUserId), 
    ]);

    if (!requestingUser || !targetUser) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    const isFollowing = requestingUser.following.includes(targetUserId);

    if (isFollowing) {

      await Promise.all([
        User.updateOne(
          { _id: requestingUserId },
          { $pull: { following: targetUserId } }, 
        ),
        User.updateOne(
          { _id: targetUserId },
          { $pull: { followers: requestingUserId } }, 
        ),
      ]);

      const updatedUser =
        await User.findById(requestingUserId).select("-password");

      return res.status(200).json({
        message: "Người dùng đã hủy theo dõi thành công",
        success: true,
        user: updatedUser,
      });
    } else {

      await Promise.all([
        User.updateOne(
          { _id: requestingUserId },
          { $addToSet: { following: targetUserId } }, 
        ),
        User.updateOne(
          { _id: targetUserId },
          { $addToSet: { followers: requestingUserId } }, 
        ),
      ]);

      const updatedUser =
        await User.findById(requestingUserId).select("-password");

      return res.status(200).json({
        message: "Theo dõi người dùng thành công",
        success: true,
        user: updatedUser,
      });
    }
  } catch (error) {
    console.log("error in followOrUnfollow controller ", error); 
    res.status(500).json({ message: " Internal Server error" }); 
  }
};

export const getFollowingOfUser = async (req, res) => {
  try {
    const currentUserId = req.user?._id;
    const { cursor, limit = 10 } = req.query;

    const currentUser = await User.findById(currentUserId).select("following");

    if (!currentUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    let followingQuery = { _id: { $in: currentUser.following } };

    if (cursor) {
      followingQuery._id = {
        $in: currentUser.following,
        $gt: cursor,
      };
    }

    const followingUsers = await User.find(followingQuery)
      .select("fullName profilePic posts")
      .limit(parseInt(limit) + 1) 
      .sort({ _id: 1 }); 

    const hasMore = followingUsers.length > parseInt(limit);
    const users = hasMore
      ? followingUsers.slice(0, parseInt(limit))
      : followingUsers;
    const nextCursor = hasMore ? users[users.length - 1]._id.toString() : null;

    return res.status(200).json({
      following: users,
      hasMore,
      nextCursor,
      success: true,
    });
  } catch (error) {
    console.log("error in getFollowingOfUser controller ", error);
    res.status(500).json({ message: " Internal Server error" });
  }
};
