// utils/validate.middleware.js
import { z } from 'zod';
import { createError } from '../utils/response';
const validateWithSchema = (schema, dataSource) => (req, res, next) => {
  const data = dataSource(req);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[validate middleware] ${dataSource.name} =`, data);
  }
  if (!data) {
    return createError(res, 400, 'Request data is required', null, {});
  }
  try {
    schema.parse(data);
    next();
  } catch (error) {
    console.error(error.message);
    //testy
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return createError(res, 400, 'Validation error', null, errorDetails);
    }
    return createError(res, 500, 'Internal server error', "validate_Error", error.message);
  }
};

const validate = (schema) => validateWithSchema(schema, req => req.body);
export const validateParams = (schema) => validateWithSchema(schema, req => req.params);
export const validateQuery = (schema) => validateWithSchema(schema, req => req.query);
export default validate;