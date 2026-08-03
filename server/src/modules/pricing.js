import { z } from 'zod';
import { round, normalize, weightedScore, band } from '../utils/scoring.js';

/* ============================================================
   MODULE 5 — PRICING
   Competitive pricing analysis: list the competitors, surface
   their pricing models, and position our price against them.
   ============================================================ */

export const key = 'pricing';
export const title = 'Pricing';
export const action = 'MAPPING';

export const PRICING_MODELS = [
  'subscription',
  'usage-based',
  'per-seat',
  'one-time',
  'freemium',
  'commission',
  'tiered',
  'custom',
];

const competitorSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  model: z.enum(PRICING_MODELS).default('subscription'),
  billingPeriod: z.enum(['monthly', 'annual', 'one-time']).default('monthly'),
  notes: z.string().optional(),
  features: z.array(z.string()).default([]),
});

export const inputSchema = z.object({
  ourPrice: z.number().nonnegative(),
  ourModel: z.enum(PRICING_MODELS).default('subscription'),
  ourFeatures: z.array(z.string()).default([]),
  currency: z.string().default('USD'),
  competitors: z.array(competitorSchema).min(1, 'Supply at least one competitor to compare against'),
});

/** Normalise every price to a monthly figure so the comparison is like-for-like. */
function toMonthly(price, billingPeriod) {
  if (billingPeriod === 'annual') return price / 12;
  if (billingPeriod === 'one-time') return price / 36; // amortised over 3 years
  return price;
}

export function run(input) {
  const data = inputSchema.parse(input);

  const normalised = data.competitors.map((c) => ({
    ...c,
    monthlyPrice: round(toMonthly(c.price, c.billingPeriod), 2),
  }));

  const prices = normalised.map((c) => c.monthlyPrice).sort((a, b) => a - b);
  const median = prices.length % 2
    ? prices[(prices.length - 1) / 2]
    : round((prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2, 2);
  const min = prices[0];
  const max = prices[prices.length - 1];
  const mean = round(prices.reduce((a, b) => a + b, 0) / prices.length, 2);

  const delta = median ? round(((data.ourPrice - median) / median) * 100, 1) : 0;
  const position = delta <= -15 ? 'BELOW_MARKET' : delta >= 15 ? 'ABOVE_MARKET' : 'AT_MARKET';

  // Differentiation: which of our features nobody else lists.
  const competitorFeatures = new Set(normalised.flatMap((c) => c.features.map((f) => f.toLowerCase())));
  const uniqueFeatures = data.ourFeatures.filter((f) => !competitorFeatures.has(f.toLowerCase()));
  const parityFeatures = data.ourFeatures.filter((f) => competitorFeatures.has(f.toLowerCase()));

  // Pricing power comes from differentiation, not from being cheapest.
  const differentiationScore = normalize(uniqueFeatures.length, 0, 4);
  const positionScore = position === 'AT_MARKET' ? 80 : position === 'ABOVE_MARKET' ? 65 : 55;
  const modelDiversityScore = normalize(new Set(normalised.map((c) => c.model)).size, 1, 4);

  const score = weightedScore([
    { value: differentiationScore, weight: 0.45 },
    { value: positionScore, weight: 0.35 },
    { value: modelDiversityScore, weight: 0.2 },
  ]);

  return {
    score,
    output: {
      currency: data.currency,
      ourPrice: data.ourPrice,
      ourModel: data.ourModel,
      market: { min, max, median, mean, sampleSize: prices.length },
      position,
      deltaFromMedianPercent: delta,
      competitors: normalised
        .map((c) => ({
          name: c.name,
          price: c.price,
          monthlyPrice: c.monthlyPrice,
          model: c.model,
          billingPeriod: c.billingPeriod,
          cheaperThanUs: c.monthlyPrice < data.ourPrice,
          notes: c.notes ?? null,
        }))
        .sort((a, b) => a.monthlyPrice - b.monthlyPrice),
      modelsInMarket: [...new Set(normalised.map((c) => c.model))],
      differentiation: {
        unique: uniqueFeatures,
        parity: parityFeatures,
        uniqueCount: uniqueFeatures.length,
      },
      pricingPower: band(score),
      summary:
        `Priced ${Math.abs(delta)}% ${delta >= 0 ? 'above' : 'below'} the ${data.currency} ${median} market median ` +
        `across ${prices.length} competitor(s); ${uniqueFeatures.length} differentiating feature(s).`,
      recommendations: buildRecommendations({ position, delta, uniqueFeatures, data }),
    },
  };
}

function buildRecommendations({ position, delta, uniqueFeatures, data }) {
  const out = [];
  if (position === 'ABOVE_MARKET' && uniqueFeatures.length === 0) {
    out.push(`Priced ${delta}% above median with no differentiating features — justify the premium or reprice.`);
  }
  if (position === 'BELOW_MARKET' && uniqueFeatures.length >= 2) {
    out.push('Underpriced relative to differentiation — there is room to raise price.');
  }
  if (data.competitors.length < 3) out.push('Add more competitors: a sample of fewer than 3 makes the median unreliable.');
  if (!out.length) out.push('Pricing is defensible against the current competitive set.');
  return out;
}

export default { key, title, action, inputSchema, run };
