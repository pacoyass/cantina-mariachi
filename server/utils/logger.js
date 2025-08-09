// import fs from "fs/promises";
// import path from "path";
// import { v4 as uuid } from 'uuid';
// import prisma from "../config/database.js";

// const logQueue = [];

// const logToFile = async (payload, model) => {
//   try {
//     const logPath = path.join("logs", `${model}.failures.log.json`);
//     await fs.mkdir("logs", { recursive: true });
//     const entry = JSON.stringify({ timestamp: new Date().toISOString(), ...payload }) + "\n";
//     await fs.appendFile(logPath, entry);
//   } catch (fileError) {
//     console.error(`Failed to write to ${model} log file:`, fileError.message);
//   }
// };

// export const LoggerService = {
//   async enqueueLog(model, data) {
//     try {
//       logQueue.push({ model, data: { id: uuid(), ...data } });
//       if (logQueue.length >= 100) await this.flushQueue();
//     } catch (error) {
//       await logToFile({ model, data, error: error.message || 'Unknown error' }, model);
//     }
//   },

//   async flushQueue() {
//     const logsByModel = {};
//     for (const { model, data } of logQueue) {
//       if (!logsByModel[model]) logsByModel[model] = [];
//       logsByModel[model].push(data);
//     }
//     logQueue.length = 0;

//     for (const model in logsByModel) {
//       try {
//         const entries = logsByModel[model];
//         if (entries.length > 1) {
//           await prisma[model].createMany({ data: entries, skipDuplicates: true });
//         } else {
//           await prisma[model].create({ data: entries[0] });
//         }
//       } catch (err) {
//         for (const data of logsByModel[model]) {
//           await logToFile({ model, data, error: err.message || 'Unknown error' }, model);
//         }
//       }
//     }
//   },

//   async logSystemEvent(source, event, metadata = {}) {
//     try {
//       if (!source || !event) {
//         await logToFile({ source, event, error: 'Missing required fields: source, event' }, 'systemLog');
//         throw new Error('Missing required fields for system event');
//       }
//       if (typeof source !== 'string' || typeof event !== 'string') {
//         await logToFile({ source, event, error: 'Invalid types: source and event must be strings' }, 'systemLog');
//         throw new Error('Invalid types for system event');
//       }
//       await this.enqueueLog("systemLog", {
//         source,
//         event,
//         message: `${event} triggered`,
//         metadata,
//       });
//     } catch (error) {
//       await logToFile({ source, event, metadata, error: error.message || 'Unknown error' }, 'systemLog');
//     }
//   },

//   async logError(message, stack = null, context = {}) {
//     try {
//       const errorMessage = typeof message === 'string' ? message : String(message || 'Unknown error');
//       const errorStack = typeof stack === 'string' ? stack : String(stack || 'No stack trace');
//       await this.enqueueLog("errorLog", {
//         message: errorMessage,
//         stack: errorStack,
//         context,
//       });
//     } catch (error) {
//       await logToFile({ message, stack, context, error: error.message || 'Unknown error' }, 'errorLog');
//     }
//   },

//   async logLogin(userId, status, ip = null, userAgent = null) {
//     try {
//       if (!status) {
//         await logToFile({ userId, status, ip, userAgent, error: 'Missing required field: status' }, 'loginLog');
//         throw new Error('Missing required field for login log');
//       }
//       if (!['SUCCESS', 'FAILURE'].includes(status)) {
//         await logToFile({ userId, status, ip, userAgent, error: 'Invalid status: must be SUCCESS or FAILURE' }, 'loginLog');
//         throw new Error('Invalid status for login log');
//       }
//       if (userId && typeof userId !== 'string') {
//         await logToFile({ userId, status, ip, userAgent, error: 'Invalid type: userId must be string' }, 'loginLog');
//         throw new Error('Invalid type for login log');
//       }
//       await this.enqueueLog("loginLog", {
//         userId,
//         status,
//         ip,
//         userAgent,
//       });
//     } catch (error) {
//       await logToFile({ userId, status, ip, userAgent, error: error.message || 'Unknown error' }, 'loginLog');
//     }
//   },

//   async logNotification(userId, type, target, content, status, provider = null, errorMessage = null) {
//     try {
//       if (!type || !target || !content || !status) {
//         await logToFile({ userId, type, target, content, status, provider, errorMessage, error: 'Missing required fields: type, target, content, status' }, 'notificationLog');
//         throw new Error('Missing required fields for notification log');
//       }
//       if (!['EMAIL', 'SMS', 'PUSH'].includes(type)) {
//         await logToFile({ userId, type, target, content, status, provider, errorMessage, error: 'Invalid type: must be EMAIL, SMS, or PUSH' }, 'notificationLog');
//         throw new Error('Invalid type for notification log');
//       }
//       if (!['SENT', 'FAILED', 'DELIVERED'].includes(status)) {
//         await logToFile({ userId, type, target, content, status, provider, errorMessage, error: 'Invalid status: must be SENT, FAILED, or DELIVERED' }, 'notificationLog');
//         throw new Error('Invalid status for notification log');
//       }
//       if (typeof target !== 'string' || typeof content !== 'string') {
//         await logToFile({ userId, type, target, content, status, provider, errorMessage, error: 'Invalid types: target and content must be strings' }, 'notificationLog');
//         throw new Error('Invalid types for notification log');
//       }
//       await this.enqueueLog("notificationLog", {
//         userId,
//         type,
//         target,
//         content,
//         status,
//         provider,
//         errorMessage,
//       });
//     } catch (error) {
//       await logToFile({ userId, type, target, content, status, provider, errorMessage, error: error.message || 'Unknown error' }, 'notificationLog');
//     }
//   },

//   async logActivity(userId, type, message, metadata = {}) {
//     try {
//       if (!type || !message) {
//         await logToFile({ userId, type, message, metadata, error: 'Missing required fields: type, message' }, 'activityLog');
//         throw new Error('Missing required fields for activity log');
//       }
//       if (typeof type !== 'string' || typeof message !== 'string') {
//         await logToFile({ userId, type, message, metadata, error: 'Invalid types: type and message must be strings' }, 'activityLog');
//         throw new Error('Invalid types for activity log');
//       }
//       await this.enqueueLog("activityLog", {
//         userId,
//         type,
//         message,
//         metadata,
//       });
//     } catch (error) {
//       await logToFile({ userId, type, message, metadata, error: error.message || 'Unknown error' }, 'activityLog');
//     }
//   },

//   async logAudit(userId, action, targetId, details = {}) {
//     try {
//       if (!action) {
//         await logToFile({ userId, action, targetId, details, error: 'Missing required field: action' }, 'auditLog');
//         throw new Error('Missing required field for audit log');
//       }
//       if (typeof action !== 'string') {
//         await logToFile({ userId, action, targetId, details, error: 'Invalid type: action must be string' }, 'auditLog');
//         throw new Error('Invalid type for audit log');
//       }
//       await this.enqueueLog("auditLog", {
//         userId,
//         action,
//         targetId,
//         details,
//       });
//     } catch (error) {
//       await logToFile({ userId, action, targetId, details, error: error.message || 'Unknown error' }, 'auditLog');
//     }
//   },

//   async logCronLock(taskName, instanceId) {
//     try {
//       if (!taskName || !instanceId) {
//         await logToFile({ taskName, instanceId, error: 'Missing required fields: taskName, instanceId' }, 'cronLock');
//         throw new Error('Missing required fields for cron lock');
//       }
//       if (typeof taskName !== 'string' || typeof instanceId !== 'string') {
//         await logToFile({ taskName, instanceId, error: 'Invalid types: taskName and instanceId must be strings' }, 'cronLock');
//         throw new Error('Invalid types for cron lock');
//       }
//       await this.enqueueLog("cronLock", {
//         taskName,
//         instanceId,
//         lockedAt: new Date(),
//       });
//     } catch (error) {
//       await logToFile({ taskName, instanceId, error: error.message || 'Unknown error' }, 'cronLock');
//     }
//   },

//   async logCronRun(taskName, status, details = {}) {
//     try {
//       if (!taskName || !status) {
//         await logToFile({ taskName, status, details, error: 'Missing required fields: taskName, status' }, 'cronRun');
//         throw new Error('Missing required fields for cron run');
//       }
//       if (typeof taskName !== 'string' || typeof status !== 'string') {
//         await logToFile({ taskName, status, details, error: 'Invalid types: taskName and status must be strings' }, 'cronRun');
//         throw new Error('Invalid types for cron run');
//       }
//       await this.enqueueLog("cronRun", {
//         taskName,
//         status,
//         details,
//         lastRunAt: new Date(),
//       });
//     } catch (error) {
//       await logToFile({ taskName, status, details, error: error.message || 'Unknown error' }, 'cronRun');
//     }
//   },

//   async logCashTransaction(orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes) {
//     try {
//       if (!orderId || !driverId || amount === undefined || confirmed === undefined || adminVerified === undefined) {
//         await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: 'Missing required fields: orderId, driverId, amount, confirmed, adminVerified' }, 'cashTransaction');
//         throw new Error('Missing required fields for cash transaction');
//       }
//       if (typeof orderId !== 'string' || typeof driverId !== 'string') {
//         await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: 'Invalid types: orderId and driverId must be strings' }, 'cashTransaction');
//         throw new Error('Invalid types for cash transaction');
//       }
//       if (typeof amount !== 'number' || amount < 0) {
//         await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: 'Invalid amount: must be a non-negative number' }, 'cashTransaction');
//         throw new Error('Invalid amount for cash transaction');
//       }
//       if (typeof confirmed !== 'boolean' || typeof adminVerified !== 'boolean') {
//         await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: 'Invalid types: confirmed and adminVerified must be booleans' }, 'cashTransaction');
//         throw new Error('Invalid types for cash transaction');
//       }
//       if (discrepancyAmount !== null && (typeof discrepancyAmount !== 'number' || discrepancyAmount < 0)) {
//         await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: 'Invalid discrepancyAmount: must be a non-negative number or null' }, 'cashTransaction');
//         throw new Error('Invalid discrepancyAmount for cash transaction');
//       }
//       await this.enqueueLog("cashTransaction", {
//         orderId,
//         driverId,
//         amount,
//         confirmed,
//         adminVerified,
//         discrepancyAmount,
//         customerNotes,
//         discrepancyNotes,
//         paymentTimestamp: new Date(),
//       });
//     } catch (error) {
//       await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: error.message || 'Unknown error' }, 'cashTransaction');
//     }
//   },
// };






// server/utils/logger.js

import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from 'uuid';
import prisma from "../config/database.js";


const logQueue = [];

const logToFile = async (payload, model) => {
  const logPath = path.join("logs", `${model}.failures.log.json`);
  await fs.mkdir("logs", { recursive: true });
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), ...payload }) + "\n";
  await fs.appendFile(logPath, entry);
};

export const LoggerService = {
  async enqueueLog(model, data) {
    logQueue.push({ model, data: { id: uuid(), ...data } });
    if (logQueue.length >= 100) await this.flushQueue();
  },

  async flushQueue() {
    const logsByModel = {};
    for (const { model, data } of logQueue) {
      if (!logsByModel[model]) logsByModel[model] = [];
      logsByModel[model].push(data);
    }
    logQueue.length = 0;

    for (const model in logsByModel) {
      try {
        const entries = logsByModel[model];
        if (entries.length > 1) {
          await prisma[model].createMany({ data: entries, skipDuplicates: true });
        } else {
          await prisma[model].create({ data: entries[0] });
        }
      } catch (err) {
        for (const data of logsByModel[model]) {
          await logToFile({ model, data, error: err.message }, model);
        }
      }
    }
  },

  async logSystemEvent(source, event, metadata = {}) {
    if (!source || !event) {
      await logToFile({ source, event, error: 'Missing required fields: source, event' }, 'systemLog');
      throw new Error('Missing required fields for system event');
    }
    if (typeof source !== 'string' || typeof event !== 'string') {
      await logToFile({ source, event, error: 'Invalid types: source and event must be strings' }, 'systemLog');
      throw new Error('Invalid types for system event');
    }
    await this.enqueueLog("systemLog", {
      source,
      event,
      message: `${event} triggered`,
      metadata,
    });
  },

  async logError(message, stack = null, context = {}) {
    if (!message) {
      await logToFile({ message, stack, context, error: 'Missing required field: message' }, 'errorLog');
      throw new Error('Missing required field for error log');
    }
    if (typeof message !== 'string') {
      await logToFile({ message, stack, context, error: 'Invalid type: message must be string' }, 'errorLog');
      throw new Error('Invalid type for error log');
    }
    await this.enqueueLog("errorLog", {
      message,
      stack,
      context,
    });
  },

  async logLogin(userId, status, ip = null, userAgent = null) {
    if (!status) {
      await logToFile({ userId, status, ip, userAgent, error: 'Missing required field: status' }, 'loginLog');
      throw new Error('Missing required field for login log');
    }
    if (!['SUCCESS', 'FAILURE'].includes(status)) {
      await logToFile({ userId, status, ip, userAgent, error: 'Invalid status: must be SUCCESS or FAILURE' }, 'loginLog');
      throw new Error('Invalid status for login log');
    }
    if (userId && typeof userId !== 'string') {
      await logToFile({ userId, status, ip, userAgent, error: 'Invalid type: userId must be string' }, 'loginLog');
      throw new Error('Invalid type for login log');
    }
    await this.enqueueLog("loginLog", {
      userId,
      status,
      ip,
      userAgent,
    });
  },

  async logNotification(userId, type, target, content, status, provider = null, errorMessage = null) {
    if (!type || !target || !content || !status) {
      await logToFile({ userId, type, target, content, status, provider, errorMessage, error: 'Missing required fields: type, target, content, status' }, 'notificationLog');
      throw new Error('Missing required fields for notification log');
    }
    if (!['EMAIL', 'SMS', 'PUSH','WEBHOOK'].includes(type)) {
      await logToFile({ userId, type, target, content, status, provider, errorMessage, error: 'Invalid type: must be EMAIL, SMS, or PUSH' }, 'notificationLog');
      throw new Error('Invalid type for notification log');
    }
    if (!['SENT', 'FAILED', 'DELIVERED'].includes(status)) {
      await logToFile({ userId, type, target, content, status, provider, errorMessage, error: 'Invalid status: must be SENT, FAILED, or DELIVERED' }, 'notificationLog');
      throw new Error('Invalid status for notification log');
    }
    if (typeof target !== 'string' || typeof content !== 'string') {
      await logToFile({ userId, type, target, content, status, provider, errorMessage, error: 'Invalid types: target and content must be strings' }, 'notificationLog');
      throw new Error('Invalid types for notification log');
    }
    await this.enqueueLog("notificationLog", {
      userId,
      type,
      target,
      content,
      status,
      provider,
      errorMessage,
    });
  },

  async logActivity(userId, type, message, metadata = {}) {
    if (!type || !message) {
      await logToFile({ userId, type, message, metadata, error: 'Missing required fields: type, message' }, 'activityLog');
      throw new Error('Missing required fields for activity log');
    }
    if (typeof type !== 'string' || typeof message !== 'string') {
      await logToFile({ userId, type, message, metadata, error: 'Invalid types: type and message must be strings' }, 'activityLog');
      throw new Error('Invalid types for activity log');
    }
    await this.enqueueLog("activityLog", {
      userId,
      type,
      message,
      metadata,
    });
  },

  async logAudit(userId, action, targetId, details = {}) {
    if (!action) {
      await logToFile({ userId, action, targetId, details, error: 'Missing required field: action' }, 'auditLog');
      throw new Error('Missing required field for audit log');
    }
    if (typeof action !== 'string') {
      await logToFile({ userId, action, targetId, details, error: 'Invalid type: action must be string' }, 'auditLog');
      throw new Error('Invalid type for audit log');
    }
    await this.enqueueLog("auditLog", {
      userId,
      action,
      targetId,
      details,
    });
  },

  async logCronLock(taskName, instanceId) {
    if (!taskName || !instanceId) {
      await logToFile({ taskName, instanceId, error: 'Missing required fields: taskName, instanceId' }, 'cronLock');
      throw new Error('Missing required fields for cron lock');
    }
    if (typeof taskName !== 'string' || typeof instanceId !== 'string') {
      await logToFile({ taskName, instanceId, error: 'Invalid types: taskName and instanceId must be strings' }, 'cronLock');
      throw new Error('Invalid types for cron lock');
    }
    await this.enqueueLog("cronLock", {
      taskName,
      instanceId,
      lockedAt: new Date(),
    });
  },

  async logCronRun(taskName, status, details = {}) {
    if (!taskName || !status) {
      await logToFile({ taskName, status, details, error: 'Missing required fields: taskName, status' }, 'cronRun');
      throw new Error('Missing required fields for cron run');
    }
    if (typeof taskName !== 'string' || typeof status !== 'string') {
      await logToFile({ taskName, status, details, error: 'Invalid types: taskName and status must be strings' }, 'cronRun');
      throw new Error('Invalid types for cron run');
    }
    await this.enqueueLog("cronRun", {
      taskName,
      status,
      details,
      lastRunAt: new Date(),
    });
  },

  async logCashTransaction(orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes) {
    if (!orderId || !driverId || amount === undefined || confirmed === undefined || adminVerified === undefined) {
      await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: 'Missing required fields: orderId, driverId, amount, confirmed, adminVerified' }, 'cashTransaction');
      throw new Error('Missing required fields for cash transaction');
    }
    if (typeof orderId !== 'string' || typeof driverId !== 'string') {
      await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: 'Invalid types: orderId and driverId must be strings' }, 'cashTransaction');
      throw new Error('Invalid types for cash transaction');
    }
    if (typeof amount !== 'number' || amount < 0) {
      await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: 'Invalid amount: must be a non-negative number' }, 'cashTransaction');
      throw new Error('Invalid amount for cash transaction');
    }
    if (typeof confirmed !== 'boolean' || typeof adminVerified !== 'boolean') {
      await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: 'Invalid types: confirmed and adminVerified must be booleans' }, 'cashTransaction');
      throw new Error('Invalid types for cash transaction');
    }
    if (discrepancyAmount !== null && (typeof discrepancyAmount !== 'number' || discrepancyAmount < 0)) {
      await logToFile({ orderId, driverId, amount, confirmed, adminVerified, discrepancyAmount, customerNotes, discrepancyNotes, error: 'Invalid discrepancyAmount: must be a non-negative number or null' }, 'cashTransaction');
      throw new Error('Invalid discrepancyAmount for cash transaction');
    }
    await this.enqueueLog("cashTransaction", {
      orderId,
      driverId,
      amount,
      confirmed,
      adminVerified,
      discrepancyAmount,
      customerNotes,
      discrepancyNotes,
      paymentTimestamp: new Date(),
    });
  },

  async logFailedWebhook(webhook, event, payload, errorMessage, attempts) {
    console.error(`[FAILED WEBHOOK] ID: ${webhook.id} URL: ${webhook.url}`, {
      event,
      payload,
      error: errorMessage,
      attempts,
    });
    // Optionally save to DB here if you want permanent history
  },
};
