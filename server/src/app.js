import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router } from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { env, isProduction } from './config/env.js';

export function createApp() {
  const app = express();

  // CORS_ORIGIN accepts a comma-separated list, or "*" to allow any origin.
  // Note `credentials` must be false when the origin is a wildcard — browsers
  // reject that combination outright.
  const origins = env.corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);
  const allowAny = origins.includes('*');
  app.use(cors({ origin: allowAny ? '*' : origins, credentials: !allowAny }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.use('/api', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
