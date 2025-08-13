import { jest } from '@jest/globals';
import axios from 'axios';
import { dispatchNotification } from '../services/notificationService.js';

jest.unstable_mockModule('axios', () => ({ default: { post: jest.fn() } }));

describe('notificationService', () => {
  it('dispatches webhook successfully', async () => {
    axios.post = jest.fn().mockResolvedValue({ status: 200 });
    const res = await dispatchNotification({ type: 'WEBHOOK', target: 'http://example.com', content: 'hello' });
    expect(res.success).toBe(true);
    expect(axios.post).toHaveBeenCalled();
  });

  it('retries and fails webhook', async () => {
    axios.post = jest.fn().mockRejectedValue(new Error('net'));
    const res = await dispatchNotification({ type: 'WEBHOOK', target: 'http://example.com', content: 'hello' });
    expect(res.success).toBe(false);
  });
});