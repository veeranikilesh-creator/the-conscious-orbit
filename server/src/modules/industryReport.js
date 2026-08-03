import { z } from 'zod';
import { weightedScore, band, verdict } from '../utils/scoring.js';
import { generateDecision } from '../integrations/aiProvider.js';

/* ============================================================
   MODULE 7 — INDUSTRY REPORT
   The consolidating module: assembles complete documentation
   about the business from every other module's output, then
   hands it to the AI decision engine, which returns the
   executive verdict.

   This is the integration point where "an AI model makes
   decisions based on the report data we insert".
   ============================================================ */

export const key = 'industryReport';
export const title = 'Industry Report';
export const action = 'DELIVERED';

/** Weight each module contributes to the consolidated Orbital Score. */
export const MODULE_WEIGHTS = {
  customerDiscovery: 0.1,
  profiling: 0.05,
  marketSize: 0.2,
  feasibility: 0.2,
  pricing: 0.1,
  marketResearch: 0.1,
  businessModelValidation: 0.15,
  gtm: 0.1,
};

export const inputSchema = z.object({
  /** Extra narrative context handed to the model alongside module data. */
  executiveContext: z.string().optional(),
  /** Skip the model call and return only the heuristic verdict. */
  skipAi: z.boolean().default(false),
  threshold: z.number().min(0).max(100).default(60),
});

/**
 * @param {object} input
 * @param {object} context
 * @param {object} context.report Report document.
 * @param {Record<string, object>} context.moduleResults Keyed by module key.
 */
export async function run(input, context = {}) {
  const data = inputSchema.parse(input);
  const { report = {}, moduleResults = {} } = context;

  // 1. Consolidate every module's score into the weighted Orbital Score.
  const contributions = Object.entries(MODULE_WEIGHTS)
    .filter(([key]) => moduleResults[key]?.score != null)
    .map(([key, weight]) => ({ name: key, value: moduleResults[key].score, weight }));

  const heuristicScore = weightedScore(contributions.map(({ value, weight }) => ({ value, weight })));
  const coverage = Math.round((contributions.length / Object.keys(MODULE_WEIGHTS).length) * 100);

  // 2. Build the documentation payload the model reasons over.
  const dossier = {
    report: {
      name: report.name,
      vertical: report.vertical,
      status: report.status,
      tags: report.tags,
      tracks: report.tracks,
    },
    clusters: report.clusters ?? {},
    executiveContext: data.executiveContext ?? null,
    coveragePercent: coverage,
    modules: Object.fromEntries(
      Object.entries(moduleResults).map(([k, r]) => [k, { score: r.score, output: r.output }])
    ),
  };

  // 3. Hand it to the decision engine.
  const decision = data.skipAi
    ? { ...verdict(heuristicScore, data.threshold), live: false, note: 'AI skipped by request.' }
    : await generateDecision({ ...dossier, heuristicScore });

  return {
    score: heuristicScore,
    integrations: { ai: { used: !data.skipAi, live: Boolean(decision.live), model: decision.model ?? null } },
    output: {
      orbitalScore: heuristicScore,
      rating: band(heuristicScore),
      coveragePercent: coverage,
      contributions: contributions.map((c) => ({
        module: c.name,
        score: c.value,
        weight: c.weight,
        weightedContribution: Math.round(c.value * c.weight * 10) / 10,
      })),
      missingModules: Object.keys(MODULE_WEIGHTS).filter((k) => moduleResults[k]?.score == null),
      decision: {
        decision: decision.decision,
        label: decision.label,
        score: decision.score,
        headline: decision.headline ?? null,
        rationale: decision.rationale ?? null,
        strengths: decision.strengths ?? [],
        risks: decision.risks ?? [],
        nextActions: decision.nextActions ?? [],
        generatedBy: decision.live ? decision.model : 'heuristic',
        live: Boolean(decision.live),
        note: decision.note ?? null,
      },
      dossier,
      summary:
        `Orbital Score ${heuristicScore}/100 from ${contributions.length} of ${Object.keys(MODULE_WEIGHTS).length} modules ` +
        `(${coverage}% coverage). Verdict: ${decision.label} (${decision.decision}).`,
    },
  };
}

export default { key, title, action, inputSchema, run, isAsync: true, needsContext: true };
