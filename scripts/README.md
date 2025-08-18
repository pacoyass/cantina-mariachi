# 🌐 Translation Management Scripts

This directory contains scripts for managing translations in the Cantina Mariachi application.

## Scripts

### `validate-translations.js`

A comprehensive translation validation script that:

- ✅ **Checks completeness** across all supported languages
- ✅ **Identifies missing keys** with detailed reporting
- ✅ **Shows translation statistics** per language and namespace
- ✅ **Validates JSON structure** and detects errors
- ✅ **Provides actionable insights** for maintaining translations

#### Usage

```bash
# Direct execution
node scripts/validate-translations.js

# Via npm scripts
npm run i18n:validate
npm run i18n:check

# Automatic validation before tests
npm test  # runs pretest hook with validation
```

#### Features

- **Colorized output** for easy reading
- **Progress tracking** with completion percentages  
- **Detailed error reporting** with context
- **Exit codes** for CI/CD integration (0 = success, 1 = issues found)
- **Multi-language support** for all 7 supported languages

## Supported Languages

| Language | Code | Status | Completeness |
|----------|------|--------|--------------|
| English | `en` | ✅ Reference | 100% (235/235) |
| Spanish | `es` | ✅ Complete | 100% (235/235) |
| French | `fr` | ✅ Complete | 100% (235/235) |
| German | `de` | ✅ Complete | 100% (235/235) |
| Italian | `it` | ✅ Complete | 100% (235/235) |
| Portuguese | `pt` | ✅ Complete | 100% (235/235) |
| Arabic | `ar` | ✅ Complete | 100% (235/235) |

## Translation Namespaces

- **`api`** (21 keys) - API response messages
- **`auth`** (21 keys) - Authentication messages  
- **`business`** (107 keys) - Business logic messages
- **`common`** (21 keys) - Common UI messages
- **`email`** (17 keys) - Email templates
- **`home`** (27 keys) - Home page content
- **`validation`** (21 keys) - Form validation messages

---

**Last Updated**: January 2025  
**Total Translation Keys**: 235 per language  
**Total Translations**: 1,645 (235 × 7 languages)  
**Completion Status**: 100% ✅