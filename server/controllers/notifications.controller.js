import { createResponse, createError } from '../utils/response.js';
import { dispatchNotification } from '../services/notificationService.js';

export const dispatch = async (req, res) => {
  try {
    const { type, target, content, provider } = req.body;
    const result = await dispatchNotification({ type, target, content, provider });
    if (!result.success) return createError(res, 502, 'Notification failed to send', 'NOTIFICATION_FAILED', { error: result.error });
    return createResponse(res, 200, 'Notification dispatched', {});
  } catch (error) {
    return createError(res, 500, 'Failed to dispatch notification', 'SERVER_ERROR');
  }
};

export default { dispatch };