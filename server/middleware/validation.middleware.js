// utils/validate.middleware.js
import { z } from 'zod';
import { createError } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';
import cacheService from '../services/cacheService.js';

const MAX_VALIDATION_ATTEMPTS = 10;
const BLOCK_DURATION_SECONDS = 60;

const validateWithSchema = (schema, dataSource, assignParsed) => async (req, res, next) => {
  const data = dataSource(req);
  const routePath = req.originalUrl || req.path;
  const ip = req.ip;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[validate middleware] ${dataSource.name} =`, data);
  }

  if (!data) {
    await LoggerService.logError('Validation failed: missing request data', null, {
      route: routePath,
      source: dataSource.name,
      ip,
    });
    return createError(res, 400, 'Request data is required', 'MISSING_REQUEST_DATA');
  }

  // Check if this IP is rate-limited for validation abuse
  const validationKey = `validation-attempts:${ip}:${routePath}`;
  try {
    const attempts = (await cacheService.get(validationKey)) || 0;
    if (attempts >= MAX_VALIDATION_ATTEMPTS) {
      await LoggerService.logError('Rate-limited validation attempt', null, {
        ip,
        route: routePath,
      });
      return createError(res, 429, 'Too many invalid requests', 'RATE_LIMITED', {
        suggestion: 'Please try again later',
      });
    }
  } catch (cacheError) {
    console.warn('Cache unavailable for validation middleware:', cacheError.message);
  }

  try {
    const parsed = schema.parse(data);
    // assign parsed values back (avoid mutating read-only getters like req.query in Express 5)
    assignParsed(req, parsed);
    next();
  } catch (error) {
    console.error(error);
    
    if (error instanceof z.ZodError) {
      const errors = Array.isArray(error.errors) ? error.errors : error.issues || [];
      const errorDetails = errors.map((err) => ({
        path: Array.isArray(err.path) ? err.path.join('.') : err.path || 'unknown',
        message: err.message || 'Invalid input',
      }));

      try {
        await cacheService.increment(validationKey, { EX: BLOCK_DURATION_SECONDS });
        await LoggerService.logAudit(null, 'VALIDATION_ERROR', null, {
          ip,
          route: routePath,
          source: dataSource.name,
          errors: errorDetails,
        });
      } catch (logErr) {
        console.error('Failed to log or cache validation error:', logErr.message);
      }

      return createError(res, 400, 'Validation error', 'ZOD_VALIDATION_ERROR', {
        errors: errorDetails||[]
      });
    }

    // Generic error fallback
    await LoggerService.logError('Unexpected validation middleware error', error.stack, {
      ip,
      route: routePath,
      message: error.message,
    });

    return createError(res, 500, 'Internal server error', 'VALIDATION_MIDDLEWARE_ERROR', {
      message: error?.message || 'Unknown error',
    });
  }
};

const setBody = (req, parsed) => { req.body = parsed; };
const setParams = (req, parsed) => { req.params = parsed; };
const setQuery = (req, parsed) => { req.validatedQuery = parsed; };

const validate = (schema) => validateWithSchema(schema, req => req.body, setBody);
export { validate };
export const validateParams = (schema) => validateWithSchema(schema, req => req.params, setParams);
export const validateQuery = (schema) => validateWithSchema(schema, req => req.query, setQuery);
export default validate;