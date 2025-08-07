export const createError = (res, status, message, type, details = {}) => {
  const response = {
    status: 'error',
    error: {
      type: type || 'UNKNOWN_ERROR',
      message: message || 'Internal server error',
      details: { ...details }, // Spread to ensure details is included
      code: status,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(status).json(response);
};

export const createResponse = (res, status, message, data = {}) => {
  return res.status(status).json({
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};