import { createResponse, createError } from '../utils/response.js';
import { databaseService } from '../services/databaseService.js';
import { LoggerService } from '../utils/logger.js';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import crypto from 'node:crypto';

export const createCashTransaction = async (req, res) => {
  try {
    const { orderNumber, driverId, amount, customerNotes } = req.body;
    const created = await databaseService.createCashTransactionForOrder(orderNumber, driverId, amount, { customerNotes });
    await LoggerService.logAudit(req.user?.userId || null, 'CASH_TX_CREATED', created.id, { orderNumber, driverId, amount });
    return createResponse(res, 201, 'Cash transaction created', { transaction: created });
  } catch (error) {
    return createError(res, 400, error.message || 'Failed to create cash transaction', 'CASH_CREATE_FAILED');
  }
};

export const confirmCashTransaction = async (req, res) => {
  try {
    const { orderNumber, paymentTimestamp } = req.body;
    const updated = await databaseService.confirmCashTransaction(orderNumber, paymentTimestamp ? new Date(paymentTimestamp) : undefined);
    await LoggerService.logAudit(req.user?.userId || null, 'CASH_TX_CONFIRMED', updated.id, { orderNumber });
    return createResponse(res, 200, 'Cash transaction confirmed', { transaction: updated });
  } catch (error) {
    return createError(res, 400, error.message || 'Failed to confirm cash transaction', 'CASH_CONFIRM_FAILED');
  }
};

export const verifyCashTransaction = async (req, res) => {
  try {
    const { orderNumber, adminVerified, discrepancyAmount, discrepancyNotes } = req.body;
    const updated = await databaseService.verifyCashTransaction(orderNumber, adminVerified, { amount: discrepancyAmount, notes: discrepancyNotes });
    await LoggerService.logAudit(req.user?.userId || null, 'CASH_TX_VERIFIED', updated.id, { orderNumber, adminVerified });
    return createResponse(res, 200, 'Cash transaction verified', { transaction: updated });
  } catch (error) {
    return createError(res, 400, error.message || 'Failed to verify cash transaction', 'CASH_VERIFY_FAILED');
  }
};

export const getDriverDailySummary = async (req, res) => {
  try {
    const date = req.validatedQuery?.date || new Date();
    const driverId = req.validatedQuery?.driverId || req.params.id;
    const summary = await databaseService.getCashSummaryByDriverAndDate(driverId, date);
    return createResponse(res, 200, 'Cash summary fetched', { summary });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch cash summary', 'SERVER_ERROR');
  }
};

export const cleanupCashData = async (retentionDays = 365) => {
  const taskName = 'cash_cleanup';
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
        const cutoff = subDays(new Date(), retentionDays);
        const deletedSummaries = await tx.cashSummary.deleteMany({ where: { date: { lt: cutoff } } });
        const deletedTransactions = await tx.cashTransaction.deleteMany({
          where: {
            updatedAt: { lt: cutoff },
            confirmed: true,
            adminVerified: true,
          },
        });
        await LoggerService.logCronRun(taskName, 'SUCCESS', { deletedSummaries: deletedSummaries.count, deletedTransactions: deletedTransactions.count, cutoff: cutoff.toISOString(), timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'CASH_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('Cash cleanup failed', error.stack, { taskName, error: error.message, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, timestamp });
    throw error;
  }
};

export default { createCashTransaction, confirmCashTransaction, verifyCashTransaction, getDriverDailySummary, cleanupCashData };