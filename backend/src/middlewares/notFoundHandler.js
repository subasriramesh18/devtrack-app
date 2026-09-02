const AppError = require('../utils/AppError');

/**
 * 404 Not Found Middleware for unhandled routes
 */
const notFoundHandler = (req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Endpoint not found`, 404));
};

module.exports = notFoundHandler;
