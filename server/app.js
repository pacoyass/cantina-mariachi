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
dotenv.config();

export const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || process.env.COOKIE_SECRET || 'dev-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax' },
}));
app.use(express.json());
app.use( cookieParser( process.env.COOKIE_SECRET || 'your-fallback-secret' ) );
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