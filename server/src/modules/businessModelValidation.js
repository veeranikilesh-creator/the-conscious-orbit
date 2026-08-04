import { z } from 'zod';
import { round, normalize, weightedScore, band, verdict } from '../utils/scoring.js';

/* ============================================================
   MODULE 8 — BUSINESS MODEL VALIDATION
   Is the customer's investment worth the time?

   Two data paths, both supported:
     PRIMARY   — custom form submissions -> field surveys -> report
     SECONDARY — pulled from existing module results on the report
   ============================================================ */

export const key = 'businessModelValidation';
export const title = 'Business Model Validation';
export const action = 'REQUIREMENT';

const surveyResponseSchema = z.object({
  question: z.string(),
  /** 1–5 Likert, or a raw count depending on `type`. */
  value: z.number(),
  type: z.enum(['likert', 'count', 'boolean']).default('likert'),
  weight: z.number().min(0).max(1).default(1),
});

export const inputSchema = z.object({
  /** PRIMARY: data the customer collected themselves. */
  primary: z
    .object({
      formSubmissions: z.number().int().nonnegative().default(0),
      fieldSurveys: z.array(surveyResponseSchema).default([]),
      surveyReach: z.number().int().nonnegative().default(0),
      notes: z.string().optional(),
    })
    .optional(),

  /** SECONDARY: which existing module results to fold in. */
  secondary: z
    .object({
      useExistingModules: z.boolean().default(true),
      modules: z.array(z.string()).default([]),
    })
    .default({ useExistingModules: true, modules: [] }),

  investment: z.object({
    capitalRequired: z.number().nonnegative(),
    monthsToBreakEven: z.number().positive(),
    founderMonthsCommitted: z.number().positive(),
    expectedAnnualReturn: z.number().nonnegative().default(0),
  }),

  currency: z.string().default('USD'),
});

/**
 * @param {object} input
 * @param {{ moduleResults?: Record<string, object> }} context
 */
export function run(input, context = {}) {
  const data = inputSchema.parse(input);
  const { moduleResults = {} } = context;

  const primary = data.primary ? assessPrimary(data.primary) : null;
  const secondary = data.secondary.useExistingModules
    ? assessSecondary(moduleResults, data.secondary.modules)
    : null;
  const investment = assessInvestment(data.investment);

  // Primary (first-party evidence) outweighs secondary (inherited analysis).
  const parts = [{ value: investment.score, weight: 0.4 }];
  if (primary) parts.push({ value: primary.score, weight: 0.35 });
  if (secondary && secondary.sampleSize > 0) parts.push({ value: secondary.score, weight: 0.25 });

  const score = weightedScore(parts);
  const v = verdict(score);

  return {
    score,
    output: {
      ...v,
      worthTheTime: v.decision === 1 && investment.paybackAcceptable,
      dataSources: {
        primary: primary ? { used: true, ...primary } : { used: false },
        secondary: secondary ? { used: true, ...secondary } : { used: false },
      },
      investment,
      currency: data.currency,
      confidence: band(score),
      summary:
        `${v.label} — ${v.score}/100. ` +
        `${data.currency} ${data.investment.capitalRequired.toLocaleString()} over ` +
        `${data.investment.founderMonthsCommitted} founder-months, breaking even at month ${data.investment.monthsToBreakEven}. ` +
        (primary ? `${primary.sampleSize} primary data point(s).` : 'No primary data supplied.'),
      recommendations: buildRecommendations({ primary, secondary, investment, v }),
    },
  };
}

/** PRIMARY: custom form submissions -> field surveys -> report. */
function assessPrimary(primary) {
  const responses = primary.fieldSurveys;
  const sampleSize = primary.formSubmissions + responses.length;

  // Normalise every response type onto 0–100 before weighting.
  const normalisedResponses = responses.map((r) => {
    const value =
      r.type === 'likert' ? normalize(r.value, 1, 5)
      : r.type === 'boolean' ? (r.value ? 100 : 0)
      : normalize(r.value, 0, 100);
    return { value, weight: r.weight };
  });

  const sentimentScore = normalisedResponses.length ? weightedScore(normalisedResponses) : 50;
  const volumeScore = normalize(sampleSize, 0, 100);
  const reachScore = normalize(primary.surveyReach, 0, 500);

  const score = weightedScore([
    { value: sentimentScore, weight: 0.55 },
    { value: volumeScore, weight: 0.3 },
    { value: reachScore, weight: 0.15 },
  ]);

  return {
    score,
    sampleSize,
    formSubmissions: primary.formSubmissions,
    surveyResponses: responses.length,
    surveyReach: primary.surveyReach,
    sentimentScore,
    statisticallyMeaningful: sampleSize >= 30,
    notes: primary.notes ?? null,
  };
}

/** SECONDARY: pull from reports that already exist on this venture. */
function assessSecondary(moduleResults, requestedModules) {
  const keys = requestedModules.length ? requestedModules : Object.keys(moduleResults);
  const usable = keys
    .map((k) => ({ key: k, score: moduleResults[k]?.score }))
    .filter((m) => m.score != null);

  return {
    score: usable.length ? round(usable.reduce((sum, m) => sum + m.score, 0) / usable.length) : 0,
    sampleSize: usable.length,
    sourcedFrom: usable.map((m) => m.key),
    skipped: keys.filter((k) => moduleResults[k]?.score == null),
  };
}

function assessInvestment(inv) {
  const paybackScore = normalize(36 - Math.min(inv.monthsToBreakEven, 36), 0, 36);
  const commitmentScore = normalize(48 - Math.min(inv.founderMonthsCommitted, 48), 0, 48);
  const returnRatio = inv.capitalRequired ? inv.expectedAnnualReturn / inv.capitalRequired : 0;
  const returnScore = normalize(returnRatio, 0, 1);

  const score = weightedScore([
    { value: paybackScore, weight: 0.4 },
    { value: returnScore, weight: 0.35 },
    { value: commitmentScore, weight: 0.25 },
  ]);

  return {
    score,
    capitalRequired: inv.capitalRequired,
    monthsToBreakEven: inv.monthsToBreakEven,
    founderMonthsCommitted: inv.founderMonthsCommitted,
    annualReturnRatio: round(returnRatio, 2),
    paybackAcceptable: inv.monthsToBreakEven <= 24,
  };
}

function buildRecommendations({ primary, secondary, investment, v }) {
  const out = [];
  if (!primary) out.push('No primary data — run field surveys before committing capital.');
  else if (!primary.statisticallyMeaningful) {
    out.push(`Primary sample of ${primary.sampleSize} is below 30 — treat the sentiment score as directional only.`);
  }
  if (secondary && secondary.skipped.length) {
    out.push(`Secondary pull skipped ${secondary.skipped.length} module(s) with no stored score: ${secondary.skipped.join(', ')}.`);
  }
  if (!investment.paybackAcceptable) {
    out.push(`Break-even at month ${investment.monthsToBreakEven} exceeds the 24-month bar — the time investment is hard to justify.`);
  }
  if (!out.length) out.push(`Business model validated at ${v.score}/100 — the investment is worth the time.`);
  return out;
}

export default { key, title, action, inputSchema, run, needsContext: true };
