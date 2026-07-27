import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { loadReport } from '../middleware/loadReport.js';
import {
  executeModule,
  listModuleResults,
  getModuleResult,
  deleteModuleResult,
} from '../controllers/moduleController.js';

// mergeParams so :reportId from the parent mount is visible here.
export const moduleRoutes = Router({ mergeParams: true });

moduleRoutes.use(asyncHandler(loadReport));

moduleRoutes.get('/', asyncHandler(listModuleResults));

moduleRoutes.route('/:moduleKey')
  .post(asyncHandler(executeModule))
  .get(asyncHandler(getModuleResult))
  .delete(asyncHandler(deleteModuleResult));
