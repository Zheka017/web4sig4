import { sanitizeString, sanitizeEmail } from './security.js';

export function validateRegister(email, password, name) {
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else if (!validateEmailFormat(email)) {
    errors.push('Invalid email format');
  }

  if (!password || password.trim() === '') {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  return { isValid: errors.length === 0, errors };
}

export function validateLogin(email, password) {
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  }

  if (!password || password.trim() === '') {
    errors.push('Password is required');
  }

  return { isValid: errors.length === 0, errors };
}

export function validateTaskCreation(title, description) {
  const errors = [];

  if (!title || title.trim() === '') {
    errors.push('Title is required');
  } else if (title.length > 200) {
    errors.push('Title must not exceed 200 characters');
  }

  if (!description || description.trim() === '') {
    errors.push('Description is required');
  } else if (description.length > 5000) {
    errors.push('Description must not exceed 5000 characters');
  }

  return { isValid: errors.length === 0, errors };
}

export function validateTaskUpdate(status) {
  const validStatuses = ['pending', 'in-progress', 'completed'];

  if (status && !validStatuses.includes(status)) {
    return {
      isValid: false,
      errors: [`Status must be one of: ${validStatuses.join(', ')}`],
    };
  }

  return { isValid: true, errors: [] };
}

function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeTaskInput(title, description) {
  return {
    title: sanitizeString(title),
    description: sanitizeString(description),
  };
}
