import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createTodo, deleteTodo, getTodo, updateTodo } from "../controllers/todo.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createTodo);
router.get("/fetch", verifyToken, getTodo);
router.put("/update/:id", verifyToken, updateTodo);
router.delete("/delete/:id", verifyToken, deleteTodo);

export default router;








// import express from 'express';
// import { verifyToken } from '../middleware/auth.js';
// import { createTodo, deleteTodo, getTodo, updateTodo } from '../controllers/todo.controller.js';

// const router = express.Router() // ye router define krne ka fnc hai
// // hame data frontend se bhejna hai kyuki usre hi likhega use kya todo create krna hai isliy ham post method use kr rhe
// router.post('/create', verifyToken,createTodo)

// // ab mujhe get route banaa hai

// router.get("/fetch", verifyToken, getTodo)


// // ab mujhe update ke liy route banana hai
// //PUT method ka use data ko update (edit) karne ke liye kiya jata hai.
// //Jaise agar tumhare To-Do App me ek task add kiya:
// //✅ Task: Learn JavaScript
// //Ab tum us task ko edit karna chahti ho:
// //✅ Updated Task: Learn React.js

// router.put("/update/:id",verifyToken, updateTodo)

// // delete router
// router.delete("/delete/:id", verifyToken, deleteTodo)

// export default router