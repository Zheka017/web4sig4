import express from 'express';
import {
  createNewTask,
  getAllUserTasks,
  getTaskDetail,
  updateTaskStatus,
  deleteTaskById,
} from '../controllers/taskController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticateUser);

router.post('/', createNewTask);
router.get('/', getAllUserTasks);
router.get('/:id', getTaskDetail);
router.patch('/:id', updateTaskStatus);
router.delete('/:id', deleteTaskById);

export default router;
