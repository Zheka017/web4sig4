import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Password hashing
export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

export async function comparePasswords(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    return false;
  }
}

// JWT token generation
export function generateToken(userId, role) {
  try {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
  } catch (error) {
    throw new Error('Error generating token');
  }
}

// JWT token verification
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Input validation
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // Password must be at least 6 characters
  return password && password.length >= 6;
}

export function validateTaskInput(title, description) {
  return {
    isValid: title && description && title.trim() && description.trim(),
    errors: [],
  };
}

// Input sanitization
export function sanitizeString(str) {
  if (!str) return '';
  return str
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 500);
}

export function sanitizeEmail(email) {
  if (!email) return '';
  return email.trim().toLowerCase().replace(/[<>]/g, '');
}
