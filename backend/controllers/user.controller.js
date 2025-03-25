import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import { generateTokenAndSaveInCookies } from "../json/token.js";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export const register = async (req, res) => {
  console.log("Incoming request body:", req.body);
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validation = userSchema.safeParse({ email, username, password });
    if (!validation.success) {
      const errorMessage = validation.error.issues.map((err) => err.message);
      return res.status(400).json({ errors: errorMessage });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    const confirmToken = await generateTokenAndSaveInCookies(newUser._id, res);

    // Sanitize user object (remove password)
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      token: confirmToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10d" });
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-site cookies for production
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Failed to login" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
  res.status(200).json({ message: "Logout successful" });
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Authenticated", user });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Failed to verify user" });
  }
};