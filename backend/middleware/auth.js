import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("Cookies:", req.cookies); // Debug ke liye
  const token = req.cookies.authToken; // Cookie 'authToken' se token lo
  if (!token) {
    return res.status(401).json({ message: "No token provided, unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId; // Token se userId extract karo
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};