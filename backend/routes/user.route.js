import express from 'express';
import { checkAuth, login, logout, register } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// signup route
router.post('/signup',register)

// login route

router.post('/login',login)

// logout route

router.post('/logout', verifyToken,logout)

// verify route
router.get("/verify",verifyToken,checkAuth)
export default router;
