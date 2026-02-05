import express from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Rate limit auth endpoints
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', authenticateUser, logout);

export default router;
