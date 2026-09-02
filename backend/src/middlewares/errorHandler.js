const config = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * Centralized Error Handling Middleware
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle JSON parse error (e.g., malformed body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = new AppError('Invalid JSON payload in request body', 400);
  }

  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';
  const message = error.message || 'Internal Server Error';

  const response = {
    success: false,
    status,
    message,
    ...(error.errors && { errors: error.errors }),
  };

  // Include stack trace only in development/test
  if (!config.isProduction) {
    response.stack = error.stack;
  }

  // Log 500 errors in console for debugging
  if (statusCode === 500) {
    console.error('💥 [Server Error]:', err);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
