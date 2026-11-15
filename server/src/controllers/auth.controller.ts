import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user.model.js';
import { env } from '../config/env.js';

const COOKIE_NAME = 'token';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});

const generateToken = (userId: string, role: UserRole): string => {
  return jwt.sign(
    { id: userId, role },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      role,
      pharmacyName,
      address,
      city,
      phone,
      licenseNumber,
      open24Hours,
      closingTime,
    } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
      return;
    }

    // Validate role if provided
    let assignedRole: UserRole = 'CUSTOMER';
    if (role && ['CUSTOMER', 'PHARMACY', 'ADMIN'].includes(role.toUpperCase())) {
      assignedRole = role.toUpperCase() as UserRole;
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      pharmacyName: pharmacyName || (assignedRole === 'PHARMACY' ? name : undefined),
      address: address || undefined,
      city: city || undefined,
      phone: phone || undefined,
      licenseNumber: licenseNumber || undefined,
      open24Hours: Boolean(open24Hours),
      closingTime: closingTime || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth Controller - Register Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Server error during registration',
    });
  }
};

/**
 * @desc    Log in user, set httpOnly cookie, and return user profile
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
      return;
    }

    // Find user with password selected
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    // Set token in httpOnly cookie
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token, // Also return in body for mobile/bearer clients
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Auth Controller - Login Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Server error during login',
    });
  }
};

/**
 * @desc    Log out user and clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('[Auth Controller - Logout Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Server error during logout',
    });
  }
};

/**
 * @desc    Get currently logged-in user profile from cookie or Bearer token
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const token =
      req.cookies?.[COOKIE_NAME] ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: UserRole };
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session token',
    });
  }
};
