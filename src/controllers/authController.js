import {
  hashPassword,
  comparePasswords,
  generateToken,
} from '../utils/security.js';
import {
  validateRegister,
  validateLogin,
} from '../utils/validation.js';
import {
  createUser,
  getUserByEmail,
  getUserById,
} from '../models/Model.js';
import { sanitizeEmail } from '../utils/security.js';

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    // Validate input
    const validation = validateRegister(email, password, name);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await createUser({
      email: sanitizeEmail(email),
      password: hashedPassword,
      name: name.trim(),
      role: 'user', // Default role
    });

    // Generate token
    const token = generateToken(result.insertedId.toString(), 'user');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertedId,
        email: sanitizeEmail(email),
        name: name.trim(),
        role: 'user',
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);

    // Avoid leaking sensitive info
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLogin(email, password);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function logout(req, res) {
  // Since we're using JWT, logout is handled on the client side
  // by removing the token. This endpoint just confirms logout was requested.
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
