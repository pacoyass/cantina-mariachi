/**
 * Import Translation Script
 * 
 * This script imports all existing JSON translation files from server/locales
 * into the database Translation table.
 * 
 * Usage:
 *   node scripts/import-translations-to-db.js
 *   node scripts/import-translations-to-db.js --locale=en --namespace=common (import specific)
 *   node scripts/import-translations-to-db.js --dry-run (preview without importing)
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

// Admin user ID for created/updated by (use first admin/owner if exists)
let ADMIN_USER_ID = 'system';

/**
 * Flatten nested JSON object into dot-notation keys
 * Example: { hero: { title: "Hello" } } => { "hero.title": "Hello" }
 */
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      // Leaf node - store the value
      flattened[newKey] = String(value);
    }
  }
  
  return flattened;
}

/**
 * Import translations from a single JSON file
 */
async function importTranslationFile(locale, namespace, filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const translations = JSON.parse(content);
    const flattened = flattenObject(translations);
    
    const translationKeys = Object.keys(flattened);
    console.log(`  📄 ${locale}/${namespace}.json (${translationKeys.length} keys)`);
    
    if (DRY_RUN) {
      console.log(`     [DRY RUN] Would import: ${translationKeys.slice(0, 3).join(', ')}${translationKeys.length > 3 ? '...' : ''}`);
      return { imported: 0, skipped: 0, preview: translationKeys.length };
    }
    
    let imported = 0;
    let skipped = 0;
    
    for (const [key, value] of Object.entries(flattened)) {
      try {
        await prisma.translation.upsert({
          where: {
            key_namespace_locale: {
              key,
              namespace,
              locale
            }
          },
          update: {
            value,
            updatedAt: new Date(),
            updatedBy: ADMIN_USER_ID,
            isActive: true
          },
          create: {
            key,
            namespace,
            locale,
            value,
            isActive: true,
            createdBy: ADMIN_USER_ID,
            updatedBy: ADMIN_USER_ID
          }
        });
        imported++;
      } catch (error) {
        console.error(`     ❌ Error importing ${key}:`, error.message);
        skipped++;
      }
    }
    
    console.log(`     ✅ Imported: ${imported}, Skipped: ${skipped}`);
    return { imported, skipped };
    
  } catch (error) {
    console.error(`  ❌ Error reading ${filePath}:`, error.message);
    return { imported: 0, skipped: 0, error: error.message };
  }
}

/**
 * Import all translations from all locales
 */
async function importAllTranslations() {
  console.log('\n🌍 Translation Import Script');
  console.log('============================\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No data will be imported\n');
  }
  
  // Try to get first admin/owner user ID
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: { in: ['ADMIN', 'OWNER'] } }
    });
    if (adminUser) {
      ADMIN_USER_ID = adminUser.id;
      console.log(`📝 Using admin user ID: ${ADMIN_USER_ID}\n`);
    } else {
      console.log(`📝 No admin user found, using: ${ADMIN_USER_ID}\n`);
    }
  } catch (error) {
    console.log(`⚠️  Could not fetch admin user: ${error.message}\n`);
  }
  
  const stats = {
    totalFiles: 0,
    totalImported: 0,
    totalSkipped: 0,
    totalPreview: 0,
    errors: []
  };
  
  // Determine which locales to process
  const localesToProcess = SPECIFIC_LOCALE 
    ? [SPECIFIC_LOCALE] 
    : SUPPORTED_LANGUAGES;
  
  for (const locale of localesToProcess) {
    const localeDir = path.join(LOCALES_DIR, locale);
    
    try {
      const files = await fs.readdir(localeDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      console.log(`🌐 Processing locale: ${locale} (${jsonFiles.length} files)`);
      
      for (const file of jsonFiles) {
        const namespace = file.replace('.json', '');
        
        // Skip if specific namespace is requested and this isn't it
        if (SPECIFIC_NAMESPACE && namespace !== SPECIFIC_NAMESPACE) {
          continue;
        }
        
        const filePath = path.join(localeDir, file);
        const result = await importTranslationFile(locale, namespace, filePath);
        
        stats.totalFiles++;
        stats.totalImported += result.imported || 0;
        stats.totalSkipped += result.skipped || 0;
        stats.totalPreview += result.preview || 0;
        
        if (result.error) {
          stats.errors.push({ locale, namespace, error: result.error });
        }
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error processing locale ${locale}:`, error.message);
      stats.errors.push({ locale, error: error.message });
    }
  }
  
  // Print summary
  console.log('\n📊 Import Summary');
  console.log('=================');
  console.log(`Files processed: ${stats.totalFiles}`);
  
  if (DRY_RUN) {
    console.log(`Translations preview: ${stats.totalPreview}`);
    console.log('\n⚠️  This was a DRY RUN. No data was imported.');
    console.log('   Run without --dry-run to actually import the data.');
  } else {
    console.log(`Translations imported: ${stats.totalImported}`);
    console.log(`Translations skipped: ${stats.totalSkipped}`);
    
    if (stats.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${stats.errors.length}`);
      stats.errors.forEach(err => {
        console.log(`  - ${err.locale}${err.namespace ? `/${err.namespace}` : ''}: ${err.error}`);
      });
    }
  }
  
  console.log('\n✅ Import complete!\n');
}

/**
 * Main execution
 */
async function main() {
  try {
    await importAllTranslations();
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
