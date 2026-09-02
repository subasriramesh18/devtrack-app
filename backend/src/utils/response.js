/**
 * Helper utility for consistent API JSON responses
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200, meta = null) => {
  const responseBody = {
    success: true,
    message,
    data,
  };

  if (meta) {
    responseBody.meta = meta;
  }

  return res.status(statusCode).json(responseBody);
};

const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, 201);
};

const sendNoContent = (res) => {
  return res.status(204).send();
};

module.exports = {
  sendSuccess,
  sendCreated,
  sendNoContent,
};
