import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router } from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { env, isProduction } from './config/env.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin.split(',').map((o) => o.trim()), credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.use('/api', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
