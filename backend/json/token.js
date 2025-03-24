import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const generateTokenAndSaveInCookies = async (userId, res) => {
  // Debug log to check if JWT_SECRET is loaded
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  // Set secure: true in production
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: isProduction, // true in production, false in development
    sameSite: isProduction ? "strict" : "lax", // stricter in production
    path: "/",
  });

  console.log("Setting authToken cookie:", token);

  // Update user with token (if token field exists in schema)
  await User.findByIdAndUpdate(userId, { token }, { new: true });

  return token;
};