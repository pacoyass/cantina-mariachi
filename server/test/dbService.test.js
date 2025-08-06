// File: server/dbService.test.js
import { jest } from '@jest/globals';

// Mock the Prisma client with default export shape
await jest.unstable_mockModule('../config/database.js', () => ({
  default: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    orderItem: {
      createMany: jest.fn(),
    },
    cashTransaction: {
      create: jest.fn(),
      update: jest.fn(),
    },
    driver: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    category: { create: jest.fn() },
    menuItem: { create: jest.fn(), findMany: jest.fn() },
    cashSummary: { findFirst: jest.fn() },
    activityLog: { findMany: jest.fn() },
    systemLog: { findMany: jest.fn() },
    notificationLog: { findMany: jest.fn() },
    $transaction: jest.fn(),
    $disconnect: jest.fn(),
  },
}));

await jest.unstable_mockModule('../utils/logger.js', () => ({
  LoggerService: {
    logSystemEvent: jest.fn().mockResolvedValue(),
    logError: jest.fn().mockResolvedValue(),
    enqueueLog: jest.fn().mockResolvedValue(),
    flushQueue: jest.fn().mockResolvedValue(),
  },
}));

const prisma = (await import('../config/database.js')).default;
const databaseService = (await import('../services/databaseService.js')).default;
const { LoggerService } = await import('../utils/logger.js');

describe('DatabaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createUser should create a user', async () => {
    const data = { email: 'test@example.com', password: 'pass', role: 'CUSTOMER' };
    const user = { id: '1', ...data };
    prisma.user.create.mockResolvedValue(user);

    const result = await databaseService.createUser(data);
    expect(prisma.user.create).toHaveBeenCalledWith({ data });
    expect(LoggerService.logSystemEvent).toHaveBeenCalled();
    expect(result).toEqual(user);
  });

  test('getUserById should fetch user with relations', async () => {
    const user = { id: '1', email: 'a@b.com' };
    prisma.user.findUnique.mockResolvedValue(user);

    const result = await databaseService.getUserById('1');
    expect(result).toEqual(user);
    expect(prisma.user.findUnique).toHaveBeenCalled();
  });

  test('createOrder should create order and items in transaction', async () => {
    const order = { id: '1' };
    prisma.$transaction.mockImplementation(async (cb) => cb({
      order: { create: jest.fn().mockResolvedValue(order) },
      orderItem: { createMany: jest.fn() },
      cashTransaction: { create: jest.fn() },
    }));

    const result = await databaseService.createOrder({}, [{}], {});
    expect(result).toEqual(order);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  test('getOrderById should return order with relations', async () => {
    const order = { id: '1' };
    prisma.order.findUnique.mockResolvedValue(order);

    const result = await databaseService.getOrderById('1');
    expect(result).toEqual(order);
    expect(prisma.order.findUnique).toHaveBeenCalled();
  });

  test('updateOrderStatus should handle transaction', async () => {
    const order = { id: '1' };
    prisma.$transaction.mockImplementation(async (cb) => cb({
      order: { update: jest.fn().mockResolvedValue(order) },
      cashTransaction: { update: jest.fn() },
    }));

    const result = await databaseService.updateOrderStatus('1', 'PAID', {});
    expect(result).toEqual(order);
  });

  test('getAvailableMenuItems should fetch available', async () => {
    const items = [{ id: '1', name: 'Pizza' }];
    prisma.menuItem.findMany.mockResolvedValue(items);

    const result = await databaseService.getAvailableMenuItems();
    expect(result).toEqual(items);
  });

  test('createCashTransaction should validate totals', async () => {
    prisma.$transaction.mockImplementation(async (cb) => cb({
      order: { findUnique: jest.fn().mockResolvedValue({ id: '1', total: 20 }) },
      cashTransaction: { create: jest.fn().mockResolvedValue({ id: 'tx' }) },
    }));

    const result = await databaseService.createCashTransaction('1', { amount: 20 });
    expect(result).toHaveProperty('id', 'tx');
  });

  test('getDriverById should fetch driver with orders and cashTransactions', async () => {
    const driver = { id: 'd1', name: 'Driver' };
    prisma.driver.findUnique.mockResolvedValue(driver);

    const result = await databaseService.getDriverById('d1');
    expect(result).toEqual(driver);
  });

  test('getActivityLogs should fetch logs', async () => {
    const logs = [{ id: 'log1' }];
    prisma.activityLog.findMany.mockResolvedValue(logs);

    const result = await databaseService.getActivityLogs('VIEW', new Date('2025-01-01'), new Date('2025-01-02'));
    expect(result).toEqual(logs);
  });
  test('getUsersByRole should fetch active users by role', async () => {
    const users = [{ id: '1', role: 'CUSTOMER', isActive: true }];
    prisma.user.findMany.mockResolvedValue(users);
  
    const result = await databaseService.getUsersByRole('CUSTOMER');
    expect(result).toEqual(users);
    expect(prisma.user.findMany).toHaveBeenCalledWith({ where: { role: 'CUSTOMER', isActive: true } });
  });
  
  test('updateUser should update and return user', async () => {
    const updated = { id: '1', name: 'Updated' };
    prisma.user.update.mockResolvedValue(updated);
  
    const result = await databaseService.updateUser('1', { name: 'Updated' });
    expect(result).toEqual(updated);
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { name: 'Updated' } });
  });
  
  test('getOrdersByStatus should fetch orders with items and drivers', async () => {
    const orders = [{ id: '1', status: 'NEW' }];
    prisma.order.findMany.mockResolvedValue(orders);
  
    const result = await databaseService.getOrdersByStatus('NEW');
    expect(result).toEqual(orders);
    expect(prisma.order.findMany).toHaveBeenCalledWith({ where: { status: 'NEW' }, include: { orderItems: true, driver: true } });
  });
  
  test('createDriver should create a new driver', async () => {
    const driver = { id: '1', name: 'D1' };
    prisma.driver.create.mockResolvedValue(driver);
  
    const result = await databaseService.createDriver({ name: 'D1' });
    expect(result).toEqual(driver);
    expect(prisma.driver.create).toHaveBeenCalledWith({ data: { name: 'D1' } });
  });
  
  test('updateDriverStatus should update status', async () => {
    const driver = { id: '1', currentStatus: 'BUSY' };
    prisma.driver.update.mockResolvedValue(driver);
  
    const result = await databaseService.updateDriverStatus('1', 'BUSY');
    expect(result).toEqual(driver);
    expect(prisma.driver.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { currentStatus: 'BUSY' } });
  });
  
  test('getDriversByZone should return available drivers', async () => {
    const drivers = [{ id: '1', deliveryZone: 'ZONE1', active: true }];
    prisma.driver.findMany.mockResolvedValue(drivers);
  
    const result = await databaseService.getDriversByZone('ZONE1');
    expect(result).toEqual(drivers);
    expect(prisma.driver.findMany).toHaveBeenCalledWith({ where: { deliveryZone: 'ZONE1', active: true } });
  });
  
  test('createCategory should insert category and return it', async () => {
    const category = { id: 'cat1', name: 'Beverages' };
    prisma.category.create.mockResolvedValue(category);
  
    const result = await databaseService.createCategory({ name: 'Beverages' });
    expect(result).toEqual(category);
    expect(prisma.category.create).toHaveBeenCalledWith({ data: { name: 'Beverages' } });
  });
  
  test('createMenuItem should insert item with category included', async () => {
    const item = { id: '1', name: 'Burger', category: { id: 'cat1' } };
    prisma.menuItem.create.mockResolvedValue(item);
  
    const result = await databaseService.createMenuItem({ name: 'Burger', categoryId: 'cat1' });
    expect(result).toEqual(item);
    expect(prisma.menuItem.create).toHaveBeenCalledWith({ data: { name: 'Burger', categoryId: 'cat1' }, include: { category: true } });
  });
  
  test('getCashSummaryByDriver should fetch driver summary by date', async () => {
    const summary = { driverId: 'd1', total: 100 };
    prisma.cashSummary.findFirst.mockResolvedValue(summary);
  
    const result = await databaseService.getCashSummaryByDriver('d1', '2025-01-01');
    expect(result).toEqual(summary);
    expect(prisma.cashSummary.findFirst).toHaveBeenCalledWith({ where: { driverId: 'd1', date: '2025-01-01' } });
  });
  
  test('getNotificationLogs should fetch logs by status and date range', async () => {
    const logs = [{ id: '1' }];
    prisma.notificationLog.findMany.mockResolvedValue(logs);
  
    const result = await databaseService.getNotificationLogs('SENT', new Date('2025-01-01'), new Date('2025-01-03'));
    expect(result).toEqual(logs);
    expect(prisma.notificationLog.findMany).toHaveBeenCalledWith({
      where: {
        status: 'SENT',
        createdAt: { gte: new Date('2025-01-01'), lte: new Date('2025-01-03') }
      }
    });
  });
  
});
