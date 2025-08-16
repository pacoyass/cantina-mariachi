# Translation System for Express Backend

This guide explains how to use the **i18next-based translation system** that has been implemented in your Express backend.

## 📦 Packages Used

- **`i18next`** - Core internationalization framework
- **`i18next-http-middleware`** - Express middleware for i18next
- **`i18next-fs-backend`** - File system backend for translations

## 🏗️ Architecture Overview

The translation system consists of:

1. **Configuration** (`/server/config/i18n.js`) - i18next setup and configuration
2. **Translation Files** (`/server/locales/`) - JSON files containing translations
3. **Utilities** (`/server/utils/translation.js`) - Helper functions and middleware
4. **Enhanced Response Utils** (`/server/utils/response.js`) - Translation-aware response functions

## 🌍 Supported Languages

Currently configured languages:
- **English (en)** - Default/Fallback language
- **Spanish (es)** - Full translations provided
- **French (fr)** - Ready for translation files
- **German (de)** - Ready for translation files
- **Italian (it)** - Ready for translation files
- **Portuguese (pt)** - Ready for translation files
- **Arabic (ar)** - Ready for translation files

## 📁 File Structure

```
server/
├── config/
│   └── i18n.js                 # i18next configuration
├── locales/
│   ├── en/                     # English translations
│   │   ├── common.json         # General purpose translations
│   │   ├── auth.json           # Authentication messages
│   │   ├── api.json            # API responses
│   │   ├── validation.json     # Validation errors
│   │   └── email.json          # Email templates
│   ├── es/                     # Spanish translations
│   └── [other languages]/
├── utils/
│   ├── translation.js          # Translation utilities
│   └── response.js             # Enhanced response functions
└── examples/
    └── translation-usage.js    # Usage examples
```

## 🚀 How Language Detection Works

The system detects language in this order:
1. **Accept-Language Header** (browser/client preference)
2. **Query Parameter** (`?lng=es`)
3. **Cookie** (persistent language preference)
4. **Session** (if express-session is enabled)
5. **Fallback to English** if none detected

## 📝 Basic Usage in Controllers

### Simple Translation
```javascript
// In your controller
export const getUsersController = (req, res) => {
  // Using request helper (req.t is automatically added)
  const message = req.t('success'); // Gets "Success" or "Éxito" based on language
  
  return createResponse(res, 200, 'dataRetrieved', { users: [] }, req);
};
```

### Namespace-specific Translation
```javascript
// Authentication messages
const authMessage = req.tAuth('loginSuccess'); // From auth.json
const validationMsg = req.tValidation('required', { field: 'Email' }); // From validation.json
```

### Using TranslationService Directly
```javascript
import TranslationService from '../utils/translation.js';

// Get translation for specific language
const message = TranslationService.t('common:success', { lng: 'es' });

// With interpolation
const error = TranslationService.tValidation('minLength', 'en', { 
  field: 'Password', 
  min: 8 
});
```

## 🔥 Enhanced Response Functions

All response functions now support automatic translation:

```javascript
import { createResponse, createError, createAuthError, createValidationError } from '../utils/response.js';

// Success response with translation
return createResponse(res, 200, 'success', { data }, req);

// Error with translation key
return createError(res, 404, 'resourceNotFound', 'NOT_FOUND', {}, req);

// Authentication error
return createAuthError(res, 'invalidCredentials', req);

// Validation errors with field-specific messages
return createValidationError(res, [
  { field: 'email', type: 'required', interpolation: { field: 'Email' } }
], req);
```

## 🎯 Translation Keys and Interpolation

### Simple Keys
```javascript
req.t('success')                    // → "Success" / "Éxito"
req.t('common:notFound')           // → "Not found" / "No encontrado"
```

### With Interpolation
```javascript
req.tValidation('required', { field: 'Email' })        // → "Email is required"
req.tValidation('minLength', { field: 'Password', min: 8 }) // → "Password must be at least 8 characters long"
```

### Email Templates
```javascript
TranslationService.tEmail('subject.welcome', 'en', { appName: 'MyApp' })
// → "Welcome to MyApp"
```

## 🛠️ Client-Side Language Switching

### Setting Language via Query Parameter
```bash
GET /api/users?lng=es
```

### Setting Language via Header
```bash
curl -H "Accept-Language: es" /api/users
```

### Setting Language via Cookie
The system automatically saves language preference in a cookie for future requests.

## 📧 Email Translation Example

```javascript
import TranslationService from '../utils/translation.js';

export const sendWelcomeEmail = async (user, language = 'en') => {
  const subject = TranslationService.tEmail('subject.welcome', language, { 
    appName: 'MyApp' 
  });
  
  const greeting = TranslationService.tEmail('greeting', language, { 
    name: user.name 
  });
  
  // Send email with translated content
  await emailService.send({
    to: user.email,
    subject,
    body: greeting
  });
};
```

## 🔧 Adding New Languages

1. **Create directory**: `mkdir server/locales/[language-code]`
2. **Copy English files**: Copy all `.json` files from `en/` folder
3. **Translate content**: Replace English text with translations
4. **Update config**: Add language to `supportedLngs` in `i18n.js`

Example for Italian:
```bash
mkdir server/locales/it
cp server/locales/en/*.json server/locales/it/
# Edit the .json files with Italian translations
```

## 🎨 Adding New Translation Keys

### 1. Add to English files first
```json
// server/locales/en/common.json
{
  "newFeature": "New feature activated",
  "customMessage": "Hello {{name}}, you have {{count}} messages"
}
```

### 2. Add to other language files
```json
// server/locales/es/common.json
{
  "newFeature": "Nueva función activada",
  "customMessage": "Hola {{name}}, tienes {{count}} mensajes"
}
```

### 3. Use in your code
```javascript
req.t('newFeature')
req.t('customMessage', { name: 'John', count: 5 })
```

## 🧪 Testing Translations

```javascript
// Test different languages
const englishMessage = TranslationService.t('common:success', { lng: 'en' });
const spanishMessage = TranslationService.t('common:success', { lng: 'es' });

console.log(englishMessage); // "Success"
console.log(spanishMessage); // "Éxito"
```

## ⚙️ Configuration Options

The system is configured in `/server/config/i18n.js`. Key options:

- **`fallbackLng`**: Default language (currently: 'en')
- **`supportedLngs`**: Array of supported languages
- **`debug`**: Enable debug mode in development
- **`detection.order`**: Language detection priority
- **`ns`**: Available namespaces (common, auth, api, validation, email)

## 🚨 Error Handling

The translation system gracefully handles missing translations:

1. **Missing key**: Returns the key itself as fallback
2. **Missing language**: Falls back to English
3. **Missing namespace**: Uses default namespace
4. **Interpolation errors**: Logs warning and continues

## 💡 Pro Tips

1. **Use namespaces** to organize translations logically
2. **Always provide English translations** as fallback
3. **Use interpolation** for dynamic content
4. **Test with different languages** during development
5. **Consider RTL languages** (Arabic) for UI components
6. **Cache translations** are automatically handled by i18next

## 🔗 Integration with Frontend

If you're using React Router (as seen in your setup), you can:

1. **Share translation files** between backend and frontend
2. **Use same language detection** logic
3. **Sync language preferences** via cookies/localStorage
4. **Create API endpoint** to fetch translations for frontend

Example API endpoint for frontend translations:
```javascript
app.get('/api/translations/:namespace', (req, res) => {
  const { namespace } = req.params;
  const language = TranslationService.getCurrentLanguage(req);
  
  // Return all translations for namespace
  const translations = getTranslationsForNamespace(namespace, language);
  return createResponse(res, 200, 'dataRetrieved', { translations }, req);
});
```

This translation system provides a robust, scalable solution for internationalizing your Express backend! 🌟