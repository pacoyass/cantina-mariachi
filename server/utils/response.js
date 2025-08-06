export const createResponse = (res, status, message, data = null) => {
    const response = {
      status: 'success',
      message,
      data: data || {},
      timestamp: new Date().toISOString()
    };
    return res.status(status).json(response);
  };
  
  export const createError = (res, status, message, errorType, details = null) => {
    const normalizedDetails = typeof details === 'object' && details !== null
      ? details
      : typeof details === 'string'
        ? { message: details }
        : {};
    
    const response = {
      status: 'error',
      error: {
        type: errorType || 'UNKNOWN_ERROR',
        message,
        details: normalizedDetails,
        code: status
      },
      timestamp: new Date().toISOString()
    };
    
    return res.status(status).json(response);
  };