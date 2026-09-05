const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Authentication Middleware
 * Extracts and verifies JWT from Authorization header or cookie
 */
const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies (if cookie-parser is used)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(AppError.unauthorized('Authentication token is missing. Please log in.'));
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(AppError.unauthorized('Session has expired. Please log in again.'));
      }
      return next(AppError.unauthorized('Invalid authentication token.'));
    }

    // Fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(AppError.unauthorized('The user belonging to this token no longer exists.'));
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Optional Auth Middleware
 * Attaches user if valid token exists, but doesn't block unauthenticated requests
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch {
      // Ignore token verification errors for optional auth
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
};
