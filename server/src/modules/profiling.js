import { z } from 'zod';
import { normalize, weightedScore, band } from '../utils/scoring.js';

/* ============================================================
   MODULE 2 — PROFILING
   Input:  sector data.
   Logic:  classify B2B vs B2C, then route to the right sub-track.
             B2B -> logistics | customer | hrtech
             B2C -> delivery  | production
   Output: sector profile + ideal company profile + routing decision.
   ============================================================ */

export const key = 'profiling';
export const title = 'Profiling';
export const action = 'REQUIREMENT';

export const B2B_TRACKS = ['logistics', 'customer', 'hrtech'];
export const B2C_TRACKS = ['delivery', 'production'];

/** Keyword → track. First match wins; order matters for overlapping sectors. */
const ROUTING_RULES = {
  B2B: [
    { track: 'logistics', keywords: ['logistic', 'supply', 'freight', 'warehouse', 'fleet', 'shipping', 'transport'] },
    { track: 'hrtech', keywords: ['hr', 'recruit', 'talent', 'people', 'payroll', 'hiring', 'workforce'] },
    { track: 'customer', keywords: ['crm', 'support', 'success', 'sales', 'service', 'saas', 'b2b'] },
  ],
  B2C: [
    { track: 'delivery', keywords: ['delivery', 'last-mile', 'courier', 'food', 'grocery', 'quick commerce', 'q-commerce'] },
    { track: 'production', keywords: ['manufactur', 'production', 'goods', 'retail', 'apparel', 'fmcg', 'consumer product'] },
  ],
};

/** Track a model falls back to when no keyword matches. */
const DEFAULT_TRACK = { B2B: 'customer', B2C: 'production' };

export const inputSchema = z.object({
  sector: z.string().min(2, 'Sector is required'),
  businessModel: z.enum(['B2B', 'B2C', 'B2B2C', 'Marketplace']),
  targetDemographics: z.string().optional(),
  idealCompanyProfile: z.string().optional(),
  employeeCountRange: z.string().optional(),
  /** Optional explicit override — skips keyword routing. */
  forceTrack: z.string().optional(),
  dataCompleteness: z.number().min(0).max(100).default(50),
});

/**
 * Reduce hybrid models to the primary side so routing has a single answer.
 * B2B2C is treated as B2B (you sell to the business first); Marketplace as B2C.
 */
function primarySide(businessModel) {
  if (businessModel === 'B2B' || businessModel === 'B2B2C') return 'B2B';
  return 'B2C';
}

export function routeSector(sector, businessModel) {
  const side = primarySide(businessModel);
  const haystack = String(sector).toLowerCase();

  for (const rule of ROUTING_RULES[side]) {
    if (rule.keywords.some((kw) => haystack.includes(kw))) {
      return { side, track: rule.track, matchedOn: rule.keywords.find((kw) => haystack.includes(kw)), inferred: false };
    }
  }
  return { side, track: DEFAULT_TRACK[side], matchedOn: null, inferred: true };
}

export function run(input) {
  const data = inputSchema.parse(input);

  const routing = data.forceTrack
    ? { side: primarySide(data.businessModel), track: data.forceTrack, matchedOn: null, inferred: false, overridden: true }
    : routeSector(data.sector, data.businessModel);

  const availableTracks = routing.side === 'B2B' ? B2B_TRACKS : B2C_TRACKS;

  // A confidently-routed, well-described profile scores higher than an inferred one.
  const routingConfidence = routing.inferred ? 45 : 90;
  const profileDepth = normalize(
    [data.targetDemographics, data.idealCompanyProfile, data.employeeCountRange].filter(Boolean).length,
    0,
    3
  );

  const score = weightedScore([
    { value: routingConfidence, weight: 0.4 },
    { value: profileDepth, weight: 0.35 },
    { value: data.dataCompleteness, weight: 0.25 },
  ]);

  return {
    score,
    output: {
      sector: data.sector,
      businessModel: data.businessModel,
      classification: routing.side,
      route: routing.track,
      routeInferred: routing.inferred,
      routeOverridden: Boolean(routing.overridden),
      matchedKeyword: routing.matchedOn,
      availableTracks,
      idealCompanyProfile: data.idealCompanyProfile ?? null,
      targetDemographics: data.targetDemographics ?? null,
      confidence: band(score),
      summary:
        `Classified as ${routing.side} and routed to the "${routing.track}" track` +
        (routing.inferred ? ' (inferred — no sector keyword matched, confirm manually).' : `, matched on "${routing.matchedOn}".`),
      recommendations: routing.inferred
        ? [`Confirm the "${routing.track}" routing — it was a fallback, not a keyword match.`]
        : [`Proceed with the ${routing.track} playbook for the ${routing.side} motion.`],
    },
  };
}

export default { key, title, action, inputSchema, run, routeSector };
