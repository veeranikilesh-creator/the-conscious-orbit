import { z } from 'zod';
import { weightedScore, band, verdict, normalize } from '../utils/scoring.js';

/* ============================================================
   MODULE 4 — FEASIBILITY
   Is this practically worth doing? Specifically: are the B2B
   consumers worth pursuing at the price they'll pay?
   Output: a feasibility score plus a go/no-go on the segment.
   ============================================================ */

export const key = 'feasibility';
export const title = 'Feasibility';
export const action = 'MAPPING';

export const inputSchema = z.object({
  /** 0–100 self- or analyst-assessed parameters. */
  technical: z.number().min(0).max(100).default(50),
  operational: z.number().min(0).max(100).default(50),
  financial: z.number().min(0).max(100).default(50),
  regulatory: z.number().min(0).max(100).default(50),
  teamCapability: z.number().min(0).max(100).default(50),

  /** B2B economics — the specific question the module must answer. */
  b2b: z
    .object({
      averageContractValue: z.number().nonnegative().default(0),
      customerAcquisitionCost: z.number().nonnegative().default(0),
      salesCycleDays: z.number().nonnegative().default(90),
      expectedRetentionMonths: z.number().nonnegative().default(12),
    })
    .optional(),

  threshold: z.number().min(0).max(100).default(60),
});

export function run(input) {
  const data = inputSchema.parse(input);

  const parameters = [
    { name: 'technical', value: data.technical, weight: 0.2 },
    { name: 'operational', value: data.operational, weight: 0.2 },
    { name: 'financial', value: data.financial, weight: 0.25 },
    { name: 'regulatory', value: data.regulatory, weight: 0.15 },
    { name: 'teamCapability', value: data.teamCapability, weight: 0.2 },
  ];

  const parameterScore = weightedScore(parameters);
  const b2bAssessment = data.b2b ? assessB2bWorth(data.b2b) : null;

  // When B2B economics are supplied they carry real weight — a venture with
  // strong parameters but upside-down unit economics is not feasible.
  const score = b2bAssessment
    ? weightedScore([
        { value: parameterScore, weight: 0.6 },
        { value: b2bAssessment.score, weight: 0.4 },
      ])
    : parameterScore;

  const v = verdict(score, data.threshold);

  return {
    score,
    output: {
      ...v,
      parameterScore,
      parameters: Object.fromEntries(parameters.map((p) => [p.name, p.value])),
      weakestParameter: parameters.reduce((a, b) => (a.value <= b.value ? a : b)).name,
      b2bAssessment,
      rating: band(score),
      summary: b2bAssessment
        ? `${v.label} — feasibility ${v.score}/100. B2B segment is ${b2bAssessment.worthIt ? 'worth pursuing' : 'not worth pursuing'} ` +
          `(LTV:CAC ${b2bAssessment.ltvToCac}).`
        : `${v.label} — feasibility ${v.score}/100 from weighted parameters. Supply B2B economics for a segment verdict.`,
      recommendations: buildRecommendations(parameters, b2bAssessment),
    },
  };
}

/**
 * Are B2B consumers worth it? The standard test is LTV:CAC ≥ 3 with a
 * payback period the business can actually finance.
 */
function assessB2bWorth(b2b) {
  const monthlyValue = b2b.averageContractValue / 12;
  const ltv = monthlyValue * b2b.expectedRetentionMonths;
  const ltvToCac = b2b.customerAcquisitionCost
    ? Number((ltv / b2b.customerAcquisitionCost).toFixed(2))
    : null;
  const paybackMonths = monthlyValue
    ? Number((b2b.customerAcquisitionCost / monthlyValue).toFixed(1))
    : null;

  const ltvScore = ltvToCac === null ? 50 : normalize(ltvToCac, 0, 5);
  const paybackScore = paybackMonths === null ? 50 : normalize(24 - Math.min(paybackMonths, 24), 0, 24);
  const cycleScore = normalize(180 - Math.min(b2b.salesCycleDays, 180), 0, 180);

  const score = weightedScore([
    { value: ltvScore, weight: 0.5 },
    { value: paybackScore, weight: 0.3 },
    { value: cycleScore, weight: 0.2 },
  ]);

  return {
    score,
    ltv: Math.round(ltv),
    ltvToCac,
    paybackMonths,
    salesCycleDays: b2b.salesCycleDays,
    worthIt: (ltvToCac ?? 0) >= 3 && (paybackMonths ?? Infinity) <= 18,
    verdictReason:
      ltvToCac === null
        ? 'No CAC supplied — LTV:CAC could not be computed.'
        : ltvToCac >= 3
          ? `LTV:CAC of ${ltvToCac} clears the 3.0 bar.`
          : `LTV:CAC of ${ltvToCac} is below the 3.0 bar — acquisition costs too much relative to what a customer returns.`,
  };
}

function buildRecommendations(parameters, b2bAssessment) {
  const out = [];
  const weakest = parameters.reduce((a, b) => (a.value <= b.value ? a : b));
  if (weakest.value < 50) out.push(`Address ${weakest.name} feasibility first — it is the binding constraint at ${weakest.value}/100.`);
  if (b2bAssessment && !b2bAssessment.worthIt) {
    out.push(b2bAssessment.verdictReason);
    if ((b2bAssessment.paybackMonths ?? 0) > 18) out.push('Shorten CAC payback below 18 months or the segment cannot be financed.');
  }
  if (!out.length) out.push('Feasibility parameters clear the bar — proceed to pricing.');
  return out;
}

export default { key, title, action, inputSchema, run };
