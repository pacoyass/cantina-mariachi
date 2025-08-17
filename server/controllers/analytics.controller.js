import { createResponse, createError } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';

export const postEvent = async (req, res) => {
  try {
    const { event, props = {}, variant } = req.body || {};
    if (!event || typeof event !== 'string' || event.length > 64) {
      return createError(res, 400, 'validationError', 'INVALID_EVENT', {}, req);
    }
    const meta = { ip: req.ip, ua: req.headers['user-agent'] || null };
    await LoggerService.logSystemEvent('Analytics', 'EVENT', { event, props, variant, meta });
    return createResponse(res, 204, 'ok', {}, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export default { postEvent };