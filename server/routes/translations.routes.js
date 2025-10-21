import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import prisma from '../config/database.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import {
  getTranslations,
  getTranslation,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  getMissingTranslations,
  getMetadata,
  bulkImport,
  bulkExport
} from '../controllers/translations.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const rlLight = rateLimit({ windowMs: 60_000, max: 240 });
const rlStrict = rateLimit({ windowMs: 60_000, max: 60 });

// ==========================================
// ADMIN ROUTES (Protected - OWNER/ADMIN only)
// ==========================================

router.get('/admin/translations', authMiddleware, requireRole('ADMIN', 'OWNER'), rlStrict, getTranslations);
router.get('/admin/translations/missing', authMiddleware, requireRole('ADMIN', 'OWNER'), rlStrict, getMissingTranslations);
router.get('/admin/translations/metadata', authMiddleware, requireRole('ADMIN', 'OWNER'), rlStrict, getMetadata);
router.get('/admin/translations/bulk-export', authMiddleware, requireRole('ADMIN', 'OWNER'), rlStrict, bulkExport);
router.post('/admin/translations/bulk-import', authMiddleware, requireRole('ADMIN', 'OWNER'), rlStrict, bulkImport);
router.get('/admin/translations/:id', authMiddleware, requireRole('ADMIN', 'OWNER'), rlStrict, getTranslation);
router.post('/admin/translations', authMiddleware, requireRole('ADMIN', 'OWNER'), rlStrict, createTranslation);
router.put('/admin/translations/:id', authMiddleware, requireRole('ADMIN', 'OWNER'), rlStrict, updateTranslation);
router.delete('/admin/translations/:id', authMiddleware, requireRole('ADMIN', 'OWNER'), rlStrict, deleteTranslation);

// ==========================================
// PUBLIC ROUTES (Query database with JSON fallback)
// ==========================================

/**
 * GET /api/translations/:lng/:ns
 * Serve translation namespace to the frontend
 * Priority: Database -> JSON files (fallback)
 */
router.get('/:lng/:ns', rlLight, async (req, res) => {
  try {
    const { lng, ns } = req.params;
    const supportedLngs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar'];
    
    // Validate language
    if (!supportedLngs.includes(lng)) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported language',
        supported: supportedLngs
      });
    }

    let translations = {};
    let source = 'database';

    // Try to load from database first
    try {
      const dbTranslations = await prisma.translation.findMany({
        where: {
          locale: lng,
          namespace: ns,
          isActive: true
        },
        select: {
          key: true,
          value: true
        }
      });

      if (dbTranslations && dbTranslations.length > 0) {
        // Convert flat key-value pairs to nested object
        for (const t of dbTranslations) {
          setNestedValue(translations, t.key, t.value);
        }
      } else {
        // No database translations found, try JSON fallback
        throw new Error('No database translations found');
      }
    } catch (dbError) {
      // Fallback to JSON files
      source = 'file';
      console.log(`[Translations] Database lookup failed for ${lng}/${ns}, using JSON fallback:`, dbError.message);
      
      const filePath = path.join(__dirname, '..', 'locales', lng, `${ns}.json`);
      
      try {
        await fs.access(filePath);
        const content = await fs.readFile(filePath, 'utf8');
        translations = JSON.parse(content);
      } catch (fileError) {
        return res.status(404).json({
          success: false,
          error: 'Translation file not found',
          lng,
          ns
        });
      }
    }

    res.json({
      success: true,
      data: {
        lng,
        ns,
        translations
      },
      meta: {
        source // 'database' or 'file'
      }
    });

  } catch (error) {
    console.error('Translation API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load translations'
    });
  }
});

/**
 * GET /api/translations/:lng
 * Serve all translation namespaces for a language
 * Priority: Database -> JSON files (fallback)
 */
router.get('/:lng', rlLight, async (req, res) => {
  try {
    const { lng } = req.params;
    const supportedLngs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar'];
    
    // Validate language
    if (!supportedLngs.includes(lng)) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported language',
        supported: supportedLngs
      });
    }

    let allTranslations = {};
    let source = 'database';

    // Try to load from database first
    try {
      const dbTranslations = await prisma.translation.findMany({
        where: {
          locale: lng,
          isActive: true
        },
        select: {
          key: true,
          namespace: true,
          value: true
        }
      });

      if (dbTranslations && dbTranslations.length > 0) {
        // Group by namespace and convert to nested objects
        for (const t of dbTranslations) {
          if (!allTranslations[t.namespace]) {
            allTranslations[t.namespace] = {};
          }
          setNestedValue(allTranslations[t.namespace], t.key, t.value);
        }
      } else {
        // No database translations found, try JSON fallback
        throw new Error('No database translations found');
      }
    } catch (dbError) {
      // Fallback to JSON files
      source = 'file';
      console.log(`[Translations] Database lookup failed for ${lng}, using JSON fallback:`, dbError.message);
      
      const localesDir = path.join(__dirname, '..', 'locales', lng);
      
      try {
        await fs.access(localesDir);
        const files = await fs.readdir(localesDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        for (const file of jsonFiles) {
          const ns = file.replace('.json', '');
          const filePath = path.join(localesDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          allTranslations[ns] = JSON.parse(content);
        }
      } catch (fileError) {
        return res.status(404).json({
          success: false,
          error: 'Language not found',
          lng
        });
      }
    }

    res.json({
      success: true,
      data: {
        lng,
        translations: allTranslations
      },
      meta: {
        source // 'database' or 'file'
      }
    });

  } catch (error) {
    console.error('Translation API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load translations'
    });
  }
});

/**
 * Helper: Set nested value using dot-notation key
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

export default router;
