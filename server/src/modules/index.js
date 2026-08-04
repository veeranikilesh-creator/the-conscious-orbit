import customerDiscovery from './customerDiscovery.js';
import profiling from './profiling.js';
import marketSize from './marketSize.js';
import feasibility from './feasibility.js';
import pricing from './pricing.js';
import marketResearch from './marketResearch.js';
import industryReport from './industryReport.js';
import businessModelValidation from './businessModelValidation.js';
import gtm from './gtm.js';
import okr from './okr.js';

/* ============================================================
   MODULE REGISTRY
   The single place every module is wired in. Routes and
   controllers dispatch through this — adding an 11th module
   means adding one import and one entry here, nothing else.
   ============================================================ */

export const modules = {
  customerDiscovery,
  profiling,
  marketSize,
  feasibility,
  pricing,
  marketResearch,
  industryReport,
  businessModelValidation,
  gtm,
  okr,
};

export const moduleKeys = Object.keys(modules);

export const getModule = (key) => modules[key] ?? null;

/** Lightweight descriptors for the module-catalogue endpoint. */
export const moduleCatalogue = () =>
  moduleKeys.map((key) => ({
    key,
    title: modules[key].title,
    action: modules[key].action,
    async: Boolean(modules[key].isAsync),
    needsContext: Boolean(modules[key].needsContext),
  }));

/**
 * Execute a module uniformly, whether it is sync or async and whether or not
 * it needs sibling module results.
 *
 * @param {string} key Module key.
 * @param {object} input Caller-supplied payload.
 * @param {object} context { report, moduleResults }
 */
export async function runModule(key, input, context = {}) {
  const mod = getModule(key);
  if (!mod) throw new Error(`Unknown module "${key}"`);
  return await mod.run(input, context);
}
