import { env } from '../config/env.js';

/* ============================================================
   SPYFU INTEGRATION — competitor keyword & domain analysis.
   Used by module 6 (MARKET RESEARCH).

   Contract: never throws and never blocks the module. When
   credentials are absent or the upstream call fails, it returns
   `live: false` with a clearly-labelled placeholder so the
   module still produces a report. Callers must surface `live`
   so nobody mistakes placeholder data for real data.
   ============================================================ */

const TIMEOUT_MS = 8000;

/** Shape returned in every case, live or not. */
function shell(domain, { live, note, ...rest }) {
  return {
    provider: 'spyfu',
    domain,
    live,
    note,
    fetchedAt: new Date().toISOString(),
    domainStats: null,
    topKeywords: [],
    topCompetitors: [],
    ...rest,
  };
}

async function getJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`SpyFu responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch competitor/keyword intelligence for a domain.
 *
 * @param {string} domain e.g. "ecofly.io"
 * @param {{ countryCode?: string, limit?: number }} [options]
 * @returns {Promise<object>} Always resolves; check `.live`.
 */
export async function fetchDomainIntelligence(domain, options = {}) {
  const { countryCode = 'US', limit = 10 } = options;

  if (!domain) {
    return shell(domain, { live: false, note: 'No domain supplied — nothing to analyse.' });
  }

  if (!env.spyfu.enabled) {
    return shell(domain, {
      live: false,
      note: 'SPYFU_API_ID / SPYFU_SECRET_KEY not configured. Returning placeholder data.',
      ...placeholderFor(domain, limit),
    });
  }

  const auth = `api_id=${encodeURIComponent(env.spyfu.apiId)}&secret_key=${encodeURIComponent(env.spyfu.secretKey)}`;
  const base = env.spyfu.baseUrl;

  try {
    // These three endpoints are the ones module 6 needs. Adjust the paths to
    // match whichever SpyFu plan the account is on.
    const [domainStats, keywords, competitors] = await Promise.all([
      getJson(`${base}/domain_stats_api/v2/getLatestDomainStats?domain=${encodeURIComponent(domain)}&countryCode=${countryCode}&${auth}`),
      getJson(`${base}/serp_api/v2/seo/getMostValuableKeywords?query=${encodeURIComponent(domain)}&pageSize=${limit}&countryCode=${countryCode}&${auth}`),
      getJson(`${base}/competitors_api/v2/seo/getTopCompetitors?domain=${encodeURIComponent(domain)}&countryCode=${countryCode}&${auth}`),
    ]);

    return shell(domain, {
      live: true,
      note: 'Live SpyFu data.',
      domainStats: domainStats?.results?.[0] ?? domainStats ?? null,
      topKeywords: (keywords?.results ?? []).slice(0, limit),
      topCompetitors: (competitors?.results ?? []).slice(0, limit),
    });
  } catch (error) {
    // Degrade rather than fail the whole report.
    return shell(domain, {
      live: false,
      note: `SpyFu request failed (${error.message}). Returning placeholder data.`,
      ...placeholderFor(domain, limit),
    });
  }
}

/** Deterministic stand-in so downstream scoring stays stable without credentials. */
function placeholderFor(domain, limit) {
  const seed = String(domain).length;
  return {
    domainStats: {
      placeholder: true,
      monthlyOrganicClicks: 1000 * seed,
      monthlyPaidClicks: 120 * seed,
      totalOrganicResults: 40 * seed,
    },
    topKeywords: Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      placeholder: true,
      keyword: `${domain} keyword ${i + 1}`,
      searchVolume: 5000 - i * 700,
      rank: i + 1,
    })),
    topCompetitors: Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
      placeholder: true,
      domain: `competitor-${i + 1}.example.com`,
      overlapScore: 80 - i * 15,
    })),
  };
}
