import { ObjectId } from 'mongodb';
import { getDB } from '../utils/database.js';

// User Model
export async function createUser(userData) {
  const users = getDB().collection('users');
  const result = await users.insertOne({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
}

export async function getUserByEmail(email) {
  const users = getDB().collection('users');
  return await users.findOne({ email: email.toLowerCase() });
}

export async function getUserById(userId) {
  const users = getDB().collection('users');
  return await users.findOne({ _id: new ObjectId(userId) });
}

// Task Model
export async function createTask(taskData) {
  const tasks = getDB().collection('tasks');
  const result = await tasks.insertOne({
    ...taskData,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
}

export async function getTaskById(taskId) {
  const tasks = getDB().collection('tasks');
  return await tasks.findOne({ _id: new ObjectId(taskId) });
}

export async function getTasksByUserId(userId) {
  const tasks = getDB().collection('tasks');
  return await tasks.find({ userId: new ObjectId(userId) }).toArray();
}

export async function updateTask(taskId, updateData) {
  const tasks = getDB().collection('tasks');
  const result = await tasks.updateOne(
    { _id: new ObjectId(taskId) },
    {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    }
  );
  return result;
}

export async function deleteTask(taskId) {
  const tasks = getDB().collection('tasks');
  const result = await tasks.deleteOne({ _id: new ObjectId(taskId) });
  return result;
}

export async function getAllTasks() {
  const tasks = getDB().collection('tasks');
  return await tasks.find({}).toArray();
}
