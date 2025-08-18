#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../server/locales');
const REFERENCE_LANG = 'en';

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logBright(message, color = 'white') {
  console.log(`${colors.bright}${colors[color]}${message}${colors.reset}`);
}

// Get all language directories
function getLanguages() {
  return readdirSync(LOCALES_DIR).filter(item => {
    const path = join(LOCALES_DIR, item);
    return statSync(path).isDirectory();
  });
}

// Get all namespace files for a language
function getNamespaces(lang) {
  const langDir = join(LOCALES_DIR, lang);
  return readdirSync(langDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

// Load translation file
function loadTranslations(lang, namespace) {
  try {
    const filePath = join(LOCALES_DIR, lang, `${namespace}.json`);
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

// Recursively get all translation keys from an object
function getKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Compare translation keys between languages
function compareTranslations(referenceLang, targetLang, namespace) {
  const referenceTranslations = loadTranslations(referenceLang, namespace);
  const targetTranslations = loadTranslations(targetLang, namespace);
  
  if (!referenceTranslations) {
    return { error: `Reference file ${referenceLang}/${namespace}.json not found` };
  }
  
  if (!targetTranslations) {
    return { error: `Target file ${targetLang}/${namespace}.json not found` };
  }
  
  const referenceKeys = getKeys(referenceTranslations);
  const targetKeys = getKeys(targetTranslations);
  
  const missingKeys = referenceKeys.filter(key => !targetKeys.includes(key));
  const extraKeys = targetKeys.filter(key => !referenceKeys.includes(key));
  
  return {
    referenceCount: referenceKeys.length,
    targetCount: targetKeys.length,
    missingKeys,
    extraKeys,
    completeness: Math.round((targetKeys.length / referenceKeys.length) * 100)
  };
}

// Main validation function
function validateTranslations() {
  logBright('🌐 Translation Validation Report', 'cyan');
  log('=' .repeat(50), 'cyan');
  
  const languages = getLanguages();
  const referenceNamespaces = getNamespaces(REFERENCE_LANG);
  
  let totalIssues = 0;
  let totalFiles = 0;
  const languageStats = {};
  
  // Header
  log(`\nReference Language: ${REFERENCE_LANG.toUpperCase()}`, 'green');
  log(`Languages Found: ${languages.join(', ')}`, 'blue');
  log(`Namespaces: ${referenceNamespaces.join(', ')}`, 'blue');
  
  for (const lang of languages) {
    if (lang === REFERENCE_LANG) continue;
    
    logBright(`\n📋 Language: ${lang.toUpperCase()}`, 'magenta');
    log('-'.repeat(30), 'magenta');
    
    const langNamespaces = getNamespaces(lang);
    let langIssues = 0;
    let langFiles = 0;
    let langTotalKeys = 0;
    let langMissingKeys = 0;
    
    // Check for missing namespace files
    const missingNamespaces = referenceNamespaces.filter(ns => !langNamespaces.includes(ns));
    if (missingNamespaces.length > 0) {
      log(`❌ Missing namespace files: ${missingNamespaces.join(', ')}`, 'red');
      langIssues += missingNamespaces.length;
    }
    
    // Check each namespace
    for (const namespace of referenceNamespaces) {
      const comparison = compareTranslations(REFERENCE_LANG, lang, namespace);
      langFiles++;
      totalFiles++;
      
      if (comparison.error) {
        log(`❌ ${namespace}.json: ${comparison.error}`, 'red');
        langIssues++;
        totalIssues++;
        continue;
      }
      
      langTotalKeys += comparison.referenceCount;
      langMissingKeys += comparison.missingKeys.length;
      
      if (comparison.missingKeys.length === 0 && comparison.extraKeys.length === 0) {
        log(`✅ ${namespace}.json: Complete (${comparison.targetCount} keys)`, 'green');
      } else {
        let status = '⚠️ ';
        if (comparison.missingKeys.length > 0) {
          status += `Missing ${comparison.missingKeys.length} keys`;
          langIssues += comparison.missingKeys.length;
          totalIssues += comparison.missingKeys.length;
        }
        if (comparison.extraKeys.length > 0) {
          if (comparison.missingKeys.length > 0) status += ', ';
          status += `${comparison.extraKeys.length} extra keys`;
        }
        status += ` (${comparison.completeness}% complete)`;
        
        log(`${status}`, comparison.missingKeys.length > 0 ? 'yellow' : 'blue');
        
        // Show missing keys (limit to first 5)
        if (comparison.missingKeys.length > 0) {
          const keysToShow = comparison.missingKeys.slice(0, 5);
          keysToShow.forEach(key => {
            log(`    - ${key}`, 'red');
          });
          if (comparison.missingKeys.length > 5) {
            log(`    ... and ${comparison.missingKeys.length - 5} more`, 'red');
          }
        }
      }
    }
    
    // Language summary
    const langCompleteness = Math.round(((langTotalKeys - langMissingKeys) / langTotalKeys) * 100);
    languageStats[lang] = {
      completeness: langCompleteness,
      issues: langIssues,
      files: langFiles,
      missingKeys: langMissingKeys,
      totalKeys: langTotalKeys
    };
    
    log(`📊 Summary: ${langCompleteness}% complete (${langMissingKeys}/${langTotalKeys} keys missing)`, 
         langCompleteness === 100 ? 'green' : langCompleteness >= 80 ? 'yellow' : 'red');
  }
  
  // Overall summary
  logBright('\n📈 Overall Summary', 'cyan');
  log('=' .repeat(50), 'cyan');
  
  for (const [lang, stats] of Object.entries(languageStats)) {
    const statusIcon = stats.completeness === 100 ? '✅' : stats.completeness >= 80 ? '⚠️ ' : '❌';
    const color = stats.completeness === 100 ? 'green' : stats.completeness >= 80 ? 'yellow' : 'red';
    
    log(`${statusIcon} ${lang.toUpperCase()}: ${stats.completeness}% complete ` +
        `(${stats.missingKeys} missing keys, ${stats.issues} issues)`, color);
  }
  
  if (totalIssues === 0) {
    logBright('\n🎉 All translations are complete!', 'green');
  } else {
    log(`\n⚠️  Found ${totalIssues} issues across ${totalFiles} files`, 'yellow');
    log('Run this script regularly to maintain translation quality.', 'blue');
  }
  
  log('\n💡 Tips:', 'cyan');
  log('- Add new keys to the reference language (en) first', 'white');
  log('- Use consistent key naming conventions', 'white');
  log('- Consider using interpolation for dynamic content: {{variable}}', 'white');
  
  return totalIssues;
}

// Run validation
const issues = validateTranslations();
process.exit(issues > 0 ? 1 : 0);