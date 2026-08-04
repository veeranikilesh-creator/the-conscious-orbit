import { z } from 'zod';
import { round, normalize, weightedScore, band } from '../utils/scoring.js';

/* ============================================================
   MODULE 9 — GTM (GO-TO-MARKET)
   Analyse the customer, their availability, advertising strategy
   and commands, then generate and rank strategy suggestions.
   ============================================================ */

export const key = 'gtm';
export const title = 'Go-To-Market';
export const action = 'MAPPING';

export const CHANNELS = [
  'paid-search', 'paid-social', 'seo', 'content', 'outbound',
  'partnerships', 'events', 'community', 'pr', 'referral',
];

/** Playbook per channel: cost/speed/scale characteristics drive the ranking. */
const CHANNEL_PROFILES = {
  'paid-search':  { cost: 'high',   speed: 'fast',   scale: 'high',   bestFor: ['B2C', 'B2B'], minBudget: 5000 },
  'paid-social':  { cost: 'medium', speed: 'fast',   scale: 'high',   bestFor: ['B2C'],        minBudget: 3000 },
  seo:            { cost: 'low',    speed: 'slow',   scale: 'high',   bestFor: ['B2C', 'B2B'], minBudget: 1000 },
  content:        { cost: 'low',    speed: 'slow',   scale: 'medium', bestFor: ['B2B'],        minBudget: 1000 },
  outbound:       { cost: 'medium', speed: 'medium', scale: 'medium', bestFor: ['B2B'],        minBudget: 2000 },
  partnerships:   { cost: 'low',    speed: 'slow',   scale: 'high',   bestFor: ['B2B'],        minBudget: 500 },
  events:         { cost: 'high',   speed: 'medium', scale: 'low',    bestFor: ['B2B'],        minBudget: 10000 },
  community:      { cost: 'low',    speed: 'slow',   scale: 'medium', bestFor: ['B2C'],        minBudget: 500 },
  pr:             { cost: 'medium', speed: 'medium', scale: 'medium', bestFor: ['B2C', 'B2B'], minBudget: 3000 },
  referral:       { cost: 'low',    speed: 'medium', scale: 'medium', bestFor: ['B2C'],        minBudget: 500 },
};

export const inputSchema = z.object({
  audience: z.string().min(3),
  businessModel: z.enum(['B2B', 'B2C', 'B2B2C', 'Marketplace']),
  /** Where the audience actually is, and when they can be reached. */
  availability: z
    .object({
      channels: z.array(z.enum(CHANNELS)).default([]),
      peakHours: z.string().optional(),
      geography: z.string().optional(),
      seasonality: z.string().optional(),
    })
    .default({ channels: [] }),
  advertising: z
    .object({
      monthlyBudget: z.number().nonnegative().default(0),
      currentChannels: z.array(z.enum(CHANNELS)).default([]),
      currentCac: z.number().nonnegative().optional(),
      targetCac: z.number().nonnegative().optional(),
    })
    .default({ monthlyBudget: 0, currentChannels: [] }),
  /** Explicit operator directives — "commands" — that constrain the strategy. */
  commands: z.array(z.string()).default([]),
  launchHorizonMonths: z.number().positive().default(6),
});

export function run(input) {
  const data = inputSchema.parse(input);
  const side = data.businessModel === 'B2C' || data.businessModel === 'Marketplace' ? 'B2C' : 'B2B';

  const suggestions = buildSuggestions(data, side);
  const budgetAllocation = allocateBudget(suggestions, data.advertising.monthlyBudget);

  const reachScore = normalize(data.availability.channels.length, 0, 4);
  const budgetScore = normalize(data.advertising.monthlyBudget, 0, 20000);
  const cacScore =
    data.advertising.currentCac && data.advertising.targetCac
      ? normalize(data.advertising.targetCac - data.advertising.currentCac, -data.advertising.targetCac, data.advertising.targetCac)
      : 50;
  const horizonScore = normalize(18 - Math.min(data.launchHorizonMonths, 18), 0, 18);

  const score = weightedScore([
    { value: reachScore, weight: 0.3 },
    { value: budgetScore, weight: 0.25 },
    { value: cacScore, weight: 0.25 },
    { value: horizonScore, weight: 0.2 },
  ]);

  return {
    score,
    output: {
      audience: data.audience,
      classification: side,
      availability: data.availability,
      advertising: {
        ...data.advertising,
        cacGap:
          data.advertising.currentCac && data.advertising.targetCac
            ? round(data.advertising.currentCac - data.advertising.targetCac, 2)
            : null,
      },
      commands: data.commands,
      strategy: {
        recommendedChannels: suggestions.slice(0, 4),
        allChannels: suggestions,
        budgetAllocation,
        phasing: buildPhasing(suggestions, data.launchHorizonMonths),
      },
      viability: band(score),
      breakdown: { reachScore, budgetScore, cacScore, horizonScore },
      summary:
        `${suggestions.length} channel(s) ranked for a ${side} motion targeting "${data.audience}". ` +
        `Top pick: ${suggestions[0]?.channel ?? 'none'}.`,
      recommendations: buildRecommendations(data, suggestions),
    },
  };
}

/** Rank every channel for this venture; higher fit = earlier in the list. */
function buildSuggestions(data, side) {
  return Object.entries(CHANNEL_PROFILES)
    .map(([channel, profile]) => {
      let fit = 40;
      if (profile.bestFor.includes(side)) fit += 25;
      if (data.availability.channels.includes(channel)) fit += 20; // audience is demonstrably here
      if (data.advertising.currentChannels.includes(channel)) fit += 5; // already running
      if (data.advertising.monthlyBudget < profile.minBudget) fit -= 30; // can't afford it
      if (data.launchHorizonMonths <= 3 && profile.speed === 'slow') fit -= 20; // too slow to matter

      // Operator commands act as explicit boosts/vetoes.
      const commanded = data.commands.some((c) => c.toLowerCase().includes(channel.replace('-', ' ')));
      if (commanded) fit += 15;

      return {
        channel,
        fit: Math.max(0, Math.min(100, fit)),
        ...profile,
        affordable: data.advertising.monthlyBudget >= profile.minBudget,
        audiencePresent: data.availability.channels.includes(channel),
        alreadyRunning: data.advertising.currentChannels.includes(channel),
        commanded,
      };
    })
    .sort((a, b) => b.fit - a.fit);
}

/** Split the budget across the top affordable channels, weighted by fit. */
function allocateBudget(suggestions, monthlyBudget) {
  if (!monthlyBudget) return [];
  const top = suggestions.filter((s) => s.affordable).slice(0, 4);
  const totalFit = top.reduce((sum, s) => sum + s.fit, 0);
  if (!totalFit) return [];
  return top.map((s) => ({
    channel: s.channel,
    amount: round((s.fit / totalFit) * monthlyBudget, 2),
    sharePercent: round((s.fit / totalFit) * 100, 1),
  }));
}

/** Sequence channels by how fast they pay off across the launch horizon. */
function buildPhasing(suggestions, horizonMonths) {
  const affordable = suggestions.filter((s) => s.affordable);
  return [
    {
      phase: 1,
      window: `Months 1-${Math.max(1, Math.round(horizonMonths / 3))}`,
      focus: 'Fast-payback channels to generate early signal',
      channels: affordable.filter((s) => s.speed === 'fast').slice(0, 2).map((s) => s.channel),
    },
    {
      phase: 2,
      window: `Months ${Math.max(2, Math.round(horizonMonths / 3) + 1)}-${Math.round((horizonMonths * 2) / 3)}`,
      focus: 'Medium-speed channels to broaden the funnel',
      channels: affordable.filter((s) => s.speed === 'medium').slice(0, 2).map((s) => s.channel),
    },
    {
      phase: 3,
      window: `Months ${Math.round((horizonMonths * 2) / 3) + 1}-${horizonMonths}`,
      focus: 'Compounding channels for durable acquisition',
      channels: affordable.filter((s) => s.speed === 'slow').slice(0, 2).map((s) => s.channel),
    },
  ];
}

function buildRecommendations(data, suggestions) {
  const out = [];
  const unaffordable = suggestions.filter((s) => !s.affordable && s.fit > 55);
  if (unaffordable.length) {
    out.push(`${unaffordable.map((s) => s.channel).join(', ')} fit well but exceed the current budget — raise spend or defer.`);
  }
  if (!data.availability.channels.length) out.push('No audience availability data — channel ranking is model-driven only, not evidence-driven.');
  if (data.advertising.currentCac && data.advertising.targetCac && data.advertising.currentCac > data.advertising.targetCac) {
    out.push(`CAC is ${round(data.advertising.currentCac - data.advertising.targetCac, 2)} above target — fix efficiency before scaling spend.`);
  }
  if (!out.length) out.push(`Lead with ${suggestions[0]?.channel} and layer in compounding channels from phase 3.`);
  return out;
}

export default { key, title, action, inputSchema, run };
