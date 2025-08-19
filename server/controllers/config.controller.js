import { createResponse, createError } from '../utils/response.js';
import prisma from '../config/database.js';

function computeOpenStatus(operatingHours) {
  try {
    const now = new Date();
    const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const day = dayNames[now.getDay()];
    const hours = operatingHours?.[day] || operatingHours?.[day.charAt(0).toUpperCase()+day.slice(1)] || '9AM-9PM';
    const [openStr, closeStr] = String(hours).split('-');
    const to24 = (str) => {
      const m = String(str).match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
      if (!m) return { h: 9, m: 0 };
      let h = parseInt(m[1], 10);
      const min = parseInt(m[2] || '0', 10);
      const ampm = m[3].toUpperCase();
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return { h, m: min };
    };
    const o = to24(openStr);
    const c = to24(closeStr);
    const open = new Date(now); open.setHours(o.h, o.m, 0, 0);
    const close = new Date(now); close.setHours(c.h, c.m, 0, 0);
    const isOpen = now >= open && now <= close;
    const etaBase = isOpen ? 25 : 45; // simplistic base ETA
    return { isOpen, openAt: open.toISOString(), closeAt: close.toISOString(), etaMins: etaBase };
  } catch {
    return { isOpen: true, etaMins: 25 };
  }
}

export const getPublicConfig = async (req, res) => {
  try {
    const cfg = await prisma.appConfig.findFirst();
    const hours = cfg?.operatingHours || { monday: '9AM-9PM', tuesday: '9AM-9PM', wednesday: '9AM-9PM', thursday: '9AM-9PM', friday: '9AM-10PM', saturday: '9AM-10PM', sunday: '10AM-8PM' };
    const status = computeOpenStatus(hours);
    return createResponse(res, 200, 'dataRetrieved', { operatingHours: hours, status }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const getLanguages = async (req, res) => {
  try {
    const languages = [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
    ];
    
    return createResponse(res, 200, 'dataRetrieved', { languages }, req);
  } catch (error) {
    return createError(res, 500, 'internalError', 'INTERNAL_ERROR', {}, req);
  }
};

export const setLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    
    if (!language || !['en', 'es', 'fr', 'de', 'it', 'pt', 'ar'].includes(language)) {
      return createError(res, 400, 'badRequest', 'INVALID_LANGUAGE', {}, req);
    }
    
    // Set language cookie
    res.cookie('i18next', language, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return createResponse(res, 200, 'languageUpdated', { language }, req);
  } catch (error) {
    return createError(res, 500, 'internalError', 'INTERNAL_ERROR', {}, req);
  }
};

export const resetLanguage = async (req, res) => {
  try {
    // Clear language cookie
    res.clearCookie('i18next', { path: '/' });
    
    return createResponse(res, 200, 'languageReset', { language: 'en' }, req);
  } catch (error) {
    return createError(res, 500, 'internalError', 'INTERNAL_ERROR', {}, req);
  }
};

export default { getPublicConfig };