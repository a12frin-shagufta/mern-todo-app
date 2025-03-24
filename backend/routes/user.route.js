import express from 'express';
import { login, logout, register } from '../controllers/user.controller.js';

const router = express.Router();

// signup route
router.post('/signup',register)

// login route

router.post('/login',login)

// logout route

router.post('/logout',logout)
export default router;