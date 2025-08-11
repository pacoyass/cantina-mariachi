import { generateToken, hashToken, verifyToken } from '../services/authService.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import {createError,createResponse}  from '../utils/response.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../config/database.js';
import { LoggerService } from '../utils/logger.js';
import cacheService from '../services/cacheService.js';
import { databaseService } from '../services/databaseService.js';
import { sendWebhook } from './webhook.controller.js';

// Cleanup expired authentication data (refresh tokens, blacklisted tokens)
export const cleanupExpiredAuthData = async () => {
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  let totalDeleted = 0;
  let errors = [];

  try {
    await prisma.$transaction(async (tx) => {
      await LoggerService.logSystemEvent('auth_cleanup', 'ATTEMPT_CLEANUP', { instanceId, timestamp: toZonedTime(new Date(), 'Europe/London').toISOString() });
      const locked = await acquireLock(tx, 'auth_cleanup', instanceId);
      if (!locked) {
        await LoggerService.logAudit(null, 'AUTH_CLEANUP_SKIPPED', null, { reason: 'Lock acquisition failed', instanceId });
        await LoggerService.logCronRun('auth_cleanup', 'SKIPPED', { reason: 'Lock acquisition failed', instanceId });
        return;
      }

      try {
        const cutoffDate = toZonedTime(subDays(new Date(), 30), 'Europe/London');
        const deletedRefreshTokens = await tx.refreshToken.deleteMany({ where: { expiresAt: { lt: cutoffDate } } });
        const deletedBlacklistedTokens = await tx.blacklistedToken.deleteMany({ where: { expiresAt: { lt: cutoffDate } } });
        totalDeleted = deletedRefreshTokens.count + deletedBlacklistedTokens.count;

        if (totalDeleted === 0) {
          await LoggerService.logAudit(null, 'AUTH_CLEANUP_SUCCESS', null, {
            deletedCount: 0,
            reason: 'No authentication data to delete',
            instanceId,
            timestamp: cutoffDate.toISOString(),
          });
          await LoggerService.logNotification(null, 'WEBHOOK', 'auth_cleanup', 'No authentication data deleted', 'SENT');
          await sendWebhook('AUTH_CLEANUP_SUCCESS', {
            deletedCount: 0,
            reason: 'No authentication data to delete',
            instanceId,
            timestamp: cutoffDate.toISOString(),
          });
          await LoggerService.logCronRun('auth_cleanup', 'SUCCESS', {
            totalDeleted: 0,
            errorCount: 0,
            instanceId,
            cutoffDate: cutoffDate.toISOString(),
            deletedRefreshTokens: 0,
            deletedBlacklistedTokens: 0,
          });
          return;
        }

        await LoggerService.logAudit(null, 'AUTH_CLEANUP_SUCCESS', null, {
          deletedCount: totalDeleted,
          deletedRefreshTokens: deletedRefreshTokens.count,
          deletedBlacklistedTokens: deletedBlacklistedTokens.count,
          instanceId,
          timestamp: cutoffDate.toISOString(),
        });
        await LoggerService.logNotification(null, 'WEBHOOK', 'auth_cleanup', `Deleted ${totalDeleted} auth records`, 'SENT');
        await sendWebhook('AUTH_CLEANUP_SUCCESS', {
          deletedCount: totalDeleted,
          deletedRefreshTokens: deletedRefreshTokens.count,
          deletedBlacklistedTokens: deletedBlacklistedTokens.count,
          instanceId,
          timestamp: cutoffDate.toISOString(),
        });
        await LoggerService.logCronRun('auth_cleanup', 'SUCCESS', {
          totalDeleted,
          errorCount: 0,
          instanceId,
          cutoffDate: cutoffDate.toISOString(),
          deletedRefreshTokens: deletedRefreshTokens.count,
          deletedBlacklistedTokens: deletedBlacklistedTokens.count,
        });
      } catch (error) {
        errors.push({ error: { type: 'CLEANUP_ERROR', message: error.message, stack: error.stack } });
        await LoggerService.logError('Auth cleanup failed', error.stack, { instanceId, error: error.message });
        await LoggerService.logCronRun('auth_cleanup', 'FAILED', { error: error.message, instanceId, errors: errors.length });
      } finally {
        await releaseLock(tx, 'auth_cleanup');
        await LoggerService.logAudit(null, 'AUTH_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp: toZonedTime(new Date(), 'Europe/London').toISOString() });
      }
    });
  } catch (error) {
    await LoggerService.logError('Auth cleanup failed', error.stack, { instanceId, error: error.message });
    await LoggerService.logAudit(null, 'AUTH_CLEANUP_FAILED', null, { reason: error.message, instanceId });
    await LoggerService.logNotification(null, 'WEBHOOK', 'auth_cleanup_failed', error.message, 'FAILED');
    await sendWebhook('AUTH_CLEANUP_FAILED', { reason: error.message, instanceId, timestamp: toZonedTime(new Date(), 'Europe/London').toISOString() });
    await LoggerService.logCronRun('auth_cleanup', 'FAILED', { error: error.message, instanceId, errors: errors.length });
  }
};

// POST /api/auth/register - User registration
export const register = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password || !req.body.name) {
      return createError(res, 400, 'Please provide email, password, and name', 'INVALID_INPUT', {
        fields: ['email', 'password', 'name'],
      });
    }
    const { email, password, role, name, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10));
    const user = await databaseService.createUser({email, password: hashedPassword, role, name, phone });
    
    await LoggerService.logAudit(user.id, 'USER_REGISTERED', user.id, { email, role, name, phone });
    await LoggerService.logNotification(user.id, 'WEBHOOK', 'user_registered', `User ${email} registered`, 'SENT');
    await sendWebhook('USER_REGISTERED', { userId: user.id, email, role, name, phone });
    return createResponse(res, 201, 'User registered successfully', { data:user });
  } catch (error) {
    console.error(error);
    
    await LoggerService.logError('Registration failed', error.stack, { email: req.body.email });
    await LoggerService.logAudit(null, 'USER_REGISTER_FAILED', null, { reason: error.message, email: req.body.email });
    return createError(
      res,
      error.code === 'P2002' || error.message.includes('already exists') ? 409 : 500,
      error.message,
      error.code === 'P2002' || error.message.includes('already exists') ? 'CONFLICT' : 'REGISTRATION_ERROR',
      error.code === 'P2002' || error.message.includes('already exists')
        ? { field: 'email', suggestion: 'Try logging in or use a different email' }
        : {}
    );
  }
};

// POST /api/auth/login - User login
export const login = async (req, res) => {
  
  const { email, password } = req.body || {};
  const ip = req.ip;
  const userAgent = req.get('User-Agent') || 'Unknown';


  if (!email || !password) {
    await LoggerService.logLogin(null, 'FAILURE', ip, userAgent);
    return createError(res, 400, 'Email and password are required', 'BAD_REQUEST');
  }

  // Check rate-limiting
  let attempts = 0;
  try {
    attempts = (await cacheService.get(`login-attempts:${email}`)) || 0;
    if (attempts >= 5) {
      await LoggerService.logLogin(null, 'FAILURE', ip, userAgent);
      return createError(res, 429, 'Too many login attempts', 'RATE_LIMIT_EXCEEDED', {
        suggestion: 'Try again in a minute',
      });
    }
  } catch (cacheErr) {
    await LoggerService.logError('Cache error during login attempt tracking', cacheErr.stack, { email, error: cacheErr.message });
    console.warn('Cache service unavailable, skipping rate-limiting');
  }

  // Fetch user
  let user;
  try {
    user = await databaseService.getUserByEmail(email, { isActive: true });
  } catch (err) {
    await cacheService.increment(`login-attempts:${email}`, { EX: 60 });
    await LoggerService.logLogin(null, 'FAILURE', ip, userAgent);
    return createError(res, 401, 'Invalid email or password', 'UNAUTHORIZED', {
      message: err.message === 'User not found' ? 'User not found' : 'Database error',
      suggestion: 'Check your credentials or register',
    });
  }

  // Verify password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    await cacheService.increment(`login-attempts:${email}`, { EX: 60 });
    await LoggerService.logLogin(null, 'FAILURE', ip, userAgent);
    return createError(res, 401, 'Invalid email or password', 'UNAUTHORIZED', {
      suggestion: 'Check your credentials or register',
    });
  }

  // Generate tokens
  let accessToken, refreshToken, refreshExp;
  try {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      active: user.isActive,
      phone: user.phone,
    };
    ({ token: accessToken } = await generateToken(payload, process.env.TOKEN_EXPIRATION || '15m'));
    ({ token: refreshToken, exp: refreshExp } = await generateToken(payload, process.env.REFRESH_TOKEN_EXPIRATION || '7d'));
    const hashedRefreshToken = await hashToken(refreshToken);
    await databaseService.refreshUserTokens(user.id, hashedRefreshToken, new Date(refreshExp));
  } catch (authErr) {
    await LoggerService.logError('Token generation/storage failed', authErr.stack, { email, error: authErr.message });
    return createError(res, 500, 'Failed to generate tokens', 'AUTH_ERROR');
  }

  // Set cookies
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/',
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  // Sanitize name for response
  const sanitizedName = user.name ? user.name.replace(/[<>]/g, '') : null;

  // Generate dynamic welcome message
  const getGreetingMessage = (name) => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const firstName = name ? name.split(' ')[0].charAt(0).toUpperCase() + name.split(' ')[0].slice(1).toLowerCase() : 'User';
    const funMessages = [
      'Great to see you again! 💫',
      'Access granted! 🎉',
      "You're in! Let's go! 🚀",
      'Authentication successful! 🥳',
      'Ready to roll! 🌟',
      `Welcome back, ${firstName}! 🌟`,
      `Hello, ${firstName}! Let's go! 🚀`,
      `${timeGreeting}, ${firstName}! 🌟`,
    ];
    let lastMessageIndex = -1;
    return () => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * funMessages.length);
      } while (randomIndex === lastMessageIndex);
      lastMessageIndex = randomIndex;
      return funMessages[randomIndex];
    };
  };

  const generateLoginMessage = getGreetingMessage(sanitizedName);

  // Log success and reset attempts
  await cacheService.set(`login-attempts:${email}`, 0);
  await LoggerService.logLogin(user.id, 'SUCCESS', ip, userAgent);
  await LoggerService.logAudit(user.id, 'USER_LOGIN', user.id, { email, role: user.role, phone: user.phone });
  await LoggerService.logNotification(user.id, 'WEBHOOK', 'user_login', `User ${email} logged in`, 'SENT');
  await sendWebhook('USER_LOGIN', { userId: user.id, email, role: user.role, phone: user.phone, loginTime: new Date().toISOString() });

  return createResponse(res, 200, generateLoginMessage(), {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: sanitizedName,
      phone: user.phone,
    },
  });
};
// export const login = async (req, res) => {
//   console.debug('Login request received:', { email: req.body.email, ip: req.ip, userAgent: req.get('User-Agent') });
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       try {
//         await LoggerService.logLogin(null, 'FAILURE', req.ip, req.get('User-Agent'));
//       } catch (logError) {
//         console.error('Failed to log invalid input:', logError.message);
//       }
//       return createError(res, 400, 'Email and password are required', 'BAD_REQUEST');
//     }

//     // Check rate-limiting
//     let attempts = 0;
//     try {
//       attempts = (await cacheService.get(`login-attempts:${email}`)) || 0;
//       if (attempts >= 5) {
//         try {
//           await LoggerService.logLogin(null, 'FAILURE', req.ip, req.get('User-Agent'));
//         } catch (logError) {
//           console.error('Failed to log rate-limit failure:', logError.message);
//         }
//         return createError(res, 429, 'Too many login attempts', 'RATE_LIMIT_EXCEEDED', { suggestion: 'Try again in a minute' });
//       }
//     } catch (cacheError) {
//       const errorMessage = typeof cacheError === 'string' ? cacheError : cacheError.message || cacheError.code || 'Unknown cache error';
//       const errorStack = cacheError.stack || 'No stack trace';
//       try {
//         await LoggerService.logError('Cache service error', errorStack, { email, error: errorMessage, errorCode: cacheError.code || null });
//       } catch (logError) {
//         console.error('Cache error details:', cacheError);
//         console.error('Failed to log cache error:', logError.message);
//       }
//       console.warn('Cache service unavailable, skipping rate-limiting');
//     }

//     // Fetch user
//     let user;
//     try {
//       user = await databaseService.getUserByEmail(email, { isActive: true });
//       console.log("test",user);
      
//     } catch (dbError) {
//       console.error("db",dbError);
      
//       const errorMessage = typeof dbError === 'string' ? dbError : dbError.message || dbError.code || 'Unknown database error';
//       const errorStack = dbError.stack || 'No stack trace';
//       try {
//         await LoggerService.logError('Database error during user lookup', errorStack, { email, error: errorMessage, errorCode: dbError.code || null });
//       } catch (logError) {
//         console.error('Database error details:', dbError);
//         console.error('Failed to log database error:', logError.message);
//       }
//       if (errorMessage === 'User not found') {
//         try {
//           await cacheService.increment(`login-attempts:${email}`, { EX: 60 });
//           await LoggerService.logLogin(null, 'FAILURE', req.ip, req.get('User-Agent'));
//         } catch (error) {
//           console.error('Failed to log user not found:', error.message);
//         }
//         return createError(res, 401, 'Invalid email or password', 'UNAUTHORIZED', { message: 'User not found', suggestion: 'Check your credentials or register' });
//       }
//       return createError(res, 500, 'Failed to access database', 'DATABASE_ERROR', { message: errorMessage, errorCode: dbError.code || null });
//     }

//     if (!(await bcrypt.compare(password, user.password))) {
//       try {
//         await cacheService.increment(`login-attempts:${email}`, { EX: 60 });
//       } catch (cacheError) {
//         const errorMessage = typeof cacheError === 'string' ? cacheError : cacheError.message || cacheError.code || 'Unknown cache error';
//         const errorStack = cacheError.stack || 'No stack trace';
//         try {
//           await LoggerService.logError('Failed to increment login attempts', errorStack, { email, error: errorMessage, errorCode: cacheError.code || null });
//         } catch (logError) {
//           console.error('Failed to log cache error:', logError.message);
//         }
//       }
//       try {
//         await LoggerService.logLogin(null, 'FAILURE', req.ip, req.get('User-Agent'));
//       } catch (logError) {
//         console.error('Failed to log login failure:', logError.message);
//       }
//       return createError(res, 401, 'Invalid email or password', 'UNAUTHORIZED', { suggestion: 'Check your credentials or register' });
//     }
//     const sanitizedName = user.name ? user.name.replace(/[<>]/g, '') : null;
    
//     // Generate tokens
//     let accessToken, refreshToken, accessExp, refreshExp, hashedRefreshToken;
//     try {
//       const payload = {
//         userId: user.id,
//         email: user.email,
//         role: user.role,
//         name: sanitizedName,
//         active: user.isActive,
//         phone: user.phone,
//       };
    
//       ({ token: accessToken, exp: accessExp } = await generateToken(payload, process.env.TOKEN_EXPIRATION || '15m'));
//       ({ token: refreshToken, exp: refreshExp } = await generateToken(payload, process.env.REFRESH_TOKEN_EXPIRATION || '7d'));
    
//       hashedRefreshToken = await hashToken(refreshToken);
    
//         try {
//           await databaseService.refreshUserTokens(user.id, hashedRefreshToken, new Date(refreshExp));
//         } catch (error) {
//           return createError(res, 500, 'Token storage failed');
//         }
      
//     } catch (authError) {
//       const errorMessage = typeof authError === 'string' ? authError : authError.message || authError.code || 'Unknown auth error';
//       const errorStack = authError.stack || 'No stack trace';
//       try {
//         await LoggerService.logError('Auth service error during login', errorStack, { email, error: errorMessage, errorCode: authError.code || null });
//       } catch (logError) {
//         console.error('Failed to log auth error:', logError.message);
//       }
//       return createError(res, 500, 'Failed to generate tokens', 'AUTH_ERROR', { message: errorMessage, errorCode: authError.code || null });
//     }
    

   
//     const isProduction = process.env.NODE_ENV === 'production';
//     res.cookie('accessToken', accessToken, {
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: isProduction ? 'strict' : 'lax',
//       maxAge: 15 * 60 * 1000,
//       path: '/',
//     });
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: isProduction ? 'strict' : 'lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       path: '/',
//     });

//     const getGreetingMessage = (name) => {
//       const hour = new Date().getHours();
//       const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
//       const firstName = name ? name.split(' ')[0].charAt(0).toUpperCase() + name.split(' ')[0].slice(1).toLowerCase() : 'User';
//       const funMessages = [
//         'Great to see you again! 💫',
//         'Access granted! 🎉',
//         "You're in! Let's go! 🚀",
//         'Authentication successful! 🥳',
//         'Ready to roll! 🌟',
//         `Welcome back, ${firstName}! 🌟`,
//         `Hello, ${firstName}! Let's go! 🚀`,
//         `${timeGreeting}, ${firstName}! 🌟`,
//       ];
//       let lastMessageIndex = -1;
//       return () => {
//         let randomIndex;
//         do {
//           randomIndex = Math.floor(Math.random() * funMessages.length);
//         } while (randomIndex === lastMessageIndex);
//         lastMessageIndex = randomIndex;
//         return funMessages[randomIndex];
//       };
//     };

//     const generateLoginMessage = getGreetingMessage(sanitizedName);
//     try {
//       await cacheService.set(`login-attempts:${email}`, 0);
//       await LoggerService.logLogin(user.id, 'SUCCESS', req.ip, req.get('User-Agent'));
//       await LoggerService.logAudit(user.id, 'USER_LOGIN', user.id, { email, role: user.role, phone: user.phone });
//       await LoggerService.logNotification(user.id, 'WEBHOOK', 'user_login', `User ${email} logged in`, 'SENT');
//       await sendWebhook('USER_LOGIN', { userId: user.id, email, role: user.role, phone: user.phone, loginTime: new Date().toISOString() });
//     } catch (postLoginError) {
//       const errorMessage = typeof postLoginError === 'string' ? postLoginError : postLoginError.message || postLoginError.code || 'Unknown post-login error';
//       const errorStack = postLoginError.stack || 'No stack trace';
//       try {
//         await LoggerService.logError('Post-login error (logging/webhook)', errorStack, { email, error: errorMessage, errorCode: postLoginError.code || null });
//       } catch (logError) {
//         console.error('Failed to log post-login error:', logError.message);
//       }
//     }

//     return createResponse(res, 200, generateLoginMessage(), {
//       user: {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//         name: sanitizedName,
//         phone: user.phone,
//       },
//       // accessToken,
//     });
//   } catch (error) {
//     const errorMessage = typeof error === 'string' ? error : error.message || error.code || 'Unknown login error';
//     const errorStack = error.stack || 'No stack trace';
//     console.error('Login error details:', { error: error.toString(), errorMessage, errorStack, errorCode: error.code || null });
//     try {
//       await LoggerService.logError('Login failed', errorStack, { email: req.body.email || 'unknown', error: errorMessage, errorCode: error.code || null });
//     } catch (logError) {
//       console.error('Failed to log login error:', logError.message, { logErrorStack: logError.stack || 'No stack trace' });
//     }
//     return createError(res, 500, 'Failed to log in', 'SERVER_ERROR', { errorId: Date.now().toString(), message: errorMessage, errorCode: error.code || null });
//   }
// };
// POST /api/auth/refresh - Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const providedRefreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!providedRefreshToken) {
      await LoggerService.logAudit(null, 'TOKEN_REFRESH_FAILED', null, { reason: 'No refresh token provided' });
      return createError(res, 401, 'Session expired. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    // Verify provided refresh token
    const payload = await verifyToken(providedRefreshToken);

    // Ensure stored hash exists (rotate only if valid current token)
    const providedTokenHash = await hashToken(providedRefreshToken);
    const stored = await databaseService.getRefreshToken(providedTokenHash);
    if (!stored || stored.expiresAt < new Date()) {
      await LoggerService.logAudit(null, 'TOKEN_REFRESH_FAILED', payload.userId, { reason: 'Refresh token not recognized or expired' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED');
    }

    // Fetch user
    const user = await databaseService.getUserById(payload.userId, { id: true, email: true, role: true, name: true, phone: true, isActive: true });
    if (!user) {
      await LoggerService.logAudit(null, 'TOKEN_REFRESH_FAILED', payload.userId, { reason: 'User not found' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED');
    }

    // Issue new tokens (rotate refresh)
    const accessPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      active: user.isActive,
      phone: user.phone,
    };
    const { token: accessToken } = await generateToken(accessPayload, process.env.TOKEN_EXPIRATION || '15m');
    const { token: newRefreshToken, exp: newRefreshExp } = await generateToken(accessPayload, process.env.REFRESH_TOKEN_EXPIRATION || '7d');

    // Store new refresh token hash (replaces previous)
    const newHashedRefresh = await hashToken(newRefreshToken);
    await databaseService.refreshUserTokens(user.id, newHashedRefresh, newRefreshExp);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    await LoggerService.logAudit(user.id, 'TOKEN_REFRESH_SUCCESS', user.id, { email: user.email, phone: user.phone });
    await LoggerService.logNotification(user.id, 'WEBHOOK', 'token_refreshed', `Token refreshed for ${user.email}`, 'SENT');
    await sendWebhook('TOKEN_REFRESHED', { userId: user.id, email: user.email, phone: user.phone });
    return createResponse(res, 200, 'Token refreshed successfully', { accessToken });
  } catch (error) {
    await LoggerService.logError('Token refresh failed', error.stack, { userId: req.user?.id });
    await LoggerService.logAudit(null, 'TOKEN_REFRESH_FAILED', null, { reason: error.message });
    return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
  }
};

// POST /api/auth/logout - User logout
export const logout = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;
    if (!accessToken) {
      await LoggerService.logAudit(null, 'USER_LOGOUT_FAILED', null, { reason: 'Missing access token' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    await authService.logout(accessToken);
    res.clearCookie('accessToken', { path: '/', httpOnly: true });
    res.clearCookie('refreshToken', { path: '/', httpOnly: true });

    await LoggerService.logAudit(req.user.id, 'USER_LOGOUT_SUCCESS', req.user.id, { email: req.user.email, phone: req.user.phone });
    await LoggerService.logNotification(req.user.id, 'WEBHOOK', 'user_logout', `User ${req.user.email} logged out`, 'SENT');
    await sendWebhook('USER_LOGOUT', { userId: req.user.id, email: req.user.email, phone: req.user.phone });
    return createResponse(res, 200, 'Signed out successfully', { nextSteps: 'Log in again to access your account' });
  } catch (error) {
    await LoggerService.logError('Logout failed', error.stack, { userId: req.user?.id });
    await LoggerService.logAudit(null, 'USER_LOGOUT_FAILED', null, { reason: error.message });
    return createError(res, 500, 'Failed to log out', 'SERVER_ERROR', { errorId: Date.now().toString() });
  }
};

// GET /api/auth/token - Validate token
export const getToken = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken || !refreshToken) {
      await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', null, { reason: 'Missing session tokens' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    const user = await authService.getUserById(req.user.userId);
    if (!user) {
      await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', req.user.id, { reason: 'User not found' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    const tokenHash = crypto.createHash('sha256').update(accessToken).digest('hex');
    const blacklisted = await databaseService.findBlacklistedToken(tokenHash, { expiresAt: { gte: new Date() } });

    if (blacklisted) {
      await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', user.id, { reason: 'Token is revoked' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    await LoggerService.logAudit(user.id, 'TOKEN_VALIDATE_SUCCESS', user.id, { email: user.email, phone: user.phone });
    await LoggerService.logNotification(user.id, 'WEBHOOK', 'token_validated', `Token validated for ${user.email}`, 'SENT');
    await sendWebhook('TOKEN_VALIDATED', { userId: user.id, email: user.email, phone: user.phone });
    return createResponse(res, 200, 'Session is active', { user: { id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone } });
  } catch (error) {
    await LoggerService.logError('Token validation failed', error.stack, { userId: req.user?.id });
    await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', null, { reason: error.message });
    return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
  }
};


// List current user's refresh tokens (sessions)
export const listSessions = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED');
    }
    const tokens = await databaseService.listRefreshTokensByUser(req.user.userId);
    return createResponse(res, 200, 'Sessions fetched', { sessions: tokens });
  } catch (error) {
    await LoggerService.logError('listSessions failed', error.stack, { userId: req.user?.userId });
    return createError(res, 500, 'Failed to fetch sessions', 'SERVER_ERROR');
  }
};

// Logout all sessions: delete all refresh tokens for user and blacklist current access token
export const logoutAllSessions = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED');
    }
    // Blacklist current access token if present
    const accessToken = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;
    if (accessToken) {
      const { logout } = await import('../services/authService.js');
      await logout(accessToken);
    }

    const count = await databaseService.deleteAllRefreshTokensForUser(req.user.userId);
    res.clearCookie('accessToken', { path: '/', httpOnly: true });
    res.clearCookie('refreshToken', { path: '/', httpOnly: true });

    await LoggerService.logAudit(req.user.userId, 'USER_LOGOUT_ALL_SESSIONS', req.user.userId, { deletedTokens: count });
    return createResponse(res, 200, 'Logged out from all sessions', { deletedTokens: count });
  } catch (error) {
    await LoggerService.logError('logoutAllSessions failed', error.stack, { userId: req.user?.userId });
    return createError(res, 500, 'Failed to logout from all sessions', 'SERVER_ERROR');
  }
};

// Logout other sessions: delete all refresh tokens except the current one (from provided cookie)
export const logoutOtherSessions = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED');
    }
    const currentRefresh = req.cookies.refreshToken || req.body.refreshToken;
    if (!currentRefresh) {
      return createError(res, 400, 'Current refresh token required', 'BAD_REQUEST');
    }
    const keepHash = await hashToken(currentRefresh);
    const count = await databaseService.deleteOtherRefreshTokensForUser(req.user.userId, keepHash);

    await LoggerService.logAudit(req.user.userId, 'USER_LOGOUT_OTHER_SESSIONS', req.user.userId, { deletedTokens: count });
    return createResponse(res, 200, 'Logged out from other sessions', { deletedTokens: count });
  } catch (error) {
    await LoggerService.logError('logoutOtherSessions failed', error.stack, { userId: req.user?.userId });
    return createError(res, 500, 'Failed to logout other sessions', 'SERVER_ERROR');
  }
};