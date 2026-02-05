import express from 'express';
import { getCurrentUser } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get current user info - requires authentication
router.get('/', authenticateUser, getCurrentUser);

export default router;
