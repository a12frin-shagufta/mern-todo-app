import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import todoRouter from './routes/todo.route.js';
import userRouter from './routes/user.route.js';

const app = express();

// Simplified CORS setup for debugging
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
connectDb();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} received from ${req.headers.origin}`);
  console.log("Cookies:", req.cookies);
  next();
});

app.get("/test", (req, res) => {
  res.json({ message: "Backend test successful" });
});

app.use("/todo", todoRouter);
app.use("/user", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});