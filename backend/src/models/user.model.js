import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    bio: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    // --- CÁC TRƯỜNG CHO CHỨC NĂNG (SHOP) ---
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "admin"],
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
  },
  { timestamps: true },
);

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);

export default User;

// Tên đầy đủ: Social dùng fullName (camelCase) ⚡ Flower dùng fullname (lowercase).
// 👉 Cách xử lý: Giữ nguyên fullName của Social. Khi copy code controller, nhớ sửa fullname -> fullName.
// Ảnh đại diện: Social dùng profilePic ⚡ Flower dùng avatar.
// 👉 Cách xử lý: Giữ nguyên profilePic. Sửa code controller từ avatar -> profilePic.
