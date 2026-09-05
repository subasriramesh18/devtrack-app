const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');

/**
 * Sign JWT token for user
 */
const signToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Helper to attach JWT cookie and send JSON response
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id);

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  const userData = user.toObject ? user.toObject() : { ...user };
  delete userData.password;

  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: userData,
      token,
    },
  });
};

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, handle, avatar, company, location, bio } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return next(AppError.conflict(`An account with email '${email}' already exists`));
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: role || 'Software Engineer',
      handle,
      avatar:
        avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      company: company || 'DevTrack Labs',
      location: location || 'Remote',
      bio: bio || '',
    });

    return sendTokenResponse(newUser, 201, res, 'User account registered successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Login existing user
 * POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return next(AppError.unauthorized('Invalid email or password'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(AppError.unauthorized('Invalid email or password'));
    }

    return sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Get currently authenticated user profile
 * GET /api/v1/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return next(AppError.notFound('User profile not found'));
    }

    return sendSuccess(res, user, 'Authenticated user profile retrieved');
  } catch (error) {
    return next(error);
  }
};

/**
 * Logout user / clear cookie
 * POST /api/v1/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'none' : 'lax',
    });

    return sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
