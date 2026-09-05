const config = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * Centralized Error Handling Middleware for Express & Mongoose
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle JSON parse error (e.g., malformed body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = new AppError('Invalid JSON payload in request body', 400);
  }

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid resource identifier format for '${err.path}': '${err.value}'`;
    error = new AppError(message, 400);
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const formattedErrors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
      kind: val.kind,
    }));
    error = new AppError('Database validation failed', 400, formattedErrors);
  }

  // Handle MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : 'value';
    const message = `A record with ${field} '${value}' already exists`;
    error = new AppError(message, 409);
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
