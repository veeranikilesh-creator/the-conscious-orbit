/* ============================================================
   OFFLINE SCORING — used only when no backend is reachable.

   The old fallback invented a flattering random 86-95% GO for
   every venture. This replaces it with a deterministic estimate
   computed from what the user actually filled in, so an empty
   or weak intake honestly lands in PIVOT territory. It is still
   an approximation — the real ten-module pipeline runs on the
   server — but it moves with the answers, not with Math.random.
   ============================================================ */

const clamp = (n, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));

const norm = (value, worst, best) =>
  value === null ? null : clamp(Math.round(((value - worst) / (best - worst)) * 100));

const num = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const filled = (v) => (typeof v === 'string' ? v.trim().length > 0 : v !== null && v !== undefined);

/**
 * Estimate a verdict from the intake alone.
 * @returns {{ score: number, decision: 0|1, verdictLabel: string }}
 */
export function estimateOfflineVerdict({ profile = {}, clusters = {}, requirements = {} } = {}) {
  const req = requirements || {};
  const market = clusters.market || {};
  const viability = clusters.viability || {};
  const launch = clusters.launch || {};

  // How much of the intake was actually answered — narrative text and the
  // quantitative requirements both count (feasibility sliders always carry a
  // value, so they are scored separately below, not here).
  const answers = [
    profile.company, profile.industry, profile.geography, profile.contact,
    market.problem, market.pain, market.wtp, market.icp,
    viability.revenue, viability.margin, viability.costs, viability.breakeven,
    launch.gtm, launch.milestones, launch.ask,
    req.reachableConsumers, req.interviewsCompleted, req.weeklyInteractions,
    req.tam, req.samPercent, req.conversionRate,
    req.ourPrice, req.competitorLowPrice, req.competitorHighPrice,
    req.capitalRequired, req.monthsToBreakEven, req.expectedAnnualReturn,
    req.monthlyMarketingBudget,
  ];
  const completeness = Math.round((answers.filter(filled).length / answers.length) * 100);

  // Quantitative answers, each normalised like the real modules; an
  // unanswered number scores a sceptical 40, not a friendly default.
  const UNKNOWN = 40;
  const feasParts = [req.technical, req.operational, req.financial, req.regulatory, req.teamCapability]
    .map(num)
    .filter((v) => v !== null);
  const feasibility = feasParts.length
    ? Math.round(feasParts.reduce((a, b) => a + b, 0) / feasParts.length)
    : UNKNOWN;

  const breakeven = num(req.monthsToBreakEven);
  const parts = [
    { value: completeness, weight: 0.3 },
    { value: norm(num(req.reachableConsumers), 0, 5000) ?? UNKNOWN, weight: 0.1 },
    { value: norm(num(req.interviewsCompleted), 0, 30) ?? UNKNOWN, weight: 0.1 },
    { value: norm(num(req.conversionRate), 0, 20) ?? UNKNOWN, weight: 0.1 },
    { value: feasibility, weight: 0.2 },
    { value: breakeven === null ? UNKNOWN : norm(36 - Math.min(breakeven, 36), 0, 36), weight: 0.1 },
    { value: norm(num(req.monthlyMarketingBudget), 0, 20000) ?? UNKNOWN, weight: 0.1 },
  ];

  const total = parts.reduce((sum, p) => sum + p.weight, 0);
  let score = Math.round(parts.reduce((sum, p) => sum + clamp(p.value) * p.weight, 0) / total);

  // No path to the customer is a hard blocker, exactly as in the real module.
  if (req.consumerCommunication === false) score = Math.min(score, 35);

  score = clamp(score);
  const decision = score >= 60 ? 1 : 0;
  return { score, decision, verdictLabel: decision === 1 ? `GO (${score}%)` : `PIVOT (${score}%)` };
}

/** Deterministic per-module spread around the overall estimate, replacing
 *  the random per-card numbers the simulation used to show. */
export function offlineModuleScore(overallScore, moduleIndex) {
  const jitter = ((moduleIndex * 37) % 21) - 10; // -10..+10, stable per module
  return clamp(overallScore + jitter);
}
