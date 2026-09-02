/**
 * Custom Application Error class for operational errors.
 */
class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {Array<object>|null} errors - Detailed validation errors or sub-issues
   */
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    if (errors) {
      this.errors = errors;
    }

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', errors = null) {
    return new AppError(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  static conflict(message = 'Conflict: Resource already exists') {
    return new AppError(message, 409);
  }

  static unprocessableEntity(message = 'Unprocessable Entity', errors = null) {
    return new AppError(message, 422, errors);
  }

  static internal(message = 'Internal Server Error') {
    return new AppError(message, 500);
  }
}

module.exports = AppError;
