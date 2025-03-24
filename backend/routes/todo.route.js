import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createTodo, deleteTodo, getTodo, updateTodo } from "../controllers/todo.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createTodo);
router.get("/fetch", verifyToken, getTodo);
router.put("/update/:id", verifyToken, updateTodo);
router.delete("/delete/:id", verifyToken, deleteTodo);

export default router;





