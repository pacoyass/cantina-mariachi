import { createResponse, createError } from '../utils/response.js';
import { databaseService } from '../services/databaseService.js';
import { LoggerService } from '../utils/logger.js';
import crypto from 'node:crypto';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { toZonedTime } from 'date-fns-tz';
import { sendWebhook } from './webhook.controller.js';
import { normalizePhoneE164 } from '../utils/phone.js';

const mask = (s) => (typeof s === 'string' && s.length > 2 ? s[0] + '*'.repeat(Math.max(1, s.length - 2)) + s[s.length - 1] : s);
const TRACKING_TTL_HOURS = parseInt(process.env.ORDER_TRACKING_TTL_HOURS || '24', 10);

export const createOrder = async (req, res) => {
  try {
    const payload = { ...req.body, customerPhone: normalizePhoneE164(req.body.customerPhone), userId: req.user?.userId || null };
    const order = await databaseService.createOrderWithItems(payload);
    // generate tracking code (short-lived)
    const code = crypto.randomBytes(4).toString('hex');
    const expiresAt = new Date(Date.now() + TRACKING_TTL_HOURS * 60 * 60 * 1000);
    await databaseService.setOrderTracking(order.id, code, expiresAt);

    await LoggerService.logAudit(req.user?.userId || null, 'ORDER_CREATED', order.id, { orderNumber: order.orderNumber, total: order.total });
    return createResponse(res, 201, 'orderCreated', 
      { order: { ...order, trackingCode: code, trackingCodeExpiresAt: expiresAt } }, 
      req, {}, 'business:orders');
  } catch (error) {
    await LoggerService.logError('createOrder failed', error.stack, { error: error.message });
    return createError(res, 400, error.message || 'operationFailed', 'ORDER_CREATE_FAILED', {}, req);
  }
};

export const getOrderByNumber = async (req, res) => {
  try {
    const order = await databaseService.getOrderByNumber(req.params.orderNumber);
    if (!order) return createError(res, 404, 'orderNotFound', 'NOT_FOUND', {}, req, {}, 'business:orders');
    return createResponse(res, 200, 'dataRetrieved', { order }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const updated = await databaseService.updateOrderStatusByNumber(req.params.orderNumber, req.body.status);
    await LoggerService.logAudit(req.user?.userId || null, 'ORDER_STATUS_UPDATED', updated.id, { status: req.body.status, orderNumber: updated.orderNumber });
    await LoggerService.logNotification(updated.userId || null, 'WEBHOOK', 'order_status', `Order ${updated.orderNumber} -> ${updated.status}`, 'SENT');
    await sendWebhook('ORDER_STATUS_UPDATED', { orderNumber: updated.orderNumber, status: updated.status });
    return createResponse(res, 200, 'orderStatusUpdated', { order: updated }, req, {}, 'business:orders');
  } catch (error) {
    return createError(res, 400, error.message || 'operationFailed', 'ORDER_STATUS_FAILED', {}, req);
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { orderNumber, code } = req.validatedQuery || {};
    const order = await databaseService.getOrderForTracking(orderNumber, code);
    if (!order) return createError(res, 404, 'orderNotFound', 'NOT_FOUND', {}, req, {}, 'business:orders');
    // mask PII
    const masked = { ...order, customerName: mask(order.customerName), customerEmail: mask(order.customerEmail), customerPhone: mask(order.customerPhone) };
    return createResponse(res, 200, 'dataRetrieved', { order: masked }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const listMyOrders = async (req, res) => {
  try {
    if (!req.user?.userId) return createError(res, 401, 'unauthorized', 'UNAUTHORIZED', {}, req);
    const orders = await databaseService.listOrdersByUser(req.user.userId);
    return createResponse(res, 200, 'dataRetrieved', { orders }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const cleanupExpiredOrderTracking = async () => {
  const taskName = 'orders_tracking_cleanup';
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();
  try {
    await prisma.$transaction(async (tx) => {
      const locked = await acquireLock(tx, taskName, instanceId);
      if (!locked) {
        await LoggerService.logCronRun(taskName, 'SKIPPED', { reason: 'Lock held', timestamp });
        return;
      }
      try {
        const res = await tx.order.updateMany({
          where: { trackingCodeExpiresAt: { lt: new Date() }, trackingCode: { not: null } },
          data: { trackingCode: null, trackingCodeExpiresAt: null },
        });
        await LoggerService.logCronRun(taskName, 'SUCCESS', { cleared: res.count, timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'ORDERS_TRACKING_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('Orders tracking cleanup failed', error.stack, { taskName, error: error.message, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, timestamp });
    throw error;
  }
};

export default { createOrder, getOrderByNumber, updateOrderStatus, trackOrder, listMyOrders, cleanupExpiredOrderTracking };