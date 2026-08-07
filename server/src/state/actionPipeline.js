import { ApiError } from '../utils/ApiError.js';
import { REPORT_STATUSES } from './reportState.js';

/* ============================================================
   ACTION PIPELINE
   SCRUMING -> REQUIREMENT -> MAPPING -> ADMIN_REVIEW -> DELIVERED

   The action is the *work being done* while a report sits in a
   status. Status and action advance together: completing an
   action is what earns the report its next status.

     RECEIVED  · SCRUMING      reviewing ideas & problem statements
     PENDING   · REQUIREMENT   gathering customer data & B2B/B2C specs
     PROCESSED · MAPPING       defining TAM/SAM/SOM conversions
     REVIEWING · ADMIN_REVIEW  admin reviews the report
     PUBLISHED · DELIVERED     scores & downloadable artifacts
   ============================================================ */

export const ACTIONS = ['SCRUMING', 'REQUIREMENT', 'MAPPING', 'ADMIN_REVIEW', 'DELIVERED'];

/** Ordered stage descriptors — index-aligned with REPORT_STATUSES. */
export const PIPELINE_STAGES = [
  {
    action: 'SCRUMING',
    status: 'RECEIVED',
    note: 'Reviewing business ideas & problem statements',
    modules: ['customerDiscovery'],
  },
  {
    action: 'REQUIREMENT',
    status: 'PENDING',
    note: 'Gathering customer data & B2B/B2C specs',
    modules: ['profiling', 'businessModelValidation'],
  },
  {
    action: 'MAPPING',
    status: 'PROCESSED',
    note: 'Defining TAM/SAM/SOM conversions',
    modules: ['marketSize', 'feasibility', 'pricing', 'marketResearch', 'gtm', 'okr'],
  },
  {
    action: 'ADMIN_REVIEW',
    status: 'REVIEWING',
    note: 'Admin reviews the report before publication',
    modules: [],
  },
  {
    action: 'DELIVERED',
    status: 'PUBLISHED',
    note: 'Generated scores & downloadable artifacts',
    modules: ['industryReport'],
  },
];

const byStatus = new Map(PIPELINE_STAGES.map((s) => [s.status, s]));
const byAction = new Map(PIPELINE_STAGES.map((s) => [s.action, s]));

export const actionForStatus = (status) => byStatus.get(status)?.action ?? null;
export const statusForAction = (action) => byAction.get(action)?.status ?? null;
export const stageForStatus = (status) => byStatus.get(status) ?? null;

/** Module keys whose results are expected before this stage can complete. */
export const requiredModulesForStatus = (status) => byStatus.get(status)?.modules ?? [];

/**
 * Gate an advance: every module the current stage owns must have a stored
 * result before the report may move on. Returns the list of missing keys
 * rather than throwing, so callers can decide whether to enforce.
 *
 * @param {string} status Current report status.
 * @param {string[]} completedModuleKeys Module keys already recorded.
 * @returns {string[]} Module keys still outstanding.
 */
export function missingModulesForStage(status, completedModuleKeys = []) {
  const done = new Set(completedModuleKeys);
  return requiredModulesForStatus(status).filter((key) => !done.has(key));
}

/**
 * Express-style middleware factory. Rejects the request unless the report on
 * `req.report` has satisfied its current stage's module requirements.
 * Mount it on the advance route when you want hard gating.
 */
export function requireStageComplete() {
  return (req, _res, next) => {
    const report = req.report;
    if (!report) return next(new ApiError(500, 'requireStageComplete used without a loaded report'));

    const missing = missingModulesForStage(report.status, report.completedModules ?? []);
    if (missing.length) {
      return next(
        new ApiError(
          409,
          `Cannot advance from ${report.status}: action ${actionForStatus(report.status)} is incomplete. ` +
            `Missing module results: ${missing.join(', ')}`
        )
      );
    }
    return next();
  };
}

/** Percentage of the whole pipeline traversed, for progress bars. */
export function pipelineProgress(status) {
  const idx = REPORT_STATUSES.indexOf(status);
  if (idx < 0) return 0;
  return Math.round((idx / (REPORT_STATUSES.length - 1)) * 100);
}
