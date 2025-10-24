/**
 * Export Translation Script
 * 
 * This script exports all translations from the database back to JSON files
 * for backup and version control purposes.
 * 
 * Usage:
 *   node scripts/export-translations-from-db.js
 *   node scripts/export-translations-from-db.js --locale=en --namespace=common (export specific)
 *   node scripts/export-translations-from-db.js --dry-run (preview without exporting)
 */

import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Configuration
const LOCALES_DIR = path.join(__dirname, '..', 'server', 'locales');
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar'];
const DRY_RUN = process.argv.includes('--dry-run');
const SPECIFIC_LOCALE = process.argv.find(arg => arg.startsWith('--locale='))?.split('=')[1];
const SPECIFIC_NAMESPACE = process.argv.find(arg => arg.startsWith('--namespace='))?.split('=')[1];

/**
 * Convert flat dot-notation keys to nested object
 * Example: { "hero.title": "Hello" } => { hero: { title: "Hello" } }
 */
function unflattenObject(flat) {
  const nested = {};
  
  for (const [key, value] of Object.entries(flat)) {
    const keys = key.split('.');
    let current = nested;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k]) {
        current[k] = {};
      }
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = value;
  }
  
  return nested;
}

/**
 * Export translations for a specific locale and namespace
 */
async function exportTranslations(locale, namespace) {
  try {
    const translations = await prisma.translation.findMany({
      where: {
        locale,
        namespace,
        isActive: true
      },
      select: {
        key: true,
        value: true
      },
      orderBy: {
        key: 'asc'
      }
    });

    if (translations.length === 0) {
      console.log(`  ⚠️  No translations found for ${locale}/${namespace}`);
      return { exported: 0, skipped: 0 };
    }

    // Convert to flat object first
    const flat = {};
    translations.forEach(t => {
      flat[t.key] = t.value;
    });

    // Convert to nested object
    const nested = unflattenObject(flat);

    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would export ${translations.length} keys to ${locale}/${namespace}.json`);
      return { exported: 0, skipped: 0, preview: translations.length };
    }

    // Ensure directory exists
    const localeDir = path.join(LOCALES_DIR, locale);
    await fs.mkdir(localeDir, { recursive: true });

    // Write to file
    const filePath = path.join(localeDir, `${namespace}.json`);
    await fs.writeFile(filePath, JSON.stringify(nested, null, 2), 'utf8');

    console.log(`  ✅ Exported ${translations.length} keys to ${locale}/${namespace}.json`);
    return { exported: translations.length, skipped: 0 };

  } catch (error) {
    console.error(`  ❌ Error exporting ${locale}/${namespace}:`, error.message);
    return { exported: 0, skipped: 0, error: error.message };
  }
}

/**
 * Get all unique locale+namespace combinations from database
 */
async function getAllCombinations() {
  const combinations = await prisma.translation.groupBy({
    by: ['locale', 'namespace'],
    where: {
      isActive: true
    }
  });

  return combinations;
}

/**
 * Export all translations
 */
async function exportAllTranslations() {
  console.log('\n📤 Translation Export Script');
  console.log('=============================\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No files will be written\n');
  }

  const stats = {
    totalFiles: 0,
    totalExported: 0,
    totalSkipped: 0,
    totalPreview: 0,
    errors: []
  };

  // Get all combinations from database
  const combinations = await getAllCombinations();
  console.log(`📊 Found ${combinations.length} locale+namespace combinations in database\n`);

  // Filter by specific locale/namespace if provided
  const filtered = combinations.filter(c => {
    if (SPECIFIC_LOCALE && c.locale !== SPECIFIC_LOCALE) return false;
    if (SPECIFIC_NAMESPACE && c.namespace !== SPECIFIC_NAMESPACE) return false;
    return true;
  });

  console.log(`🔍 Exporting ${filtered.length} combinations...\n`);

  // Group by locale for better output
  const byLocale = filtered.reduce((acc, c) => {
    if (!acc[c.locale]) acc[c.locale] = [];
    acc[c.locale].push(c.namespace);
    return acc;
  }, {});

  for (const [locale, namespaces] of Object.entries(byLocale)) {
    console.log(`🌐 Exporting locale: ${locale} (${namespaces.length} namespaces)`);
    
    for (const namespace of namespaces) {
      const result = await exportTranslations(locale, namespace);
      
      stats.totalFiles++;
      stats.totalExported += result.exported || 0;
      stats.totalSkipped += result.skipped || 0;
      stats.totalPreview += result.preview || 0;
      
      if (result.error) {
        stats.errors.push({ locale, namespace, error: result.error });
      }
    }
    
    console.log('');
  }

  // Print summary
  console.log('\n📊 Export Summary');
  console.log('==================');
  console.log(`Files processed: ${stats.totalFiles}`);
  
  if (DRY_RUN) {
    console.log(`Translations preview: ${stats.totalPreview}`);
    console.log('\n⚠️  This was a DRY RUN. No files were written.');
    console.log('   Run without --dry-run to actually export the data.');
  } else {
    console.log(`Translations exported: ${stats.totalExported}`);
    console.log(`Output directory: ${LOCALES_DIR}`);
    
    if (stats.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${stats.errors.length}`);
      stats.errors.forEach(err => {
        console.log(`  - ${err.locale}/${err.namespace}: ${err.error}`);
      });
    }
  }
  
  console.log('\n✅ Export complete!\n');
}

/**
 * Main execution
 */
async function main() {
  try {
    await exportAllTranslations();
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
