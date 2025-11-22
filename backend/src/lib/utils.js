import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true, //ngan chan XXS tan cong : cross-site scripting
    sameSite: "strict", // ngan chan CSRF : cross-site request forgery
    secure: process.env.NODE_ENV === "development" ? false : true,
  });

  return token;
};
