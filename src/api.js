/* ============================================================
   API CLIENT — talks to the Express/Mongo server in `server/`.

   Point it somewhere with VITE_API_URL (see .env.example). When the
   API is unreachable every call here rejects with an ApiUnavailable
   error; App.jsx catches that and falls back to the local simulation,
   so the app stays fully usable with no backend running.
   ============================================================ */

export const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');
const FALLBACK_API_BASE = 'http://localhost:4000/api';

/** Thrown when the server answered but rejected the request. */
export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/** Thrown when the server could not be reached at all. */
export class ApiUnavailable extends Error {
  constructor(cause) {
    super('Backend API is not reachable');
    this.name = 'ApiUnavailable';
    this.cause = cause;
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let res;
  try {
    // Try primary Python FastAPI backend first
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    try {
      // Try secondary Express backend fallback
      res = await fetch(`${FALLBACK_API_BASE}${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });
    } catch (fallbackErr) {
      throw new ApiUnavailable(err);
    }
  }

  const text = await res.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    /* Two backends, two envelopes. Express is flat —
       { error, message, issues?, details? } — with zod field paths in
       `issues` (see server/src/middleware/errorHandler.js). FastAPI uses
       { detail } , where detail is either a string or a list of validation
       objects. Handle both so errors stay readable either way. */
    let detail;
    if (payload?.issues?.length) {
      detail = `${payload.message}: ${payload.issues.map((i) => `${i.path} ${i.message}`).join('; ')}`;
    } else if (Array.isArray(payload?.detail)) {
      detail = payload.detail.map((d) => `${(d.loc || []).join('.')} ${d.msg}`).join('; ');
    } else {
      detail = payload?.message || (typeof payload?.detail === 'string' ? payload.detail : undefined);
    }
    throw new ApiError(
      detail || `Request failed (${res.status})`,
      res.status,
      payload?.issues || payload?.details || payload?.detail
    );
  }

  return payload;
}

/* ---------- endpoints ---------- */

export const getHealth      = (signal) => request('/health', { signal });
export const listReports    = (signal) => request('/reports?limit=100', { signal });
export const getReport      = (id)     => request(`/reports/${id}`);
export const createReport   = (body)   => request('/reports', { method: 'POST', body });
export const deleteReport   = (id)     => request(`/reports/${id}`, { method: 'DELETE' });
export const advanceReport  = (id)     => request(`/reports/${id}/advance`, { method: 'POST' });
export const revertReport   = (id)     => request(`/reports/${id}/revert`, { method: 'POST' });
export const runModule      = (id, key, input) =>
  request(`/reports/${id}/modules/${key}`, { method: 'POST', body: input });

/**
 * Health, normalised across both backends.
 *
 * Express answers `{ ok: true, db: 'connected' | 'disconnected' }`. FastAPI
 * answers `{ status: 'ok', db: 'PostgreSQL' | 'SQLite (Local Fallback)' }` —
 * no `ok` key at all, and `db` names the driver rather than the connection
 * state. Checking for `db === 'connected'` therefore rejected FastAPI outright
 * and silently dropped the whole app into offline mode.
 *
 * The reason for testing the DB at all is Express-specific: when Mongo is down
 * the API still answers /health, but every real query then blocks for the full
 * 10s Mongoose buffer timeout. Only 'disconnected' means that; any other value
 * is a live database.
 *
 * @returns {Promise<{ ready: boolean, db: string, backend: string }>}
 */
export async function checkHealth(signal) {
  const payload = await getHealth(signal);
  const ok = payload?.ok === true || payload?.status === 'ok';
  const db = payload?.db ?? '';
  return {
    ready: ok && Boolean(db) && db !== 'disconnected',
    db,
    backend: payload?.service || 'Express + MongoDB',
  };
}

/* ---------- intake → module input mapping ---------- */

/** The server's `vertical` field is a strict five-value enum. Custom domains
 *  added in the UI carry ids like `domain_1738…`, which it would reject, so
 *  they fall back to `startups` and keep their real name in `tags`. */
const SERVER_VERTICALS = ['students', 'institutions', 'msmes', 'industries', 'startups'];
export const toServerVertical = (v) => (SERVER_VERTICALS.includes(v) ? v : 'startups');

/** The Client model's `stage` is an enum that has no "Scaleup" — the intake
 *  Select offers one. Anything unrecognised folds into the nearest valid value. */
const SERVER_STAGES = ['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Growth'];
export const toServerStage = (s) => (SERVER_STAGES.includes(s) ? s : s === 'Scaleup' ? 'Growth' : 'Idea');

/** Intake offers six business models; the modules and the Client model accept four. */
export function toServerBusinessModel(model = '') {
  if (/b2b2c/i.test(model)) return 'B2B2C';
  if (/marketplace/i.test(model)) return 'Marketplace';
  if (/b2c|d2c|consumer|p2p/i.test(model)) return 'B2C';
  return 'B2B'; // covers "B2B Enterprise" and "B2G Government"
}

/** Pull the first number out of a free-text field like "$1.2M seed" or "18 months". */
function parseAmount(text, fallback = 0) {
  if (typeof text !== 'string') return fallback;
  const m = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*([kmb])?/i);
  if (!m) return fallback;
  const n = Number(m[1]);
  const mult = { k: 1e3, m: 1e6, b: 1e9 }[(m[2] || '').toLowerCase()] || 1;
  return n * mult;
}

/** A requirements number if the user answered it, else the fallback.
 *  Form fields arrive as strings; '' / null / non-numeric mean unanswered. */
function answered(value, fallback) {
  if (value === '' || value === null || value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

const pct = (value, fallback) => Math.min(100, Math.max(0, answered(value, fallback)));

/**
 * Derive inputs for all ten modules from the Layer 1 profile, Layer 2
 * clusters, and the requirements the intake form collected. Every
 * requirement is optional — unanswered fields keep the documented defaults
 * rather than blocking the run, so a minimal submission still scores.
 *
 * `requirements` (all optional): consumerCommunication, reachableConsumers,
 * interviewsCompleted, weeklyInteractions, tam, samPercent, conversionRate,
 * technical, operational, financial, regulatory, teamCapability, ourPrice,
 * competitorLowPrice, competitorHighPrice, capitalRequired,
 * monthsToBreakEven, expectedAnnualReturn, monthlyMarketingBudget.
 */
export function buildModuleInputs({ profile, clusters, vertical, tracks = [], customModules = [], requirements = {} }) {
  const req = requirements || {};
  const industry = profile.industry?.trim() || vertical || 'Technology';
  const company = profile.company?.trim() || 'New Strategic Venture';
  const businessModel = toServerBusinessModel(profile.model);
  const isConsumer = businessModel === 'B2C';

  const problem = clusters.market.problem?.trim() ||
    `Operational inefficiencies, manual friction, and scaling bottlenecks in the ${industry} industry.`;
  const icp = clusters.market.icp?.trim() ||
    `Decision makers operating across ${industry}.`;
  const geography = clusters.launch.geography?.trim() || profile.geography?.trim() || 'Global';

  const idea = `${company} — ${industry}. ${problem}`;
  const wtp = answered(req.ourPrice, parseAmount(clusters.market.wtp, isConsumer ? 49 : 2500));
  const capital = answered(req.capitalRequired, parseAmount(clusters.launch.ask, 1_200_000));
  const breakevenMonths = answered(req.monthsToBreakEven, parseAmount(clusters.viability.breakeven, 18) || 18);

  const competitorLow = answered(req.competitorLowPrice, wtp * 0.8);
  const competitorHigh = answered(req.competitorHighPrice, wtp * 1.4);
  const competitorMid = (competitorLow + competitorHigh) / 2;

  return {
    customerDiscovery: {
      businessIdea: idea,
      problemStatement: problem,
      // If the form asked, use the honest answer — "no" legitimately scores 0.
      consumerCommunication: req.consumerCommunication ?? true,
      /* Unanswered fields get CONSERVATIVE defaults, not flattering ones —
         a score must be earned by real answers, so a blank intake lands in
         pivot territory instead of coasting past the GO threshold. */
      reachableConsumers: Math.round(answered(req.reachableConsumers, isConsumer ? 5_000 : 500)),
      interviewsCompleted: Math.round(answered(req.interviewsCompleted, 5)),
      weeklyInteractions: Math.round(answered(req.weeklyInteractions, 10)),
      channels: isConsumer ? ['social', 'community', 'email'] : ['outbound', 'events', 'referral'],
    },

    profiling: {
      sector: industry,
      businessModel,
      targetDemographics: isConsumer ? icp : undefined,
      idealCompanyProfile: isConsumer ? undefined : icp,
      employeeCountRange: isConsumer ? undefined : '50-500',
      dataCompleteness: 50,
    },

    marketSize: {
      tam: Math.max(1, answered(req.tam, 500_000_000)),
      currency: 'USD',
      samPercent: pct(req.samPercent, 12),
      channelMix: { direct: 30, partner: 20, online: 25 },
      conversionRate: pct(req.conversionRate, isConsumer ? 2 : 8),
      averageContractValue: wtp * (isConsumer ? 12 : 12),
    },

    feasibility: {
      technical: pct(req.technical, 55),
      operational: pct(req.operational, 52),
      financial: pct(req.financial, 50),
      regulatory: pct(req.regulatory, 55),
      teamCapability: pct(req.teamCapability, 58),
      b2b: isConsumer ? undefined : {
        averageContractValue: wtp * 12,
        customerAcquisitionCost: wtp * 3,
        salesCycleDays: 90,
        expectedRetentionMonths: 24,
      },
      threshold: 60,
    },

    pricing: {
      ourPrice: wtp,
      ourModel: isConsumer ? 'subscription' : 'tiered',
      ourFeatures: customModules,
      currency: 'USD',
      // User-supplied competitor bracket when given; otherwise bracket our own
      // price so the comparison is at least directionally meaningful.
      competitors: [
        { name: 'Incumbent A', price: competitorHigh, model: 'subscription', billingPeriod: 'monthly' },
        { name: 'Incumbent B', price: competitorLow, model: 'subscription', billingPeriod: 'monthly' },
        { name: 'Incumbent C', price: competitorMid, model: 'tiered', billingPeriod: 'monthly' },
      ],
    },

    marketResearch: {
      productDescription: idea,
      targetKeywords: [industry, ...tracks].filter(Boolean).slice(0, 5),
      knownCompetitors: ['Incumbent A', 'Incumbent B'],
      marketMaturity: 55,
      differentiationStrength: 65,
      countryCode: 'US',
    },

    businessModelValidation: {
      primary: {
        formSubmissions: 10,
        surveyReach: 100,
        notes: clusters.market.pain?.trim() || undefined,
      },
      secondary: { useExistingModules: true, modules: [] },
      investment: {
        capitalRequired: capital,
        monthsToBreakEven: Math.max(1, breakevenMonths),
        founderMonthsCommitted: 24,
        expectedAnnualReturn: answered(req.expectedAnnualReturn, capital * 0.25),
      },
      currency: 'USD',
    },

    gtm: {
      audience: icp,
      businessModel,
      availability: {
        channels: isConsumer
          ? ['paid-social', 'seo', 'community', 'referral']
          : ['outbound', 'events', 'content', 'partnerships'],
        geography,
      },
      advertising: {
        monthlyBudget: answered(req.monthlyMarketingBudget, Math.max(1000, Math.round(capital / 200))),
        currentChannels: [],
      },
      commands: customModules,
      launchHorizonMonths: 6,
    },

    okr: {
      objectives: [
        {
          title: `Validate ${industry} product-market fit`,
          owner: profile.contact?.trim() || 'Founder',
          keyResults: [
            { description: 'Signed pilot accounts', metric: 'accounts', baseline: 0, target: 10, current: 2, unit: 'count' },
            { description: 'Monthly recurring revenue', metric: 'MRR', baseline: 0, target: wtp * 10, current: 0, unit: 'USD' },
          ],
        },
        {
          title: clusters.launch.milestones?.trim()?.slice(0, 120) || 'Launch and scale go-to-market',
          owner: 'GTM Lead',
          keyResults: [
            { description: 'Qualified pipeline generated', metric: 'pipeline', baseline: 0, target: 100, current: 15, unit: 'leads' },
          ],
        },
      ],
      enforceCompletion: true,
    },

    industryReport: {
      executiveContext:
        `${company} operates in ${industry} as a ${profile.model || businessModel} venture at ${profile.stage || 'Seed'} stage, ` +
        `targeting ${geography}. Problem: ${problem}`,
      threshold: 60,
    },
  };
}

/* ---------- pipeline orchestration ---------- */

/** Which modules must have results before the report may leave each status.
 *  Mirrors PIPELINE_STAGES in server/src/state/actionPipeline.js. */
const STAGE_MODULES = [
  ['customerDiscovery'],
  ['profiling', 'businessModelValidation'],
  ['marketSize', 'feasibility', 'pricing', 'marketResearch', 'gtm', 'okr'],
];

/**
 * Create a report and drive it through the pipeline to PROCESSED: run each
 * stage's gating modules, advance, repeat, then run the consolidator
 * (module 7) which writes the Conscious Orbital Score and the GO/PIVOT
 * verdict onto it. The report deliberately STOPS at PROCESSED — the final
 * PROCESSED -> PUBLISHED step is the admin's approval, taken in the admin
 * console after reviewing the result. Until then the client portal shows
 * the report as awaiting approval.
 *
 * `onProgress(label, done, total)` is called between steps so the UI can show
 * where it is — this takes seconds, not the 1.9s the old simulation faked.
 */
export async function generateReportViaApi(
  { name, vertical, tags, tracks, customModules, profile, clusters, requirements },
  onProgress = () => {}
) {
  const inputs = buildModuleInputs({ profile, clusters, vertical, tracks, customModules, requirements });
  // create + every gating module + one advance per completed stage (the last
  // stage's advance is the admin's approval) + consolidate + fetch
  const totalSteps = 1 + STAGE_MODULES.flat().length + (STAGE_MODULES.length - 1) + 2;
  let done = 0;
  const tick = (label) => onProgress(label, ++done, totalSteps);

  const { report } = await createReport({
    name,
    vertical: toServerVertical(vertical),
    tags,
    tracks,
    customModules,
    clusters,
    client: {
      company: profile.company?.trim() || name,
      industry: profile.industry?.trim() || undefined,
      // Both of these are strict enums on the Client model and narrower than
      // what the intake form offers, so they must be mapped, not passed through.
      stage: toServerStage(profile.stage),
      geography: profile.geography?.trim() || undefined,
      businessModel: toServerBusinessModel(profile.model),
      contact: profile.contact?.trim() || undefined,
    },
  });
  tick('Report created');

  for (let i = 0; i < STAGE_MODULES.length; i++) {
    for (const key of STAGE_MODULES[i]) {
      await runModule(report.id, key, inputs[key]);
      tick(`Ran ${key}`);
    }
    // The last advance (PROCESSED -> PUBLISHED) belongs to the admin.
    if (i < STAGE_MODULES.length - 1) {
      await advanceReport(report.id);
      tick('Stage advanced');
    }
  }

  // Module 7 consolidates every other score and calls the decision engine.
  await runModule(report.id, 'industryReport', inputs.industryReport);
  tick('Industry report consolidated');

  const final = await getReport(report.id);
  tick('Complete');
  return final;
}
