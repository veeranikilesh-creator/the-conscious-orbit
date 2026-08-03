import { z } from 'zod';
import { clamp, round, normalize, band } from '../utils/scoring.js';

/* ============================================================
   MODULE 3 — MARKET SIZE
   Three tiers, each a conversion of the one above:
     TAM — everyone who could buy
     SAM — everyone you can actually serve
     SOM — customers you can realistically win

   Channel coverage is capped at 100%: a mix that sums above 100
   would otherwise produce a SOM larger than the SAM it derives
   from, which is arithmetically impossible.
   ============================================================ */

export const key = 'marketSize';
export const title = 'Market Size';
export const action = 'MAPPING';

export const inputSchema = z.object({
  /** Total Addressable Market in currency units. */
  tam: z.number().positive('TAM must be greater than zero'),
  currency: z.string().default('USD'),
  /** Share of TAM the business model can serve, as a percentage. */
  samPercent: z.number().min(0).max(100),
  /** Reach per channel, as percentages. Coverage is their sum, capped at 100. */
  channelMix: z
    .object({
      direct: z.number().min(0).max(100).default(0),
      partner: z.number().min(0).max(100).default(0),
      online: z.number().min(0).max(100).default(0),
    })
    .default({ direct: 0, partner: 0, online: 0 }),
  /** Lead-to-customer conversion, as a percentage. */
  conversionRate: z.number().min(0).max(100),
  averageContractValue: z.number().nonnegative().optional(),
});

export function run(input) {
  const data = inputSchema.parse(input);

  const sam = round(data.tam * (data.samPercent / 100));

  const channelTotal =
    data.channelMix.direct + data.channelMix.partner + data.channelMix.online;
  // Coverage is capped: you cannot reach more than all of your serviceable market.
  const coverage = Math.min(1, channelTotal / 100);
  const coverageCapped = channelTotal > 100;

  const som = round(sam * coverage * (data.conversionRate / 100));

  const samShareOfTam = round((sam / data.tam) * 100, 1);
  const somShareOfSam = sam ? round((som / sam) * 100, 1) : 0;
  const somShareOfTam = round((som / data.tam) * 100, 2);

  // A market is attractive when the obtainable slice is materially large
  // relative to the total, and the funnel isn't purely aspirational.
  const captureScore = normalize(somShareOfTam, 0, 5);
  const coverageScore = clamp(coverage * 100);
  const conversionScore = normalize(data.conversionRate, 0, 20);
  const absoluteScore = normalize(Math.log10(Math.max(som, 1)), 4, 8); // $10k → $100M

  const score = round(
    captureScore * 0.3 + coverageScore * 0.2 + conversionScore * 0.2 + absoluteScore * 0.3
  );

  const estimatedCustomers = data.averageContractValue
    ? Math.floor(som / data.averageContractValue)
    : null;

  return {
    score,
    output: {
      currency: data.currency,
      tiers: {
        tam: { value: data.tam, label: 'Total Addressable Market', shareOfTam: 100 },
        sam: { value: sam, label: 'Serviceable Available Market', shareOfTam: samShareOfTam },
        som: { value: som, label: 'Serviceable Obtainable Market', shareOfTam: somShareOfTam },
      },
      conversions: {
        tamToSam: `${data.samPercent}%`,
        samToSom: `${somShareOfSam}%`,
        channelCoverage: `${round(coverage * 100)}%`,
        conversionRate: `${data.conversionRate}%`,
      },
      channelMix: { ...data.channelMix, total: channelTotal, capped: coverageCapped },
      estimatedCustomers,
      attractiveness: band(score),
      breakdown: { captureScore, coverageScore, conversionScore, absoluteScore },
      warnings: buildWarnings({ coverageCapped, channelTotal, somShareOfTam, data }),
      summary:
        `${data.currency} ${som.toLocaleString()} obtainable from a ${data.currency} ${data.tam.toLocaleString()} ` +
        `total market (${somShareOfTam}% capture).`,
    },
  };
}

function buildWarnings({ coverageCapped, channelTotal, somShareOfTam, data }) {
  const warnings = [];
  if (coverageCapped) {
    warnings.push(
      `Channel mix sums to ${channelTotal}%. Coverage was capped at 100% — SOM cannot exceed SAM.`
    );
  }
  if (channelTotal < 100 && channelTotal > 0) {
    warnings.push(`Channel mix sums to ${channelTotal}%, leaving ${100 - channelTotal}% of SAM unreached.`);
  }
  if (data.conversionRate > 25) {
    warnings.push(`A ${data.conversionRate}% conversion rate is well above typical — verify the assumption.`);
  }
  if (somShareOfTam > 10) {
    warnings.push(`Capturing ${somShareOfTam}% of TAM implies near-monopoly share — stress-test the model.`);
  }
  return warnings;
}

export default { key, title, action, inputSchema, run };
