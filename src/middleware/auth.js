import { verifyToken } from '../utils/security.js';

export function authenticateUser(req, res, next) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token is required' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function authorizeTaskOwner(req, res, next) {
  try {
    const { Task } = await import('../models/Model.js');
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Allow owner or admin to modify
    if (task.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'You do not have permission to modify this task' });
    }

    req.task = task;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authorization failed' });
  }
}

export function checkRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to perform this action' });
    }
    next();
  };
}

export function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed', details: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  });
}
