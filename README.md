# Cantina Mariachi - Mexican Restaurant Website

A modern, responsive website for Cantina Mariachi, an authentic Mexican restaurant located in Casablanca, Morocco. Built with React Router, Node.js, Prisma, and PostgreSQL.

## 🌮 Features

### Frontend
- **Modern React Router Setup**: Using the latest React Router v7 with custom server
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
- **Contact Forms**: Message handling with email notifications
- **Newsletter**: Subscription management system

### Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Prisma ORM**: Type-safe database operations
- **Email Integration**: Nodemailer for notifications
- **Security**: Helmet.js, CORS, input validation
- **Modern CSS**: Custom animations, gradients, and Mexican-themed styling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- SMTP email service (Gmail, etc.)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cantina-mariachi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cantina_mariachi?schema=public"

# PASETO keys (required for auth)
# These are required for login/token flows. In development/tests, the server will start but token operations will fail until configured.
PASETO_PRIVATE_KEY="<your-private-key>"
PASETO_PUBLIC_KEY="<your-public-key>"

# Optional retention windows (days)
AUTH_DATA_RETENTION_DAYS=30
USER_DATA_RETENTION_DAYS=90
WEBHOOK_RETENTION_DAYS=30

# Server Configuration
NODE_ENV="development"
PORT=3000
SESSION_SECRET="replace-with-strong-secret"
COOKIE_SECRET="replace-with-strong-cookie-secret"
REDIS_URL="redis://localhost:6379"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with menu data
npx prisma db seed
```

### 5. Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
cantina-mariachi/
├── app/
│   ├── components/          # Reusable React components
│   │   ├── Navigation.tsx   # Main navigation
│   │   └── Footer.tsx       # Site footer
│   ├── routes/              # Page components
│   │   ├── home.tsx         # Homepage
│   │   ├── menu.tsx         # Menu page
│   │   ├── order.tsx        # Online ordering
│   │   ├── reservations.tsx # Table booking
│   │   ├── about.tsx        # About us
│   │   └── contact.tsx      # Contact page
│   ├── app.css             # Global styles
│   ├── root.tsx            # Root layout
│   └── routes.ts           # Route configuration
├── server/
│   ├── routes/             # API endpoints
│   ├── controllers/        # Controllers
│   ├── services/           # Services
│   ├── middleware/         # Middleware
│   ├── config/             # Config (database, retention)
│   └── utils/              # Helpers (logger, response)
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Database seeding
├── public/                 # Static assets
└── server.js               # Server entry point
```

## 🔧 API Endpoints

### Auth
- `GET /api/auth/sessions` — List refresh token sessions for the current user
  - Query params: `page` (default 1), `pageSize` (default 20, max 100)
  - Response: `{ sessions, page, pageSize, hasMore }`

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderNumber` - Get order details (requires auth)
- `PATCH /api/orders/:orderNumber/status` - Update order status

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/availability/:date` - Check availability

## 🔐 Security & Retention
- Access tokens are blacklisted on logout and enforced by middleware.
- Cleanup jobs use retention windows (configurable via env):
  - `AUTH_DATA_RETENTION_DAYS` for auth tokens
  - `USER_DATA_RETENTION_DAYS` for user-related logs/data
  - `WEBHOOK_RETENTION_DAYS` for webhooks/logs

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Update your `.env` file with production values and PASETO keys.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ for authentic Mexican cuisine in Casablanca 🌮

## API reference (selected)

- Auth: POST /api/auth/login, POST /api/auth/register, GET /api/auth/sessions, DELETE /api/auth/sessions/:id
- Menu: GET /api/menu/categories, GET /api/menu/items, POST/PUT/DELETE /api/menu/* (ADMIN/OWNER)
- Orders: POST /api/orders, GET /api/orders/:orderNumber, GET /api/orders/track/by?orderNumber=&code=, PATCH /api/orders/:orderNumber/status (staff)
- Drivers: CRUD under /api/drivers (ADMIN/OWNER), POST /api/drivers/assign
- Cash: POST /api/cash, /confirm, /verify, GET /api/cash/summary/driver/:id (ADMIN/OWNER)
- Reservations: POST /api/reservations, GET /api/reservations/availability, GET/PATCH (ADMIN/OWNER)
- Notifications: POST /api/notifications/dispatch (ADMIN/OWNER)
- Webhooks admin: POST/GET /api/webhooks, enable/disable, POST /api/webhooks/trigger

## Environment

- DATABASE_URL, REDIS_URL
- PASETO_PRIVATE_KEY, PASETO_PUBLIC_KEY (generate using `node -e "(async()=>{const {V4}=require('paseto');const kp=await V4.generateKey('public');console.log('PRIVATE=',kp.export({type:'secret'}).toString());console.log('PUBLIC=',kp.export({type:'public'}).toString());})();"`)
- SESSION_SECRET, COOKIE_SECRET
- CORS_ORIGIN (comma-separated for prod)
- JSON_BODY_LIMIT (default 1mb), ALLOW_URLENCODED (default 0)

## Session policy

- Multi-session tokens; list/revoke per-session, logout others/all supported
- Access tokens short-lived; refresh tokens rotated; blacklisting enforced

## Security

- Helmet, strict CORS in production, Redis rate limits
- Zod validation for inputs; normalized emails; minimal PII on public endpoints
- Cleanup cron jobs for tokens, logs, menu cache, orders tracking, drivers, cash, reservations, notifications
