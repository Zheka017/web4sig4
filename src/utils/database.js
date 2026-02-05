import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client;
let db;

export async function connectDB() {
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.DB_NAME);
    
    // Create indexes for better query performance
    await createIndexes();
    
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

async function createIndexes() {
  const users = db.collection('users');
  const tasks = db.collection('tasks');
  
  // Create unique index on email for users
  await users.createIndex({ email: 1 }, { unique: true });
  
  // Create indexes for tasks for better query performance
  await tasks.createIndex({ userId: 1 });
  await tasks.createIndex({ createdAt: -1 });
  await tasks.createIndex({ userId: 1, createdAt: -1 });
}

export { db };
