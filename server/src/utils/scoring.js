/* ============================================================
   SCORING PRIMITIVES
   Shared by the 10 modules so every 0–100 score is produced the
   same way and the final Orbital Score stays comparable.
   ============================================================ */

export const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n));

export const round = (n, dp = 0) => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

/** Safe division — returns `fallback` instead of NaN/Infinity. */
export const ratio = (numerator, denominator, fallback = 0) =>
  denominator ? numerator / denominator : fallback;

/**
 * Weighted mean of {value, weight} pairs, normalised so the weights need not
 * sum to exactly 1. Returns 0 when no weight is supplied.
 * @param {{value:number, weight:number}[]} parts
 */
export function weightedScore(parts) {
  const totalWeight = parts.reduce((sum, p) => sum + (p.weight || 0), 0);
  if (!totalWeight) return 0;
  const total = parts.reduce((sum, p) => sum + clamp(p.value) * (p.weight || 0), 0);
  return round(total / totalWeight);
}

/**
 * The binary verdict the whole platform funnels toward.
 * @param {number} score 0–100
 * @param {number} threshold Score at or above which the venture proceeds.
 * @returns {{ decision: 1|0, label: 'PROCEED'|'PIVOT', score: number, threshold: number }}
 */
export function verdict(score, threshold = 60) {
  const s = clamp(round(score));
  return {
    score: s,
    threshold,
    decision: s >= threshold ? 1 : 0,
    label: s >= threshold ? 'PROCEED' : 'PIVOT',
  };
}

/** Map a raw value onto 0–100 given the range considered worst→best. */
export function normalize(value, worst, best) {
  if (worst === best) return 0;
  return clamp(round(((value - worst) / (best - worst)) * 100));
}

/** Bucket a 0–100 score into a qualitative band. */
export function band(score) {
  const s = clamp(score);
  if (s >= 80) return 'STRONG';
  if (s >= 60) return 'VIABLE';
  if (s >= 40) return 'MARGINAL';
  return 'WEAK';
}
