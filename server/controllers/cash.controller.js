import { createResponse, createError } from '../utils/response.js';
import { databaseService } from '../services/databaseService.js';
import { LoggerService } from '../utils/logger.js';

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

export default { createCashTransaction, confirmCashTransaction, verifyCashTransaction, getDriverDailySummary };