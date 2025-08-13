import { parsePhoneNumber } from 'libphonenumber-js';

export function normalizePhoneE164(raw, defaultCountry = process.env.DEFAULT_PHONE_COUNTRY || 'MA') {
  if (!raw || typeof raw !== 'string') return raw;
  try {
    const phone = parsePhoneNumber(raw, defaultCountry);
    if (phone && phone.isValid()) return phone.number; // E.164
    return raw.trim();
  } catch {
    return raw.trim();
  }
}

export default { normalizePhoneE164 };