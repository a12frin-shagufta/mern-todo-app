import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("Cookies:", req.cookies);
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided, unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET_KEY ko JWT_SECRET se replace kiya
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};