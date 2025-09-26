# PostgreSQL Setup Guide

This project uses PostgreSQL as the database. Here's how to set it up:

## Quick Setup

### 1. Install PostgreSQL

**macOS (with Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database and User

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database and user
CREATE DATABASE cantina_mariachi;
CREATE USER cantina_user WITH ENCRYPTED PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE cantina_mariachi TO cantina_user;

# Exit PostgreSQL
\q
```

### 3. Update Environment Variables

Copy `.env.example` to `.env` and update the DATABASE_URL:

```env
DATABASE_URL="postgresql://cantina_user:your_password_here@localhost:5432/cantina_mariachi?schema=public"
```

### 4. Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Or create and run migrations
npx prisma migrate dev --name init
```

### 5. Seed Database (Optional)

```bash
npm run seed
```

## Production Setup

For production, consider:

1. **Connection Pooling**: Use pgBouncer or similar
2. **SSL**: Enable SSL connections
3. **Environment Variables**: Use managed database services (AWS RDS, Google Cloud SQL, etc.)

Example production DATABASE_URL:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public&sslmode=require"
```

## Troubleshooting

### Connection Issues

1. **Check PostgreSQL is running:**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Check port (default 5432):**
   ```bash
   sudo netstat -tulpn | grep 5432
   ```

3. **Test connection:**
   ```bash
   psql -h localhost -U cantina_user -d cantina_mariachi
   ```

### Permission Issues

If you get permission errors, make sure the user has proper grants:

```sql
GRANT ALL PRIVILEGES ON DATABASE cantina_mariachi TO cantina_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO cantina_user;
```

### Migration Issues

If migrations fail, you can reset:

```bash
# Reset database (CAUTION: This deletes all data)
npx prisma migrate reset

# Or push schema directly
npx prisma db push
```

## Docker Setup (Alternative)

If you prefer Docker:

```bash
# Run PostgreSQL in Docker
docker run --name cantina-postgres \
  -e POSTGRES_DB=cantina_mariachi \
  -e POSTGRES_USER=cantina_user \
  -e POSTGRES_PASSWORD=your_password_here \
  -p 5432:5432 \
  -d postgres:15

# Then use this DATABASE_URL:
# DATABASE_URL="postgresql://cantina_user:your_password_here@localhost:5432/cantina_mariachi?schema=public"
```