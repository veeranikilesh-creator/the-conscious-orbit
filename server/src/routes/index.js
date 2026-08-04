import { Router } from 'express';
import mongoose from 'mongoose';
import { reportRoutes } from './reportRoutes.js';
import { moduleRoutes } from './moduleRoutes.js';
import { listModules } from '../controllers/moduleController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { PIPELINE_STAGES } from '../state/actionPipeline.js';
import { REPORT_STATUSES } from '../state/reportState.js';
import { env } from '../config/env.js';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    integrations: { anthropic: env.anthropic.enabled, spyfu: env.spyfu.enabled },
    uptimeSeconds: Math.round(process.uptime()),
  });
});

/** The pipeline definition — lets the client render stages without hardcoding them. */
router.get('/pipeline', (_req, res) => {
  res.json({ statuses: REPORT_STATUSES, stages: PIPELINE_STAGES });
});

router.get('/modules', asyncHandler(listModules));

router.use('/reports', reportRoutes);
router.use('/reports/:reportId/modules', moduleRoutes);
