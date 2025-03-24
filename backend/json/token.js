import jwt from "jsonwebtoken";
import User from "../model/user.model.js"; // User model bhi chahiye

export const generateTokenAndSaveInCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });
  console.log("Setting authToken cookie:", token);
  await User.findByIdAndUpdate(userId, { token });
  return token;
};