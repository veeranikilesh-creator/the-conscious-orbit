import { ApiError } from '../utils/ApiError.js';

/* ============================================================
   REPORT STATE MACHINE
   RECEIVED -> PENDING -> PROCESSED -> REVIEWING -> PUBLISHED

   Linear and strictly ordered. Every transition goes through
   assertTransition() so an illegal jump (e.g. RECEIVED -> PUBLISHED)
   is rejected at the service layer rather than silently written.
   ============================================================ */

export const REPORT_STATUSES = ['RECEIVED', 'PENDING', 'PROCESSED', 'REVIEWING', 'PUBLISHED'];

export const INITIAL_STATUS = 'RECEIVED';
export const TERMINAL_STATUS = 'PUBLISHED';

/** Each status maps to the single status that may legally follow it. */
const FORWARD = {
  RECEIVED: 'PENDING',
  PENDING: 'PROCESSED',
  PROCESSED: 'REVIEWING',
  REVIEWING: 'PUBLISHED',
  PUBLISHED: null,
};

/** Reverse edges — the board lets an operator walk a report back a stage. */
const BACKWARD = {
  RECEIVED: null,
  PENDING: 'RECEIVED',
  PROCESSED: 'PENDING',
  REVIEWING: 'PROCESSED',
  PUBLISHED: 'REVIEWING',
};

export const isValidStatus = (status) => REPORT_STATUSES.includes(status);

export const indexOfStatus = (status) => REPORT_STATUSES.indexOf(status);

/** True when `to` is reachable from `from` in exactly one step (either direction). */
export function canTransition(from, to) {
  if (!isValidStatus(from) || !isValidStatus(to)) return false;
  return FORWARD[from] === to || BACKWARD[from] === to;
}

/**
 * Throws unless `to` is one legal step from `from`.
 * @throws {ApiError} 400 on an illegal transition.
 */
export function assertTransition(from, to) {
  if (!isValidStatus(to)) {
    throw new ApiError(400, `Unknown status "${to}". Expected one of: ${REPORT_STATUSES.join(', ')}`);
  }
  if (from === to) {
    throw new ApiError(400, `Report is already ${from}`);
  }
  if (!canTransition(from, to)) {
    throw new ApiError(
      400,
      `Illegal transition ${from} -> ${to}. The pipeline is linear: ${REPORT_STATUSES.join(' -> ')}`
    );
  }
  return to;
}

/** Next status in the pipeline, or null when already PUBLISHED. */
export const nextStatus = (from) => FORWARD[from] ?? null;

/** Previous status in the pipeline, or null when at RECEIVED. */
export const previousStatus = (from) => BACKWARD[from] ?? null;

/**
 * Advance or revert by one stage.
 * @param {string} from Current status.
 * @param {1|-1} direction 1 to advance, -1 to revert.
 */
export function step(from, direction = 1) {
  const to = direction >= 0 ? nextStatus(from) : previousStatus(from);
  if (!to) {
    throw new ApiError(
      400,
      direction >= 0
        ? `Report is already at the terminal status (${TERMINAL_STATUS})`
        : `Report is already at the initial status (${INITIAL_STATUS})`
    );
  }
  return assertTransition(from, to);
}
