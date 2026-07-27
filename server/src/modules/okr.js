import { z } from 'zod';
import { round, clamp, band } from '../utils/scoring.js';

/* ============================================================
   MODULE 10 — OKR (OBJECTIVES AND KEY RESULTS)
   Goal-setting and tracking framework. Sets the framework for
   each objective and tracks achievement, so the customer
   actually finishes what they started.
   ============================================================ */

export const key = 'okr';
export const title = 'Objectives & Key Results';
export const action = 'MAPPING';

export const KR_STATUSES = ['NOT_STARTED', 'ON_TRACK', 'AT_RISK', 'OFF_TRACK', 'ACHIEVED'];

const keyResultSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(3),
  metric: z.string().min(1),
  baseline: z.number().default(0),
  target: z.number(),
  current: z.number().default(0),
  unit: z.string().default(''),
  dueDate: z.coerce.date().optional(),
});

const objectiveSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  owner: z.string().optional(),
  quarter: z.string().optional(),
  keyResults: z.array(keyResultSchema).min(1, 'An objective needs at least one key result'),
});

export const inputSchema = z.object({
  objectives: z.array(objectiveSchema).min(1, 'Supply at least one objective'),
  /** Enforce that objectives are closed out, not abandoned. */
  enforceCompletion: z.boolean().default(true),
  asOf: z.coerce.date().optional(),
});

export function run(input) {
  const data = inputSchema.parse(input);
  const asOf = data.asOf ?? new Date();

  const objectives = data.objectives.map((objective, oi) => {
    const keyResults = objective.keyResults.map((kr, ki) => scoreKeyResult(kr, ki, asOf));
    // Objective progress is the mean of its key results — standard OKR practice.
    const progress = round(keyResults.reduce((sum, kr) => sum + kr.progress, 0) / keyResults.length, 1);

    return {
      id: objective.id ?? `obj-${oi + 1}`,
      title: objective.title,
      owner: objective.owner ?? null,
      quarter: objective.quarter ?? null,
      progress,
      status: statusForProgress(progress, keyResults),
      achieved: progress >= 100,
      keyResults,
      atRiskCount: keyResults.filter((kr) => kr.status === 'AT_RISK' || kr.status === 'OFF_TRACK').length,
    };
  });

  const overallProgress = round(
    objectives.reduce((sum, o) => sum + o.progress, 0) / objectives.length,
    1
  );
  const achievedCount = objectives.filter((o) => o.achieved).length;

  // The score *is* the tracked progress — this module measures follow-through.
  const score = clamp(round(overallProgress));

  return {
    score,
    output: {
      asOf: asOf.toISOString(),
      framework: {
        objectiveCount: objectives.length,
        keyResultCount: objectives.reduce((n, o) => n + o.keyResults.length, 0),
        cadence: 'quarterly',
      },
      overallProgress,
      achievedObjectives: achievedCount,
      completionRate: round((achievedCount / objectives.length) * 100, 1),
      objectives,
      blockers: objectives.flatMap((o) =>
        o.keyResults
          .filter((kr) => kr.status === 'OFF_TRACK')
          .map((kr) => ({ objective: o.title, keyResult: kr.description, gap: kr.gap }))
      ),
      health: band(score),
      enforcement: data.enforceCompletion
        ? {
            enabled: true,
            unfinished: objectives.filter((o) => !o.achieved).map((o) => o.title),
            message:
              achievedCount === objectives.length
                ? 'All objectives achieved.'
                : `${objectives.length - achievedCount} objective(s) remain open — the cycle cannot be closed until they are achieved or formally dropped.`,
          }
        : { enabled: false },
      summary: `${overallProgress}% overall progress; ${achievedCount}/${objectives.length} objectives achieved.`,
      recommendations: buildRecommendations(objectives, overallProgress),
    },
  };
}

function scoreKeyResult(kr, index, asOf) {
  const span = kr.target - kr.baseline;
  // Guard the degenerate case where target === baseline.
  const progress = span === 0
    ? (kr.current >= kr.target ? 100 : 0)
    : clamp(round(((kr.current - kr.baseline) / span) * 100, 1));

  const overdue = kr.dueDate ? asOf > kr.dueDate && progress < 100 : false;

  let status;
  if (progress >= 100) status = 'ACHIEVED';
  else if (progress === 0) status = 'NOT_STARTED';
  else if (overdue || progress < 30) status = 'OFF_TRACK';
  else if (progress < 60) status = 'AT_RISK';
  else status = 'ON_TRACK';

  return {
    id: kr.id ?? `kr-${index + 1}`,
    description: kr.description,
    metric: kr.metric,
    unit: kr.unit,
    baseline: kr.baseline,
    target: kr.target,
    current: kr.current,
    progress,
    gap: round(kr.target - kr.current, 2),
    dueDate: kr.dueDate ? kr.dueDate.toISOString() : null,
    overdue,
    status,
  };
}

function statusForProgress(progress, keyResults) {
  if (progress >= 100) return 'ACHIEVED';
  if (keyResults.some((kr) => kr.status === 'OFF_TRACK')) return 'OFF_TRACK';
  if (progress < 60) return 'AT_RISK';
  if (progress === 0) return 'NOT_STARTED';
  return 'ON_TRACK';
}

function buildRecommendations(objectives, overallProgress) {
  const out = [];
  const offTrack = objectives.filter((o) => o.status === 'OFF_TRACK');
  if (offTrack.length) out.push(`${offTrack.length} objective(s) off track: ${offTrack.map((o) => o.title).join(', ')}.`);
  if (overallProgress < 40) out.push('Overall progress below 40% — re-scope the objectives or reallocate ownership.');
  const unowned = objectives.filter((o) => !o.owner);
  if (unowned.length) out.push(`${unowned.length} objective(s) have no owner — unowned OKRs do not get finished.`);
  if (!out.length) out.push('OKR cycle is healthy — maintain the weekly check-in cadence.');
  return out;
}

export default { key, title, action, inputSchema, run };
