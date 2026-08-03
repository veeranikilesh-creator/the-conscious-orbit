import { z } from 'zod';
import { clamp, normalize, round, weightedScore, band } from '../utils/scoring.js';

/* ============================================================
   MODULE 1 — CUSTOMER DISCOVERY
   Input:  business idea / problem statement.
   Logic:  can we communicate with the consumer? If yes, how many?
   Output: interaction volume + a discovery readiness score.
   ============================================================ */

export const key = 'customerDiscovery';
export const title = 'Customer Discovery';
export const action = 'SCRUMING';

export const inputSchema = z.object({
  businessIdea: z.string().min(10, 'Describe the business idea in at least 10 characters'),
  problemStatement: z.string().min(10).optional(),
  /** Can the venture actually reach its consumers? */
  consumerCommunication: z.boolean().default(false),
  /** "How many" — only meaningful when communication is possible. */
  reachableConsumers: z.number().int().nonnegative().default(0),
  interviewsCompleted: z.number().int().nonnegative().default(0),
  weeklyInteractions: z.number().int().nonnegative().default(0),
  channels: z.array(z.string()).default([]),
});

/**
 * @param {z.infer<typeof inputSchema>} input
 * @returns {{ output: object, score: number }}
 */
export function run(input) {
  const data = inputSchema.parse(input);

  // The gate: without a path to the consumer, discovery cannot proceed and the
  // "how many" question is moot.
  if (!data.consumerCommunication) {
    return {
      score: 0,
      output: {
        communicationFeasible: false,
        reachableConsumers: 0,
        interactionVolume: { weekly: 0, total: 0 },
        readiness: 'BLOCKED',
        summary:
          'No viable channel to the consumer was identified. Establish a communication path before proceeding — every downstream module depends on it.',
        recommendations: [
          'Identify at least one direct channel to the target consumer.',
          'Run 5 exploratory conversations to confirm the problem exists.',
        ],
      },
    };
  }

  // Volume sub-scores. Thresholds encode "what good looks like" at discovery stage.
  const reachScore = normalize(data.reachableConsumers, 0, 500);
  const interviewScore = normalize(data.interviewsCompleted, 0, 30);
  const cadenceScore = normalize(data.weeklyInteractions, 0, 20);
  const channelScore = normalize(data.channels.length, 0, 3);

  const score = weightedScore([
    { value: reachScore, weight: 0.3 },
    { value: interviewScore, weight: 0.35 },
    { value: cadenceScore, weight: 0.25 },
    { value: channelScore, weight: 0.1 },
  ]);

  return {
    score,
    output: {
      communicationFeasible: true,
      reachableConsumers: data.reachableConsumers,
      interactionVolume: {
        weekly: data.weeklyInteractions,
        total: data.interviewsCompleted,
        annualisedProjection: round(data.weeklyInteractions * 52),
      },
      channels: data.channels,
      breakdown: { reachScore, interviewScore, cadenceScore, channelScore },
      readiness: band(score),
      summary:
        `Consumer communication is feasible across ${data.channels.length || 'unspecified'} channel(s), ` +
        `reaching ${data.reachableConsumers} consumers with ${data.weeklyInteractions} interactions per week.`,
      recommendations: buildRecommendations(data, { interviewScore, cadenceScore }),
    },
  };
}

function buildRecommendations(data, { interviewScore, cadenceScore }) {
  const out = [];
  if (interviewScore < 50) out.push('Complete at least 15 discovery interviews before sizing the market.');
  if (cadenceScore < 50) out.push('Raise weekly consumer contact — a thin cadence produces stale signal.');
  if (data.channels.length < 2) out.push('Add a second reach channel to reduce single-channel dependency.');
  if (!out.length) out.push('Discovery volume is sufficient — proceed to sector profiling.');
  return out;
}

export default { key, title, action, inputSchema, run };
