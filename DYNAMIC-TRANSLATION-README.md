# 🌍 Dynamic Translation System

Your translation system is now **100% dynamic** and database-driven! No more hardcoded configurations or code changes needed to add languages, namespaces, or fallback rules.

## 🚀 **What's New**

### **Before (Static)**
- ❌ Hardcoded fallback chains in code
- ❌ Static field definitions
- ❌ Fixed namespace structure
- ❌ Code changes needed for new languages

### **After (Dynamic)**
- ✅ Database-driven fallback chains
- ✅ Configurable field schemas
- ✅ Dynamic namespace management
- ✅ Admin interface for all changes

---

## 🗄️ **Database Schema**

### **New Tables Created**

#### **1. Languages Table**
```sql
CREATE TABLE "languages" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT UNIQUE,           -- e.g., 'en', 'de-CH'
  "name" TEXT,                  -- e.g., 'English', 'Swiss German'
  "rtl" BOOLEAN DEFAULT false,  -- Right-to-left support
  "fallback" TEXT,              -- e.g., 'de' for 'de-CH'
  "isActive" BOOLEAN DEFAULT true,
  "priority" INTEGER DEFAULT 0, -- Fallback ordering
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

#### **2. Namespaces Table**
```sql
CREATE TABLE "namespaces" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,                  -- e.g., 'common', 'home', 'menu'
  "locale" TEXT DEFAULT 'en',
  "description" TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

#### **3. Content Schemas Table**
```sql
CREATE TABLE "content_schemas" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT,                  -- e.g., 'home', 'about'
  "locale" TEXT DEFAULT 'en',
  "fields" JSONB,               -- Field definitions
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

#### **4. Fallback Rules Table**
```sql
CREATE TABLE "fallback_rules" (
  "id" TEXT PRIMARY KEY,
  "sourceLocale" TEXT,          -- e.g., 'de-CH'
  "targetLocale" TEXT,          -- e.g., 'de'
  "priority" INTEGER DEFAULT 0, -- Lower = higher priority
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

---

## 🔧 **API Endpoints**

### **Language Management**
```bash
# Get all languages
GET /api/cms/admin/languages

# Create new language
POST /api/cms/admin/languages
{
  "code": "ja",
  "name": "Japanese",
  "rtl": false,
  "fallback": null,
  "priority": 10
}

# Update language
PUT /api/cms/admin/languages/:id

# Delete language
DELETE /api/cms/admin/languages/:id
```

### **Namespace Management**
```bash
# Get namespaces for locale
GET /api/cms/admin/namespaces?locale=en

# Create namespace
POST /api/cms/admin/namespaces
{
  "name": "products",
  "locale": "en",
  "description": "Product-related translations"
}

# Update namespace
PUT /api/cms/admin/namespaces/:id

# Delete namespace
DELETE /api/cms/admin/namespaces/:id
```

### **Content Schema Management**
```bash
# Get schemas
GET /api/cms/admin/schemas?slug=home&locale=en

# Create schema
POST /api/cms/admin/schemas
{
  "slug": "products",
  "locale": "en",
  "fields": {
    "hero": ["title", "description", "image"],
    "features": ["title", "items"],
    "pricing": ["title", "plans"]
  }
}

# Update schema
PUT /api/cms/admin/schemas/:id

# Delete schema
DELETE /api/cms/admin/schemas/:id
```

### **Fallback Rules Management**
```bash
# Get fallback rules
GET /api/cms/admin/fallback-rules?sourceLocale=de-CH

# Create fallback rule
POST /api/cms/admin/fallback-rules
{
  "sourceLocale": "de-CH",
  "targetLocale": "de",
  "priority": 0
}

# Update fallback rule
PUT /api/cms/admin/fallback-rules/:id

# Delete fallback rule
DELETE /api/cms/admin/fallback-rules/:id
```

### **Initialize System**
```bash
# Initialize with default data
POST /api/cms/admin/initialize
```

---

## 🚀 **How It Works**

### **1. Dynamic Fallback Chains**
```javascript
// Before: Hardcoded in code
function buildFallbackChain(locale) {
  const chain = [locale];
  if (locale.includes('-')) {
    const baseLang = locale.split('-')[0];
    chain.push(baseLang);
  }
  if (locale !== 'en') chain.push('en');
  return chain;
}

// After: Database-driven
async function buildDynamicFallbackChain(locale) {
  const fallbackRules = await prisma.fallbackRule.findMany({
    where: { sourceLocale: locale, isActive: true },
    orderBy: { priority: 'asc' }
  });
  
  const chain = [locale];
  fallbackRules.forEach(rule => {
    if (!chain.includes(rule.targetLocale)) {
      chain.push(rule.targetLocale);
    }
  });
  
  if (!chain.includes('en')) chain.push('en');
  return chain;
}
```

### **2. Dynamic Field Schemas**
```javascript
// Before: Hardcoded fields
function ensureRequiredFields(content, locale) {
  return {
    hero: {
      badge: content?.hero?.badge || defaultContent.hero.badge,
      title: content?.hero?.title || defaultContent.hero.title,
      // ... hardcoded fields
    }
  };
}

// After: Database-driven schemas
async function ensureDynamicRequiredFields(content, locale, slug) {
  const schema = await DynamicTranslationService.getDynamicSchema(slug, locale);
  const resolved = { ...content };
  
  for (const [section, fields] of Object.entries(schema)) {
    if (Array.isArray(fields)) {
      if (!resolved[section]) resolved[section] = {};
      for (const field of fields) {
        if (resolved[section][field] === null || resolved[section][field] === undefined) {
          resolved[section][field] = defaultContent[section]?.[field] || null;
        }
      }
    }
  }
  
  return resolved;
}
```

### **3. Dynamic i18n Configuration**
```javascript
// Before: Static config
const config = {
  supportedLngs: ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'],
  rtlLngs: ['ar'],
  ns: ['common', 'auth', 'api', 'validation', 'email', 'business', 'home']
};

// After: Database-driven config
async function getDynamicI18nConfig() {
  const [languages, namespaces, rtlLanguages] = await Promise.all([
    DynamicTranslationService.getSupportedLanguages(),
    DynamicTranslationService.getActiveNamespaces(),
    DynamicTranslationService.getRtlLanguages()
  ]);

  return {
    supportedLngs: languages.map(l => l.code),
    rtlLngs: rtlLanguages,
    ns: namespaces
  };
}
```

---

## 🎯 **Usage Examples**

### **Adding a New Language**
```bash
# 1. Create language record
curl -X POST /api/cms/admin/languages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ja",
    "name": "Japanese",
    "rtl": false,
    "priority": 10
  }'

# 2. Create fallback rule (optional)
curl -X POST /api/cms/admin/fallback-rules \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceLocale": "ja",
    "targetLocale": "en",
    "priority": 0
  }'

# 3. Add namespaces for Japanese
curl -X POST /api/cms/admin/namespaces \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "common",
    "locale": "ja",
    "description": "Common Japanese translations"
  }'
```

### **Adding New Content Fields**
```bash
# 1. Update content schema
curl -X PUT /api/cms/admin/schemas/SCHEMA_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "hero": ["badge", "title", "desc", "image", "imageAlt", "newField"],
      "cta": ["limited", "title", "desc", "endsTonight", "socialProof", "start", "reserve"],
      "features": ["title", "items", "newSection"]
    }
  }'

# 2. Add content for new fields
curl -X PUT /api/cms/home \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locale": "en",
    "data": {
      "hero": {
        "newField": "This is a new field!"
      },
      "features": {
        "newSection": "New section content"
      }
    }
  }'
```

---

## 🔄 **Migration from Static to Dynamic**

### **Step 1: Run Database Migration**
```bash
# Apply the new schema
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### **Step 2: Initialize Default Data**
```bash
# Initialize with default configuration
curl -X POST /api/cms/admin/initialize \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Step 3: Verify System**
```bash
# Check if dynamic config is working
curl /api/cms/admin/languages
curl /api/cms/admin/namespaces
curl /api/cms/admin/schemas
```

---

## 🎉 **Benefits**

| Feature | Before | After |
|---------|--------|-------|
| **Add Language** | Code change + deploy | Admin interface |
| **Change Fallbacks** | Code change + deploy | Admin interface |
| **Add Fields** | Code change + deploy | Admin interface |
| **Namespace Mgmt** | Code change + deploy | Admin interface |
| **Content Types** | Hardcoded | Database-driven |
| **Fallback Rules** | Fixed logic | Configurable |
| **Schema Evolution** | Requires code | Database updates |

---

## 🚨 **Fallback Behavior**

The system gracefully falls back to static configuration if:
- Database is unavailable
- Dynamic configuration fails to load
- Required tables don't exist

This ensures your application continues to work even during database issues.

---

## 🔮 **Future Enhancements**

- [ ] Web-based admin interface
- [ ] Translation memory integration
- [ ] Automated fallback optimization
- [ ] Performance analytics
- [ ] A/B testing for translations

---

## 📚 **API Documentation**

Full API documentation is available at `/api/docs` when running the application.

---

**🎯 Your translation system is now completely dynamic and future-proof!**