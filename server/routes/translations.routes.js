import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * GET /api/translations/:lng/:ns
 * Serve translation files to the frontend
 */
router.get('/:lng/:ns', async (req, res) => {
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

    // Build file path
    const filePath = path.join(__dirname, '..', 'locales', lng, `${ns}.json`);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        error: 'Translation file not found',
        lng,
        ns
      });
    }

    // Read and parse the translation file
    const content = await fs.readFile(filePath, 'utf8');
    const translations = JSON.parse(content);

    res.json({
      success: true,
      data: {
        lng,
        ns,
        translations
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
 */
router.get('/:lng', async (req, res) => {
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

    const localesDir = path.join(__dirname, '..', 'locales', lng);
    
    // Check if language directory exists
    try {
      await fs.access(localesDir);
    } catch {
      return res.status(404).json({
        success: false,
        error: 'Language not found',
        lng
      });
    }

    // Read all JSON files in the language directory
    const files = await fs.readdir(localesDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const allTranslations = {};
    
    for (const file of jsonFiles) {
      const ns = file.replace('.json', '');
      const filePath = path.join(localesDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      allTranslations[ns] = JSON.parse(content);
    }

    res.json({
      success: true,
      data: {
        lng,
        translations: allTranslations
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

export default router;