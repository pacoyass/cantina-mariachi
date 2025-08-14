import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from "./routes/index.routes.js";
import { registerCronJobs } from "./cron/index.js";
import { LoggerService } from "./utils/logger.js";
import { createError } from "./utils/response.js";
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config();

export const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    const origins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!origins.length) return cb(null, true);
    if (!origin) return cb(null, true);
    return cb(null, origins.includes(origin));
  },
  credentials: true,
}));

if (process.env.ENABLE_EXPRESS_SESSION === 'true') {
  app.use(session({
    secret: process.env.SESSION_SECRET || process.env.COOKIE_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax' },
  }));
}
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
if (process.env.ALLOW_URLENCODED === '1') {
  app.use(express.urlencoded({ extended: true, limit: process.env.JSON_BODY_LIMIT || '1mb' }));
}
app.use( cookieParser( process.env.COOKIE_SECRET || 'your-fallback-secret' ) );

// Serve API docs BEFORE /api router so 404 handler does not intercept
try {
  const { fileURLToPath } = await import('node:url');
  const { dirname, join } = await import('node:path');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const openapiPath = join(__dirname, 'openapi.json');

  app.get('/api/openapi.json', (req, res) => {
    res.sendFile(openapiPath);
  });
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerOptions: { url: '/api/openapi.json' } }));
} catch (e) {
  console.warn('OpenAPI docs not served:', e?.message || e);
}

app.use( "/api", apiRoutes );

// ✅ Start system maintenance cron jobs (only in non-test environments)
if (process.env.NODE_ENV !== 'test') {
  registerCronJobs(); // Register all cron jobs
  console.log('✅ Registered cron jobs');
}
app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext(req,res) {
      return {
        VALUE_FROM_EXPRESS: "Hello from Express",
      };
    },
  }),
);

// General Error Handler
app.use( ( err, req, res, next ) => {
  const errorMessage = typeof err === 'string' ? err : err.message || 'Unknown server error';
  const errorStack = err.stack || 'No stack trace';
  try {
    LoggerService.logError('Unhandled server error', errorStack, {
      path: req.path,
      method: req.method,
      error: errorMessage,
      errorCode: err.code || null,
    });
  } catch {}
  return createError(res, 500, 'Internal server error', 'UNHANDLED_ERROR', { message: errorMessage, errorCode: err.code || null });
});