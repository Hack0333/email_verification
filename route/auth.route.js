import express from "express";
import {verifyToken} from '../middleware/verifyToken.js'
import { login, logout, signup,verifyEmail,forgotPassword,resetPassword,checkAuth} from "../controller/auth.controller.js";


const router = express.Router();

router.post('/login',login);
router.post('/signup',signup);
router.post('/logout',logout);

router.post('/verify-email',verifyEmail);
router.post('/forgot-password',forgotPassword);

router.post('/reset-password/:resetToken',resetPassword);

router.get('/check-auth',verifyToken, checkAuth)

export default router;