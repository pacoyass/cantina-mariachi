# 🚀 Start PostgreSQL - Quick Guide

## ❌ Current Error
```
Can't reach database server at `localhost:5432`
```

## ✅ Solutions (Choose One)

---

### **Option 1: Docker (Easiest & Recommended)** ⭐

```bash
# Start PostgreSQL in Docker
docker run --name cantina-postgres \
  -e POSTGRES_DB=cantina_mariachi \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15

# Verify it's running
docker ps | grep cantina-postgres

# Should show:
# cantina-postgres ... Up ... 0.0.0.0:5432->5432/tcp

# Then run migration and import
npx prisma migrate deploy
npm run translations:import
```

**If it says "port already in use":**
```bash
# Check what's using port 5432
sudo lsof -i :5432

# Or use a different port
docker run --name cantina-postgres \
  -e POSTGRES_DB=cantina_mariachi \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5433:5432 \
  -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/cantina_mariachi?schema=public"
```

---

### **Option 2: System PostgreSQL (If Already Installed)**

#### **Ubuntu/Debian:**
```bash
# Check if PostgreSQL is installed
which psql

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql

# Create database
sudo -u postgres psql << EOF
CREATE DATABASE cantina_mariachi;
ALTER USER postgres WITH PASSWORD 'postgres';
EOF

# Test connection
psql -h localhost -U postgres -d cantina_mariachi -c "SELECT 1;"

# Then run migration and import
npx prisma migrate deploy
npm run translations:import
```

#### **macOS:**
```bash
# If installed via Homebrew
brew services start postgresql@15

# Or
brew services start postgresql

# Create database
createdb cantina_mariachi

# Test connection
psql -h localhost -U postgres -d cantina_mariachi -c "SELECT 1;"

# Then run migration and import
npx prisma migrate deploy
npm run translations:import
```

---

### **Option 3: Install PostgreSQL (If Not Installed)**

#### **Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql -c "CREATE DATABASE cantina_mariachi;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Allow password authentication
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Change "peer" to "md5" for local connections
# Then restart:
sudo systemctl restart postgresql

# Then run migration and import
npx prisma migrate deploy
npm run translations:import
```

#### **macOS:**
```bash
# Install via Homebrew
brew install postgresql@15

# Start service
brew services start postgresql@15

# Create database
createdb cantina_mariachi

# Then run migration and import
npx prisma migrate deploy
npm run translations:import
```

---

### **Option 4: Cloud Database (Supabase, AWS RDS, etc.)**

#### **Supabase (Free Tier):**

1. Go to https://supabase.com
2. Create account and new project
3. Get connection string from Settings → Database
4. Update `.env`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"
```

5. Run migration and import:
```bash
npx prisma migrate deploy
npm run translations:import
```

#### **Railway.app (Free Tier):**

1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy the DATABASE_URL
4. Update `.env` with your Railway DATABASE_URL
5. Run migration and import

---

## 🧪 Verify PostgreSQL is Running

```bash
# Test connection
nc -zv localhost 5432

# Should show:
# Connection to localhost port 5432 [tcp/postgresql] succeeded!

# Or use psql
psql -h localhost -U postgres -d cantina_mariachi -c "SELECT version();"

# Or check with Docker
docker ps | grep postgres
```

---

## ⚡ Quick Test After Starting

```bash
# 1. Check database connection
npx prisma db pull

# 2. Apply migration
npx prisma migrate deploy

# 3. Import translations
npm run translations:import

# Expected output:
# 🌐 Processing locale: en (13 files)
#   ✅ Imported: 199, Skipped: 0  ← Should say "Imported"!
```

---

## 🐛 Troubleshooting

### **Error: "role postgres does not exist"**

```bash
# Create postgres user
sudo -u postgres createuser -s postgres

# Or in psql:
sudo -u postgres psql -c "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';"
```

### **Error: "database cantina_mariachi does not exist"**

```bash
# Create database
sudo -u postgres psql -c "CREATE DATABASE cantina_mariachi;"

# Or:
createdb cantina_mariachi
```

### **Error: "password authentication failed"**

```bash
# Reset password
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Or update .env to match your password
```

### **Error: "port 5432 already in use"**

```bash
# Check what's using it
sudo lsof -i :5432

# Stop the service or use different port (see Docker option above)
```

---

## 📋 Complete Setup Checklist

- [ ] PostgreSQL is running (check with `nc -zv localhost 5432`)
- [ ] Database `cantina_mariachi` exists
- [ ] User `postgres` with password `postgres` exists
- [ ] `.env` file has correct DATABASE_URL
- [ ] Can connect: `psql -h localhost -U postgres -d cantina_mariachi`
- [ ] Migration applied: `npx prisma migrate deploy`
- [ ] Import translations: `npm run translations:import`

---

## 🎯 Recommended: Docker

**Why Docker is best for development:**
- ✅ No system PostgreSQL conflicts
- ✅ Easy to start/stop/reset
- ✅ Same setup on all machines
- ✅ Isolated from other projects

**Docker Commands:**
```bash
# Start
docker start cantina-postgres

# Stop
docker stop cantina-postgres

# Remove (to start fresh)
docker rm -f cantina-postgres

# View logs
docker logs cantina-postgres

# Access psql
docker exec -it cantina-postgres psql -U postgres -d cantina_mariachi
```

---

**Choose one option above and let me know if you need help!** 🚀
