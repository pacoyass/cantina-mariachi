


import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import net from 'net';
import dotenv from 'dotenv';
dotenv.config();

import { LoggerService } from './server/utils/logger.js';
import cacheService from './server/services/cacheService.js';
import cookieParser from 'cookie-parser';
import apiRoutes from './server/routes/index.routes.js';

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const BASE_PORT = Number.parseInt(process.env.PORT || '3333');

const app = express();

app.use(
  compression({
    threshold: 1024,
    level: 6,
    filter: (req, res) => {
      const contentType = res.getHeader('Content-Type');
      return contentType && /json|html|text|javascript|css/.test(contentType);
    },
    chunkSize: 16 * 1024,
  })
);
app.disable('x-powered-by');

async function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function findAvailablePortInRange(start, end) {
  for (let port = start; port <= end; port++) {
    try {
      return await findAvailablePort(port);
    } catch (e) {
      // Skip if port is in use
    }
  }
  throw new Error(`No available ports between ${start} and ${end}`);
}

if (DEVELOPMENT) {
  console.log('Starting development server');
  const hmrPort = await findAvailablePortInRange(24678, 25700);
  const viteDevServer = await import('vite').then((vite) =>
    vite.createServer({
      server: {
        middlewareMode: true,
        hmr: {
          port: hmrPort,
        },
      },
    })
  );
  app.use(viteDevServer.middlewares);
  
  // Add basic middleware for development
  app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
  if (process.env.ALLOW_URLENCODED === '1') {
    app.use(express.urlencoded({ extended: true, limit: process.env.JSON_BODY_LIMIT || '1mb' }));
  }
  
  // Configure cookie parser for development
  const cookieSecret = process.env.COOKIE_SECRET || 'your-fallback-secret';
  app.use(cookieParser(cookieSecret));
  
  // Add basic API routes for development
  app.use("/api", apiRoutes);
  
  // In development mode, let Vite handle all frontend routes
  // This is simpler and avoids the React Router SSR complexity
  app.use(async (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    // Temporarily bypass React Router SSR in development to isolate the issue
    // Serve a simple HTML page that loads the client-side React app
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="server-start-time" content="${Date.now().toString()}">
          <title>Cantina App</title>
        </head>
        <body>
          <div id="root">
            <h1>Loading Cantina App...</h1>
            <p>Client-side React app is loading...</p>
          </div>
          <script type="module" src="/@vite/client"></script>
          <script type="module" src="/app/entry.client.jsx"></script>
        </body>
      </html>
    `);
  });
} else {
  console.log('Starting production server');
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' })
  );
  app.use(express.static('build/client', { maxAge: '1h' }));
  app.use(await import('./build/server/index.js').then((mod) => mod.app));
}

app.use(morgan('tiny'));

async function gracefulShutdown(signal) {
  try {
    console.log(`\n${signal} received: flushing logs and shutting down...`);
    try { await LoggerService.flushQueue(); } catch {}
    try { await cacheService.disconnect(); } catch {}
  } finally {
    process.exit(0);
  }
}

['SIGINT','SIGTERM'].forEach(sig => process.on(sig, () => gracefulShutdown(sig)));

async function startServer() {
  try {
    const port = await findAvailablePort(BASE_PORT);
    app.listen(port, () => {
      printBanner('Cantina App', port, process.env.NODE_ENV);
    });
  } catch (err) {
    console.error('Failed to find an available port:', err);
    process.exit(1);
  }
}

function printBanner(appName, port, env) {
  const line = '─'.repeat(50);
  console.log(`\n${line}`);
  console.log(`🍽  ${appName}`);
  console.log(`🌍  Environment: ${env}`);
  console.log(`🚪  Listening on: http://localhost:${port}`);
  console.log(`${line}\n`);
}

startServer();

