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
import crypto from 'node:crypto';
import swaggerUi from 'swagger-ui-express';
import { doubleCsrf } from 'csrf-csrf';
import i18next, { middleware as i18nextMiddleware } from './config/i18n.js';
dotenv.config();

export const app = express();

if (process.env.NODE_ENV === 'production') {
	app.set('trust proxy', 1);
}
function generateNonce()
{
	return crypto.randomBytes( 24 ).toString( 'base64' );
}
app.use( ( req, res, next ) =>
	{
		const nonce = generateNonce();
		res.locals.nonce = nonce; // Attach the nonce to the response object
	
		next();
	} );
// // Helmet security headers

helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        (req, res) => `'nonce-${res.locals.nonce}'`,
        "'strict-dynamic'",
        process.env.NODE_ENV !== 'production' ? "'unsafe-inline'" : null,
      ].filter(Boolean),
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      styleSrcElem: [
        "'self'",
        "https://fonts.googleapis.com",
        (req, res) => `'nonce-${res.locals.nonce}'`,
      ],
      styleSrcAttr: ["'unsafe-inline'"], // <-- allow style="" attributes
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", process.env.NODE_ENV !== 'production' ? 'ws://localhost:24678' : null].filter(Boolean),
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? ["upgrade-insecure-requests"] : [],
    },
  },
  frameguard: false,
})
app.use( helmet.hsts( {
	maxAge: 31536000,
	includeSubDomains: true,
	preload: true
} ) );
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

// Add i18next middleware for translation support
// Check if i18next is properly initialized before using middleware
if (i18next && i18next.isInitialized) {
  app.use(i18nextMiddleware.handle(i18next));
  console.log('✅ i18next middleware enabled');
} else {
  console.warn('⚠️ i18next not initialized, skipping middleware');
}

// Import and add translation helpers to request object
const { addTranslationHelpers } = await import('./utils/translation.js');
app.use(addTranslationHelpers);

// Serve API docs BEFORE /api router so 404 handler does not intercept
try {
	const { fileURLToPath } = await import('node:url');
	const { dirname, join } = await import('node:path');
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const openapiPath = join(__dirname, 'openapi.json');

	// Override CSP for Swagger UI (allows inline init scripts/styles)
	app.use('/api/docs', helmet({
		contentSecurityPolicy: {
			useDefaults: true,
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", "'unsafe-inline'"],
				styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
				fontSrc: ["'self'", "https://fonts.gstatic.com"],
			}
		}
	}));

	app.get('/api/openapi.json', (req, res) => {
		res.sendFile(openapiPath);
	});
	app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerOptions: { url: '/api/openapi.json' } }));
} catch (e) {
	console.warn('OpenAPI docs not served:', e?.message || e);
}
const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf( {
	getSecret: () => process.env.CSRF_SECRET || 'your-fallback-secret',
	getSessionIdentifier: (req) => req.session?.id || req.signedCookies?.csrfSession || req.headers['x-session-id'] || req.ip,
	cookieName: "__Host-csrf-token",
	cookieOptions: {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		signed: true,
		expires: new Date( Date.now() + 24 * 60 * 60 * 1000 ),
		maxAge: 24 * 60 * 60 * 1000,

	},
	size: 128,
	ignoredMethods: ["GET", "HEAD", "OPTIONS"],
	getTokenFromRequest: ( req ) => req.headers["x-csrf-token"],
	isThrowingErrors: false,
} );
app.use( ( req, res, next ) =>
	{
		const csrf = generateCsrfToken( req, res );
		res.locals.csrfToken = csrf; // Attach the nonce to the response object
	
		next();
	} );

	// Example protected route
app.post( '/protected-route', doubleCsrfProtection, ( req, res ) =>
	{
		res.json( { message: 'This route is protected by CSRF' } );
	} );
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
        nonce: res.locals.nonce,
        csrfToken: res.locals.csrfToken,
        lng: req.language || req.lng || 'en'
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
	return createError(res, 500, 'internalError', 'UNHANDLED_ERROR', { message: errorMessage, errorCode: err.code || null }, req);
} );