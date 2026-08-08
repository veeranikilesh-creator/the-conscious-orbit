import { generateJson } from './gemini.js';
import { env } from '../config/env.js';
import { fetchDomainIntelligence } from './spyfu.js';

const ORBITA_SYSTEM_PROMPT = `You are Orbita, the AI analysis assistant for The Conscious Orbit.

You receive a venture report with 10 module scores and SpyFu competitor data.
Your job is to critically analyze each module's score and flag inconsistencies.

For each module:
- Compare the score against the module's output data
- Flag if the score seems over-scored or under-scored relative to the data
- Provide reasoning for your assessment

Give an overall assessment:
- confident_go: Strong data, scores are well-supported
- cautious_go: Mostly solid, some concerns to address
- needs_work: Significant issues with scoring or data quality
- pivot_recommended: Fundamental problems with the venture

Rules:
- Be honest and critical — don't inflate scores
- Ground every claim in the supplied data
- If a module is missing data, flag the score as unreliable
- Compare against SpyFu competitor benchmarks where available
- Keep reasoning concise and specific`;

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    moduleReviews: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          moduleKey: { type: 'string' },
          pipelineScore: { type: 'number' },
          orbitaScore: { type: 'number' },
          assessment: { type: 'string', enum: ['over_scored', 'under_scored', 'accurate'] },
          reasoning: { type: 'string' },
        },
        required: ['moduleKey', 'pipelineScore', 'orbitaScore', 'assessment', 'reasoning'],
      },
    },
    overallAssessment: {
      type: 'string',
      enum: ['confident_go', 'cautious_go', 'needs_work', 'pivot_recommended'],
    },
    keyConcerns: { type: 'array', items: { type: 'string' } },
    keyStrengths: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'moduleReviews', 'overallAssessment', 'keyConcerns', 'keyStrengths'],
};

export async function generateOrbitaAnalysis(report, moduleResults) {
  const modulesContext = {};
  for (const mr of moduleResults) {
    modulesContext[mr.moduleKey] = {
      score: mr.score,
      output: mr.output,
    };
  }

  let competitorData = null;
  try {
    competitorData = await fetchDomainIntelligence(report.client?.industry || report.vertical);
  } catch {
    competitorData = { note: 'SpyFu data unavailable' };
  }

  if (!env.gemini.enabled) {
    return {
      ...heuristicOrbitaAnalysis(modulesContext, competitorData),
      live: false,
      model: null,
      note: 'GEMINI_API_KEY not configured — returning heuristic Orbita analysis.',
    };
  }

  const userPrompt = [
    'Analyze this venture report. For each module, compare the pipeline score against the output data and flag inconsistencies.',
    '',
    '## Module Data',
    '```json',
    JSON.stringify(modulesContext, null, 2),
    '```',
    '',
    '## Competitor Data (SpyFu)',
    '```json',
    JSON.stringify(competitorData, null, 2),
    '```',
    '',
    'Provide your analysis.',
  ].join('\n');

  const result = await generateJson(ORBITA_SYSTEM_PROMPT, userPrompt, ANALYSIS_SCHEMA);
  if (!result) {
    return {
      ...heuristicOrbitaAnalysis(modulesContext, competitorData),
      live: false,
      model: env.gemini.model,
      note: 'Gemini call failed or returned no usable answer — returning heuristic analysis.',
    };
  }

  return { ...result.data, live: true, model: result.model };
}

function heuristicOrbitaAnalysis(modulesContext, competitorData) {
  const moduleReviews = Object.entries(modulesContext).map(([moduleKey, data]) => ({
    moduleKey,
    pipelineScore: data.score,
    orbitaScore: data.score,
    assessment: 'accurate',
    reasoning: 'Heuristic analysis — no AI model available. Pipeline score used as-is.',
  }));

  const scores = Object.values(modulesContext).map((m) => m.score);
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  return {
    summary: `Heuristic analysis of ${moduleReviews.length} modules. Average pipeline score: ${Math.round(avg)}/100. No language model was consulted.`,
    moduleReviews,
    overallAssessment: avg >= 70 ? 'confident_go' : avg >= 50 ? 'cautious_go' : avg >= 30 ? 'needs_work' : 'pivot_recommended',
    keyConcerns: moduleReviews.length < 5 ? ['Analysis based on incomplete pipeline data.'] : [],
    keyStrengths: avg >= 70 ? ['Pipeline scores are generally strong.'] : [],
  };
}
