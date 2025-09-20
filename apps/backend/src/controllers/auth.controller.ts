// apps/backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, confirmPassword } = req.body;

    // Mirror frontend validation: Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match',
      });
    }

    // Check if user already exists (handled by validator, but double-check)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Hash password with higher security rounds
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim(),
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        iat: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user with password field (normalized email)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      if (res.locals.trackFailedLogin) {
        res.locals.trackFailedLogin();
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Compare password with timing-safe comparison
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      if (res.locals.trackFailedLogin) {
        res.locals.trackFailedLogin();
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Clear login attempts on successful login
    if (res.locals.clearLoginAttempts) {
      res.locals.clearLoginAttempts();
    }

    // Generate JWT token with enhanced security
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        iat: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Update last login time (optional - don't fail if it errors)
    try {
      await User.findByIdAndUpdate(user._id, {
        lastLogin: new Date(),
        $inc: { loginCount: 1 },
      });
    } catch (updateError) {
      console.warn('Failed to update user login stats:', updateError);
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
    });
  }
};
