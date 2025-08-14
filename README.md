# Cantina Mariachi - Mexican Restaurant Website

A modern, responsive website for Cantina Mariachi, an authentic Mexican restaurant located in Casablanca, Morocco. Built with React Router, Node.js, Prisma, and PostgreSQL.

## 🌮 Features

### Frontend
- **Modern React Router Setup**: Using the latest React Router v7 with a custom Node server
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Mexican-Themed UI**: Vibrant colors, custom fonts (Fredoka), and festive styling
- **SEO Optimized**: Proper meta tags, structured data, and semantic HTML

### Core Pages
- **Home**: Hero section, featured dishes, testimonials, and prominent CTAs
- **Menu**: Organized categories, dietary badges, spice indicators, and filtering
- **Order Online**: Shopping cart, order types (takeout/delivery), customer forms
- **Reservations**: Table booking system with time slot availability
- **About Us**: Restaurant story, mission, and cultural experience
- **Contact**: Contact form, location info, hours, and map integration

### Backend Features
- **Express.js Server**: Custom server with API routes
- **PostgreSQL Database**: Robust data storage with Prisma ORM
- **Order Management**: Complete order processing and tracking
- **Reservation System**: Table booking with availability checking
- **Notifications & Webhooks**: Dispatch notifications and manage outgoing webhooks

### Technical Features
- **JavaScript (ESM)** across frontend and backend
- **Prisma ORM**: Type-safe database operations
- **Email/Providers Ready**: Nodemailer/Twilio/TBD (providers are optional)
- **Security**: Helmet, strict CORS in production, zod input validation, Redis-backed rate limits

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis (recommended for rate limiting; app falls back gracefully in dev/tests)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cantina-mariachi
```

### 2. Install Dependencies
```bash
npm ci
```

### 3. Environment Setup
Create a `.env` file in the repo root (see `.env.example` for the full list):

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cantina_mariachi?schema=public"

# PASETO keys (required for auth)
PASETO_PRIVATE_KEY="<your-private-key>"
PASETO_PUBLIC_KEY="<your-public-key>"

# Retention windows (days)
AUTH_DATA_RETENTION_DAYS=30
USER_DATA_RETENTION_DAYS=90
WEBHOOK_RETENTION_DAYS=30

# Server Configuration
NODE_ENV=development
PORT=3333
COOKIE_SECRET="replace-with-strong-cookie-secret"
SESSION_SECRET="replace-with-strong-secret"
ENABLE_EXPRESS_SESSION=false
REDIS_URL="redis://localhost:6379"
CORS_ORIGIN="http://localhost:3333,http://localhost:5173"
```

Tip: generate PASETO keys (example):
```bash
node -e "(async()=>{const {V4}=require('paseto');const kp=await V4.generateKey('public');console.log('PRIVATE=',kp.export({type:'secret'}).toString());console.log('PUBLIC=',kp.export({type:'public'}).toString());})();"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
echo "Use: npx prisma migrate dev --name init" # or migrate deploy in CI

# Seed the database (optional)
# npx prisma db seed
```

### 5. Development Server
```bash
npm run dev
```
The server selects an available port (default 3333). Open:
- App: http://localhost:3333
- API docs (Swagger UI): http://localhost:3333/api/docs
- OpenAPI JSON: http://localhost:3333/api/openapi.json

## 📁 Project Structure

```
cantina-mariachi/
├── app/                      # Frontend (React Router)
│   ├── routes/               # Page components
│   ├── root.jsx              # Root layout
│   ├── entry.client.jsx      # Client entry
│   └── entry.server.jsx      # SSR entry
├── server/                   # Backend
│   ├── routes/               # API endpoints
│   ├── controllers/          # Controllers
│   ├── services/             # Services (auth/cache/DB/webhooks)
│   ├── middleware/           # Auth, RBAC, validation, rateLimit
│   ├── config/               # Prisma client, retention
│   └── utils/                # Logger, response helpers, lock
├── prisma/                   # Prisma schema and seeds
└── server.js                 # Node server entry (dev/prod)
```

## 🔧 API Highlights

- Auth: POST /api/auth/login, POST /api/auth/register, GET /api/auth/sessions, DELETE /api/auth/sessions/:id, POST /api/auth/logout, POST /api/auth/logout-all, POST /api/auth/logout-others
- Users: GET/PUT /api/users/me, PUT /api/users/me/password
- Menu: GET /api/menu/categories, GET /api/menu/items, POST/PUT/DELETE /api/menu/* (ADMIN/OWNER)
- Orders: POST /api/orders, GET /api/orders/:orderNumber (requires auth), GET /api/orders/track/by?orderNumber=&code=, PATCH /api/orders/:orderNumber/status (staff), GET /api/orders/mine/list
- Drivers: CRUD under /api/drivers (ADMIN/OWNER), PATCH status/link-user, GET assignments, POST /api/drivers/assign
- Cash: POST /api/cash, /confirm, /verify, GET /api/cash/summary/driver/:id (ADMIN/OWNER)
- Reservations: POST /api/reservations, GET /api/reservations/availability, GET (ADMIN/OWNER), PATCH /api/reservations/:id/status, POST /api/reservations/:id/cancel
- Logs: GET /api/logs/activity, /notifications, /orders (ADMIN/OWNER)
- Notifications: POST /api/notifications/dispatch (ADMIN/OWNER)
- Webhooks admin: POST/GET /api/webhooks, POST /api/webhooks/{id}/enable, /{id}/disable, POST /api/webhooks/trigger (ADMIN/OWNER)
- Metrics: GET /api/metrics (ADMIN/OWNER)

For full details, see Swagger UI at `/api/docs`.

## 🔐 Security & Retention
- Helmet, strict production CORS with explicit allowlist
- Zod validation on inputs; minimal PII on public endpoints
- Redis-backed rate limiting with in-memory fallback
- Token blacklisting on logout; refresh rotation supported
- Cron jobs: cleanup auth data, logs retention, menu cache, order tracking, drivers, cash, reservations, notifications

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Update your `.env` with production values (DB, Redis, PASETO keys, CORS_ORIGIN). Set `ENABLE_EXPRESS_SESSION=false` unless sessions are explicitly needed.

## Environment quick list
- DATABASE_URL, REDIS_URL
- PASETO_PRIVATE_KEY, PASETO_PUBLIC_KEY
- SESSION_SECRET, COOKIE_SECRET, ENABLE_EXPRESS_SESSION
- CORS_ORIGIN (comma-separated)
- JSON_BODY_LIMIT (default 1mb), ALLOW_URLENCODED (default 0)

## Session policy
- Multi-session tokens; list/revoke per-session; logout others/all
- Access tokens short-lived; refresh tokens rotated; blacklisting enforced

## Notes
- Tests: Redis connection disabled in tests to avoid lingering handles
- Graceful shutdown flushes logs and disconnects Redis
