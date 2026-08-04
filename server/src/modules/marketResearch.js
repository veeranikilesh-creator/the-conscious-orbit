import { z } from 'zod';
import { normalize, weightedScore, band } from '../utils/scoring.js';
import { fetchDomainIntelligence } from '../integrations/spyfu.js';

/* ============================================================
   MODULE 6 — MARKET RESEARCH
   Analyse the customer's competition, business and product,
   enriched with SpyFu competitor keyword/domain analysis.

   This module is async — it awaits the SpyFu integration.
   ============================================================ */

export const key = 'marketResearch';
export const title = 'Market Research';
export const action = 'MAPPING';

export const inputSchema = z.object({
  domain: z.string().optional(),
  productDescription: z.string().min(10),
  targetKeywords: z.array(z.string()).default([]),
  knownCompetitors: z.array(z.string()).default([]),
  /** 0–100 analyst assessments. */
  marketMaturity: z.number().min(0).max(100).default(50),
  differentiationStrength: z.number().min(0).max(100).default(50),
  countryCode: z.string().length(2).default('US'),
});

export async function run(input) {
  const data = inputSchema.parse(input);

  // The SpyFu integration never throws — it degrades to placeholder data.
  const spyfu = await fetchDomainIntelligence(data.domain, {
    countryCode: data.countryCode,
    limit: 10,
  });

  const discoveredCompetitors = (spyfu.topCompetitors ?? []).map((c) => c.domain).filter(Boolean);
  const allCompetitors = [...new Set([...data.knownCompetitors, ...discoveredCompetitors])];

  const keywordOverlap = computeKeywordOverlap(data.targetKeywords, spyfu.topKeywords ?? []);

  // A crowded market with weak differentiation scores poorly; a maturing market
  // with real differentiation scores well.
  const competitionScore = normalize(12 - Math.min(allCompetitors.length, 12), 0, 12);
  const keywordScore = normalize(keywordOverlap.matched.length, 0, Math.max(data.targetKeywords.length, 1));

  const score = weightedScore([
    { value: data.differentiationStrength, weight: 0.35 },
    { value: competitionScore, weight: 0.25 },
    { value: data.marketMaturity, weight: 0.2 },
    { value: keywordScore, weight: 0.2 },
  ]);

  return {
    score,
    integrations: { spyfu: { used: true, live: spyfu.live } },
    output: {
      product: { description: data.productDescription, domain: data.domain ?? null },
      competition: {
        known: data.knownCompetitors,
        discovered: discoveredCompetitors,
        total: allCompetitors.length,
        intensity: allCompetitors.length >= 8 ? 'CROWDED' : allCompetitors.length >= 4 ? 'CONTESTED' : 'OPEN',
      },
      keywords: {
        targeted: data.targetKeywords,
        ...keywordOverlap,
      },
      spyfu: {
        live: spyfu.live,
        note: spyfu.note,
        fetchedAt: spyfu.fetchedAt,
        domainStats: spyfu.domainStats,
        topKeywords: spyfu.topKeywords,
        topCompetitors: spyfu.topCompetitors,
      },
      whitespace: band(score),
      breakdown: { competitionScore, keywordScore, marketMaturity: data.marketMaturity, differentiationStrength: data.differentiationStrength },
      summary:
        `${allCompetitors.length} competitor(s) identified in a ${allCompetitors.length >= 8 ? 'crowded' : 'contested'} market. ` +
        (spyfu.live ? 'Enriched with live SpyFu data.' : 'SpyFu data is placeholder — configure credentials for live intelligence.'),
      recommendations: buildRecommendations({ allCompetitors, keywordOverlap, spyfu, data }),
    },
  };
}

function computeKeywordOverlap(targeted, spyfuKeywords) {
  const spyfuSet = new Set(spyfuKeywords.map((k) => String(k.keyword ?? '').toLowerCase()));
  const matched = targeted.filter((k) => spyfuSet.has(k.toLowerCase()));
  const unclaimed = targeted.filter((k) => !spyfuSet.has(k.toLowerCase()));
  return { matched, unclaimed };
}

function buildRecommendations({ allCompetitors, keywordOverlap, spyfu, data }) {
  const out = [];
  if (!spyfu.live) out.push('Configure SPYFU_API_ID and SPYFU_SECRET_KEY — the competitor analysis is currently placeholder data.');
  if (allCompetitors.length >= 8) out.push('Crowded field — differentiation, not feature parity, is the only viable wedge.');
  if (keywordOverlap.unclaimed.length) {
    out.push(`${keywordOverlap.unclaimed.length} targeted keyword(s) show no competitor presence — potential whitespace.`);
  }
  if (data.differentiationStrength < 50) out.push('Differentiation is below par; sharpen the product wedge before scaling spend.');
  if (!out.length) out.push('Competitive position is defensible — proceed to business-model validation.');
  return out;
}

export default { key, title, action, inputSchema, run, isAsync: true };
