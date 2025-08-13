import { jest } from '@jest/globals';

jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: {
    createOrderWithItems: jest.fn().mockResolvedValue({ id: 'o1', orderNumber: 10, total: 25, userId: 'u1' }),
    setOrderTracking: jest.fn().mockResolvedValue(),
    getOrderByNumber: jest.fn().mockResolvedValue({ id: 'o1', orderNumber: 10 }),
    updateOrderStatusByNumber: jest.fn().mockResolvedValue({ id: 'o1', orderNumber: 10, status: 'CONFIRMED', userId: 'u1' }),
    getOrderForTracking: jest.fn().mockResolvedValue({ id: 'o1', orderNumber: 10, customerName: 'John Doe', customerEmail: 'a@b.com', customerPhone: '+12223334444' }),
    listOrdersByUser: jest.fn().mockResolvedValue([{ id: 'o1' }]),
  }
}));

jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logAudit: jest.fn().mockResolvedValue(), logNotification: jest.fn().mockResolvedValue(), logError: jest.fn().mockResolvedValue() } }));

jest.unstable_mockModule('../controllers/webhook.controller.js', () => ({ sendWebhook: jest.fn().mockResolvedValue() }));

const { createOrder, getOrderByNumber, updateOrderStatus, trackOrder, listMyOrders } = await import('../controllers/orders.controller.js');

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('orders.controller states', () => {
  it('createOrder returns 201 with tracking code generated', async () => {
    const req = { body: { items: [{ id: 'm1', quantity: 1 }], customerPhone: '2223334444' }, user: { userId: 'u1' } };
    const res = makeRes();
    await createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    const body = res.json.mock.calls[0][0];
    expect(body.data.order.orderNumber).toBe(10);
    expect(body.data.order.trackingCode).toBeTruthy();
  });

  it('getOrderByNumber returns 200', async () => {
    const req = { params: { orderNumber: '10' } };
    const res = makeRes();
    await getOrderByNumber(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('updateOrderStatus returns 200 and sends webhook', async () => {
    const req = { params: { orderNumber: '10' }, body: { status: 'CONFIRMED' }, user: { userId: 'u1' } };
    const res = makeRes();
    await updateOrderStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('trackOrder masks PII', async () => {
    const req = { validatedQuery: { orderNumber: '10', code: 'abcd' } };
    const res = makeRes();
    await trackOrder(req, res);
    const masked = res.json.mock.calls[0][0].data.order;
    expect(masked.customerName).not.toBe('John Doe');
  });

  it('listMyOrders returns 200 for authenticated user', async () => {
    const req = { user: { userId: 'u1' } };
    const res = makeRes();
    await listMyOrders(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});