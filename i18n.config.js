// Static fallback configuration for i18n
// This is used as fallback when dynamic configuration fails
export const staticSupportedLngs = ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'];
export const staticRtlLngs = ['ar'];

// Default configuration (will be overridden by dynamic config)
export const supportedLngs = staticSupportedLngs;
export const rtlLngs = staticRtlLngs;

export default {
  supportedLngs,
  rtlLngs,
  // Note: In production, these will be dynamically loaded from the database
  // This static config serves as a fallback
};

