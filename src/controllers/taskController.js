import { ObjectId } from 'mongodb';
import {
  createTask,
  getTaskById,
  getTasksByUserId,
  updateTask,
  deleteTask,
  getAllTasks,
} from '../models/Model.js';
import {
  validateTaskCreation,
  validateTaskUpdate,
  sanitizeTaskInput,
} from '../utils/validation.js';

export async function createNewTask(req, res) {
  try {
    const { title, description } = req.body;

    // Validate input
    const validation = validateTaskCreation(title, description);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Sanitize input
    const sanitized = sanitizeTaskInput(title, description);

    // Create task
    const result = await createTask({
      userId: new ObjectId(req.user.userId),
      title: sanitized.title,
      description: sanitized.description,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: result.insertedId,
        title: sanitized.title,
        description: sanitized.description,
        status: 'pending',
      },
    });
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

export async function getAllUserTasks(req, res) {
  try {
    const tasks = await getTasksByUserId(req.user.userId);

    res.json({
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      tasks: tasks.map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get all tasks error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
}

export async function getTaskDetail(req, res) {
  try {
    const taskId = req.params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const task = await getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get task error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve task' });
  }
}

export async function updateTaskStatus(req, res) {
  try {
    const taskId = req.params.id;
    const { status } = req.body;

    // Validate ObjectId format
    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    // Validate status
    const validation = validateTaskUpdate(status);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Get task to verify ownership
    const task = await getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check ownership or admin role
    if (
      task.userId.toString() !== req.user.userId &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to update this task' });
    }

    // Update task
    const updateData = {};
    if (status) {
      updateData.status = status;
    }

    await updateTask(taskId, updateData);

    // Fetch updated task
    const updatedTask = await getTaskById(taskId);

    res.json({
      message: 'Task updated successfully',
      task: {
        id: updatedTask._id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        createdAt: updatedTask.createdAt,
        updatedAt: updatedTask.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

export async function deleteTaskById(req, res) {
  try {
    const taskId = req.params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    // Get task to verify ownership
    const task = await getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check ownership or admin role
    if (
      task.userId.toString() !== req.user.userId &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to delete this task' });
    }

    // Delete task
    await deleteTask(taskId);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}
