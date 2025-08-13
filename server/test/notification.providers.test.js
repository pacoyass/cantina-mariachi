import { jest } from '@jest/globals';

let nodemailerTransportSend;
let twilioMessagesCreate;

jest.unstable_mockModule('../config/database.js', () => {
  const findFirst = jest.fn(async ({ where }) => {
    if (where?.name === 'EMAIL_SMTP') {
      return { config: { host: 'smtp.example.com', port: 587, secure: false, user: 'user', pass: 'pass', from: 'no-reply@example.com', subject: 'Notification' } };
    }
    if (where?.name === 'TWILIO_SMS') {
      return { config: { accountSid: 'AC123', authToken: 'tok', from: '+10000000000' } };
    }
    return null;
  });
  return { default: { integration: { findFirst } } };
});

jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: jest.fn(() => {
      nodemailerTransportSend = jest.fn().mockResolvedValue({});
      return { sendMail: nodemailerTransportSend };
    }),
  },
}));

jest.unstable_mockModule('twilio', () => ({
  default: jest.fn(() => {
    twilioMessagesCreate = jest.fn().mockResolvedValue({});
    return { messages: { create: twilioMessagesCreate } };
  }),
}));

const { dispatchNotification } = await import('../services/notificationService.js');

describe('notification providers', () => {
  it('sends EMAIL via nodemailer when Integration config exists', async () => {
    const res = await dispatchNotification({ type: 'EMAIL', target: 'to@example.com', content: 'Hello' });
    expect(res.success).toBe(true);
    expect(nodemailerTransportSend).toHaveBeenCalled();
    const args = nodemailerTransportSend.mock.calls[0][0];
    expect(args.to).toBe('to@example.com');
    expect(args.text).toBe('Hello');
  });

  it('sends SMS via twilio when Integration config exists', async () => {
    const res = await dispatchNotification({ type: 'SMS', target: '+12223334444', content: 'Hi' });
    expect(res.success).toBe(true);
    expect(twilioMessagesCreate).toHaveBeenCalled();
    const args = twilioMessagesCreate.mock.calls[0][0];
    expect(args.to).toBe('+12223334444');
    expect(args.body).toBe('Hi');
  });
});