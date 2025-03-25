import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import todoRouter from "./routes/todo.route.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://mern-daily-todo.netlify.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/user", userRouter);
app.use("/todo", todoRouter);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});