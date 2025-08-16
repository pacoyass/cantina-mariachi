import { createResponse, createError } from '../utils/response.js';
import { databaseService } from '../services/databaseService.js';
import { LoggerService } from '../utils/logger.js';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import crypto from 'node:crypto';
import { normalizePhoneE164 } from '../utils/phone.js';

export const createReservation = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, date, time, partySize, notes } = req.body;
    const available = await databaseService.isReservationSlotAvailable(date, time, partySize);
    if (!available) return createError(res, 409, 'reservations.tableNotAvailable', 'SLOT_FULL', {}, req, {}, 'business');
    const created = await databaseService.createReservation({ customerName, customerEmail, customerPhone: normalizePhoneE164(customerPhone), date, time, partySize, notes: notes || null, status: 'PENDING', userId: req.user?.userId || null });
    await LoggerService.logAudit(req.user?.userId || null, 'RESERVATION_CREATED', created.id, { date: created.date, time: created.time, partySize: created.partySize });
    return createResponse(res, 201, 'reservations.reservationCreated', { reservation: created }, req, {}, 'business');
  } catch (error) {
    return createError(res, 400, 'operationFailed', 'RESERVATION_CREATE_FAILED', {}, req);
  }
};

export const listReservations = async (req, res) => {
  try {
    const { status, date } = req.validatedQuery || {};
    const reservations = await databaseService.listReservations({ status, date });
    return createResponse(res, 200, 'dataRetrieved', { reservations }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { date, time } = req.validatedQuery || {};
    const available = await databaseService.isReservationSlotAvailable(date, time || '', 1);
    return createResponse(res, 200, 'dataRetrieved', { available }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const updated = await databaseService.updateReservationStatus(req.params.id, req.body.status);
    return createResponse(res, 200, 'reservations.reservationUpdated', { reservation: updated }, req, {}, 'business');
  } catch (error) {
    return createError(res, 400, 'operationFailed', 'RESERVATION_UPDATE_FAILED', {}, req);
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const updated = await databaseService.updateReservationStatus(req.params.id, 'CANCELLED');
    return createResponse(res, 200, 'reservations.reservationCancelled', { reservation: updated }, req, {}, 'business');
  } catch (error) {
    return createError(res, 400, 'operationFailed', 'RESERVATION_CANCEL_FAILED', {}, req);
  }
};

export const cleanupOldReservations = async (retentionDays = 180) => {
  const taskName = 'reservations_cleanup';
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
        const deleted = await tx.reservation.deleteMany({ where: { date: { lt: cutoff }, status: { in: ['COMPLETED','CANCELLED'] } } });
        await LoggerService.logCronRun(taskName, 'SUCCESS', { deleted: deleted.count, cutoff: cutoff.toISOString(), timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'RESERVATIONS_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('Reservations cleanup failed', error.stack, { taskName, error: error.message, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, timestamp });
    throw error;
  }
};

export default { createReservation, listReservations, checkAvailability, updateReservationStatus, cancelReservation, cleanupOldReservations };