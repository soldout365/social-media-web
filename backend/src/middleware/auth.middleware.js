import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res.status(401).json({ message: "Not authorized, no token" });

    const decode = jwt.verify(token, ENV.JWT_SECRET);
    if (!decode)
      return res.status(401).json({ message: "Not authorized, token failed" });

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
    //next de chuyen sang controller
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
