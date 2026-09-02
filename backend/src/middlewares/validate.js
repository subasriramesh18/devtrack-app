const { ZodError } = require('zod');
const AppError = require('../utils/AppError');

/**
 * Middleware factory to validate request data (body, query, params) against a Zod schema.
 * 
 * @param {import('zod').ZodSchema | { body?: import('zod').ZodSchema, query?: import('zod').ZodSchema, params?: import('zod').ZodSchema }} schema
 */
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      if (schema && typeof schema.parseAsync === 'function') {
        // Schema applies directly to req.body
        req.body = await schema.parseAsync(req.body);
      } else if (schema && typeof schema === 'object') {
        // Schema has body/query/params segments
        if (schema.body && typeof schema.body.parseAsync === 'function') {
          req.body = await schema.body.parseAsync(req.body);
        }
        if (schema.query && typeof schema.query.parseAsync === 'function') {
          req.query = await schema.query.parseAsync(req.query);
        }
        if (schema.params && typeof schema.params.parseAsync === 'function') {
          req.params = await schema.params.parseAsync(req.params);
        }
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        return next(new AppError('Validation failed', 400, formattedErrors));
      }
      return next(error);
    }
  };
};

module.exports = validate;
