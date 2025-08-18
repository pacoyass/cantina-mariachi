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

#### Example Output

```
🌐 Translation Validation Report
==================================================

Reference Language: EN
Languages Found: ar, de, en, es, fr, it, pt
Namespaces: api, auth, business, common, email, home, validation

📋 Language: FR
------------------------------
✅ api.json: Complete (21 keys)
✅ auth.json: Complete (21 keys)
✅ business.json: Complete (107 keys)
✅ common.json: Complete (21 keys)
✅ email.json: Complete (17 keys)
✅ home.json: Complete (27 keys)
✅ validation.json: Complete (21 keys)
📊 Summary: 100% complete (0/235 keys missing)

📈 Overall Summary
==================================================
✅ FR: 100% complete (0 missing keys, 0 issues)

🎉 All translations are complete!
```

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

## Best Practices

### Adding New Translations

1. **Add to English first** (`server/locales/en/`)
2. **Use consistent key naming**: `section.subsection.key`
3. **Include interpolation**: Use `{{variable}}` for dynamic content
4. **Validate immediately**: Run `npm run i18n:validate`
5. **Update all languages** to maintain 100% coverage

### Key Naming Conventions

```json
{
  "menu": {
    "itemCreated": "Menu item created successfully",
    "itemNotFound": "Menu item not found",
    "itemTotal": "Total: {{amount}}"
  }
}
```

### Interpolation Examples

```javascript
// Backend usage
req.t('orders.estimatedDelivery', { time: 30 }, 'business')
// Output: "Estimated delivery time: 30 minutes"

// With TranslationService
TranslationService.t('business:orders.orderTotal', { 
  lng: 'es', 
  interpolation: { amount: '$25.99' } 
})
// Output: "Total del pedido: $25.99"
```

## CI/CD Integration

The validation script is integrated into the build process:

```json
{
  "scripts": {
    "pretest": "npm run i18n:validate",
    "i18n:validate": "node scripts/validate-translations.js",
    "i18n:check": "npm run i18n:validate"
  }
}
```

This ensures:
- ✅ **No broken builds** due to missing translations
- ✅ **Consistent quality** across all languages
- ✅ **Early detection** of translation issues
- ✅ **Automated validation** in CI pipelines

## Troubleshooting

### Common Issues

1. **Missing Keys**: Add missing translations to match English reference
2. **JSON Syntax Errors**: Validate JSON format with proper escaping
3. **Encoding Issues**: Ensure UTF-8 encoding for all files
4. **Interpolation Mismatches**: Keep `{{variable}}` placeholders consistent

### Debug Mode

For detailed debugging, modify the script to show more context:

```javascript
// In validate-translations.js, increase context
const keysToShow = comparison.missingKeys.slice(0, 10); // Show more keys
```

## File Structure

```
server/locales/
├── en/           # Reference language (English)
├── es/           # Spanish (Español)  
├── fr/           # French (Français)
├── de/           # German (Deutsch)
├── it/           # Italian (Italiano)
├── pt/           # Portuguese (Português)
└── ar/           # Arabic (العربية)
    ├── api.json
    ├── auth.json
    ├── business.json
    ├── common.json
    ├── email.json
    ├── home.json
    └── validation.json
```

---

**Last Updated**: January 2025  
**Total Translation Keys**: 235 per language  
**Total Translations**: 1,645 (235 × 7 languages)  
**Completion Status**: 100% ✅