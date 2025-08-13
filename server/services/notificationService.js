import axios from 'axios';
import { LoggerService } from '../utils/logger.js';

const providers = {
  EMAIL: async ({ target, content }) => {
    console.log(`[EMAIL] to ${target}: ${content}`);
  },
  SMS: async ({ target, content }) => {
    console.log(`[SMS] to ${target}: ${content}`);
  },
  PUSH: async ({ target, content }) => {
    console.log(`[PUSH] to ${target}: ${content}`);
  },
  WEBHOOK: async ({ target, content }) => {
    const payload = { content };
    let attempt = 0;
    let delay = 500;
    while (attempt < 3) {
      try {
        await axios.post(target, payload, { timeout: 5000 });
        return;
      } catch (e) {
        attempt += 1;
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
        if (attempt >= 3) throw e;
      }
    }
  },
};

export async function dispatchNotification({ type, target, content, provider }) {
  try {
    const fn = providers[type] || providers.WEBHOOK;
    await fn({ target, content, provider });
    await LoggerService.logNotification(null, type, target, content, 'SENT', provider || null, null);
    return { success: true };
  } catch (error) {
    await LoggerService.logNotification(null, type, target, content, 'FAILED', provider || null, error.message);
    return { success: false, error: error.message };
  }
}

export default { dispatchNotification };