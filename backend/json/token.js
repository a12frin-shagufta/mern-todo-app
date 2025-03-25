import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const generateTokenAndSaveInCookies = async (userId, res) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: false, // Local ke liye false
    sameSite: "lax", // Local ke liye lax
    path: "/",
  });

  console.log("Setting authToken cookie:", token);

  await User.findByIdAndUpdate(userId, { token }, { new: true });

  return token;
};