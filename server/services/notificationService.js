import axios from 'axios';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import prisma from '../config/database.js';
import { LoggerService } from '../utils/logger.js';

async function getIntegrationConfig(name) {
  try {
    const integ = await prisma.integration.findFirst({ where: { name } });
    return integ?.config || null;
  } catch {
    return null;
  }
}

const providers = {
  EMAIL: async ({ target, content }) => {
    const cfg = await getIntegrationConfig('EMAIL_SMTP');
    if (!cfg) {
      console.log(`[EMAIL] to ${target}: ${content}`);
      return;
    }
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port || 587,
      secure: !!cfg.secure,
      auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined,
    });
    await transporter.sendMail({ from: cfg.from || cfg.user, to: target, subject: cfg.subject || 'Notification', text: content });
  },
  SMS: async ({ target, content }) => {
    const cfg = await getIntegrationConfig('TWILIO_SMS');
    if (!cfg) {
      console.log(`[SMS] to ${target}: ${content}`);
      return;
    }
    const client = twilio(cfg.accountSid, cfg.authToken);
    await client.messages.create({ from: cfg.from, to: target, body: content });
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