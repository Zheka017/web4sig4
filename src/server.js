import express from 'express';
import dotenv from 'dotenv';
import { connectDB, closeDB } from './utils/database.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter); // Apply general rate limiting

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/me', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Press Ctrl+C to stop the server');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closeDB();
  process.exit(0);
});

startServer();
