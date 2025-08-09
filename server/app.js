import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/index.routes.js";
import { registerCronJobs } from "./cron/index.js";
import { LoggerService } from "./utils/logger.js";
import dotenv from 'dotenv';
dotenv.config();


export const app = express();


app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true in production with HTTPS
}));
app.use(express.json());
app.use( cookieParser( process.env.COOKIE_SECRET || 'your-fallback-secret' ) );
app.use( "/api", apiRoutes );

// Global error middleware
// app.use((err, req, res, next) => {
//   const errorMessage = typeof err === 'string' ? err : err.message || err.code || 'Unknown server error';
//   const errorStack = err.stack || 'No stack trace';
//   console.error('Global error:', { error: err.toString(), errorMessage, errorStack });
//   try {
//     LoggerService.logError('Unhandled server error', errorStack, {
//       path: req.path,
//       method: req.method,
//       error: errorMessage,
//       errorCode: err.code || null,
//     });
//   } catch (logError) {
//     console.error('Failed to log global error:', logError.message);
//   }
//   return createError(res, 500, 'Internal server error', 'UNHANDLED_ERROR', { message: errorMessage, errorCode: err.code || null });
// });

// // ✅ General Error Handler
// app.use( ( err, req, res, next ) =>
//   {
//     console.error( "❌ Unhandled Error:", err.message );
//     res.status( err.status || 500 ).json( {
//       error: "Something went wrong!",
//       message: err.message,
//     } );
//   } );
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