# 🔧 Fix Translation Import Issue

## ❌ Problem

Translation import failed with:
```
Files processed: 93
Translations imported: 0
Translations skipped: 4375
```

**Root Cause:** Missing `DATABASE_URL` in `.env` file

---

## ✅ Solution (3 Steps)

### **Step 1: Set Up PostgreSQL Database**

You need a PostgreSQL database running. Choose one option:

#### **Option A: Use Existing PostgreSQL** (if you already have it)

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# If not running, start it
sudo systemctl start postgresql

# Create database
sudo -u postgres psql -c "CREATE DATABASE cantina_mariachi;"
sudo -u postgres psql -c "CREATE USER cantina_user WITH ENCRYPTED PASSWORD 'dev_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cantina_mariachi TO cantina_user;"
```

#### **Option B: Use Docker** (easiest for development)

```bash
# Run PostgreSQL in Docker
docker run --name cantina-postgres \
  -e POSTGRES_DB=cantina_mariachi \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15

# Check if it's running
docker ps | grep cantina-postgres
```

#### **Option C: Use Cloud Database**

If you're using a cloud database (AWS RDS, Supabase, etc.), skip to Step 2 and use your cloud DATABASE_URL.

---

### **Step 2: Update .env File**

I've created a `.env` file for you. **Update the DATABASE_URL** if needed:

```bash
# Edit .env file
nano .env

# Or if using vim
vim .env
```

**For Docker setup (default):**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cantina_mariachi?schema=public"
```

**For custom PostgreSQL:**
```env
DATABASE_URL="postgresql://cantina_user:dev_password@localhost:5432/cantina_mariachi?schema=public"
```

**For cloud database:**
```env
DATABASE_URL="your-cloud-database-url-here"
```

---

### **Step 3: Run Migration and Import**

Now run these commands in order:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Apply migrations (creates tables)
npx prisma migrate deploy

# 3. Verify tables were created
npx prisma studio
# Open http://localhost:5555 and check if "translations" table exists

# 4. Import translations
npm run translations:import

# Expected output:
# 🌐 Processing locale: en (13 files)
#   ✅ Imported: 199, Skipped: 0
# ...
# Translations imported: 2000+
```

---

## 🧪 Troubleshooting

### **Issue: "Error: P1001 Can't reach database server"**

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres
# OR
sudo systemctl status postgresql

# If using Docker, start it:
docker start cantina-postgres

# If using system PostgreSQL:
sudo systemctl start postgresql
```

### **Issue: "Error: P3014 database does not exist"**

**Solution:**
```bash
# Create the database
docker exec -it cantina-postgres psql -U postgres -c "CREATE DATABASE cantina_mariachi;"
# OR
sudo -u postgres psql -c "CREATE DATABASE cantina_mariachi;"
```

### **Issue: "All translations skipped (4375)"**

This means translations already exist! Check:

```bash
# Run this to see current database state
node << 'EOF'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const count = await prisma.translation.count();
console.log('Translations in DB:', count);
await prisma.$disconnect();
EOF
```

**Options:**

**A) Clear database and re-import:**
```bash
# Delete all translations
npx prisma studio
# Open http://localhost:5555
# Go to "translations" table
# Delete all records

# Then re-import
npm run translations:import
```

**B) Use the database as-is:**

If translations are already there, you're good! Just verify:

```bash
# Check admin UI
# Navigate to http://localhost:3000/dashboard/admin/translations

# Or test API
curl http://localhost:3000/api/translations/en/common
```

---

## ✅ Verification Checklist

After following the steps:

- [ ] PostgreSQL is running
- [ ] `.env` file has correct DATABASE_URL
- [ ] Migration applied successfully (`npx prisma migrate deploy`)
- [ ] Translations table exists (check in Prisma Studio)
- [ ] Import completed with "Translations imported: 2000+"
- [ ] Admin UI works: `http://localhost:3000/dashboard/admin/translations`
- [ ] API works: `curl http://localhost:3000/api/translations/en/common`

---

## 🚀 Quick Test

Run this command to verify everything works:

```bash
# Test database connection
npx prisma db pull

# Test import (dry run first)
npm run translations:import:dry-run

# If preview looks good, run actual import
npm run translations:import
```

---

## 📞 Still Having Issues?

Check these files for more help:

- `docs/POSTGRES-SETUP.md` - Detailed PostgreSQL setup
- `TRANSLATION_IMPLEMENTATION_GUIDE.md` - Complete guide
- `.env.example` - Environment variable reference

**Common DATABASE_URL formats:**

```env
# Local PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=public"

# Docker PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cantina_mariachi?schema=public"

# Supabase
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?schema=public"

# AWS RDS
DATABASE_URL="postgresql://username:password@xxxxx.rds.amazonaws.com:5432/cantina_mariachi?schema=public"

# Heroku
DATABASE_URL="postgres://username:password@ec2-xx-xx-xx-xx.compute-1.amazonaws.com:5432/dxxxx"
```

---

## 🎯 After Successful Import

Once import succeeds, you should see:

```
📊 Import Summary
=================
Files processed: 93
Translations imported: 2000+  ← ✅ This should be > 0
Translations skipped: 0

✅ Import complete!
```

Then you can:

1. Access admin UI: `http://localhost:3000/dashboard/admin/translations`
2. Test API: `curl http://localhost:3000/api/translations/en/common`
3. Start managing translations! 🎉

---

**Created:** October 21, 2025  
**Issue:** Missing DATABASE_URL  
**Fix:** Set up PostgreSQL + configure .env + run migration + import
