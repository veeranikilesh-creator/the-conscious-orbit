import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { loadReport } from '../middleware/loadReport.js';
import { requireStageComplete } from '../state/actionPipeline.js';
import {
  createReport,
  listReports,
  getReport,
  getPipeline,
  setStatus,
  advanceReport,
  revertReport,
  deleteReport,
} from '../controllers/reportController.js';

export const reportRoutes = Router();

reportRoutes.route('/')
  .post(asyncHandler(createReport))
  .get(asyncHandler(listReports));

reportRoutes.route('/:reportId')
  .get(asyncHandler(loadReport), asyncHandler(getReport))
  .delete(asyncHandler(loadReport), asyncHandler(deleteReport));

reportRoutes.get('/:reportId/pipeline', asyncHandler(loadReport), asyncHandler(getPipeline));

reportRoutes.patch('/:reportId/status', asyncHandler(loadReport), asyncHandler(setStatus));

// requireStageComplete() enforces the action pipeline: a report cannot leave a
// stage until that stage's modules have produced results.
reportRoutes.post(
  '/:reportId/advance',
  asyncHandler(loadReport),
  requireStageComplete(),
  asyncHandler(advanceReport)
);

reportRoutes.post('/:reportId/revert', asyncHandler(loadReport), asyncHandler(revertReport));
