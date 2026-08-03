import { ModuleResult } from '../models/ModuleResult.js';
import { ApiError } from '../utils/ApiError.js';
import { getModule, moduleCatalogue, runModule } from '../modules/index.js';
import { verdict } from '../utils/scoring.js';

/* ============================================================
   MODULE CONTROLLER
   One generic handler drives all 10 modules. Each one:
     1. validates input against its own zod schema (inside run())
     2. computes its output + 0-100 score
     3. upserts a ModuleResult
     4. marks the module complete on the report
   ============================================================ */

/** GET /api/modules — catalogue of the 10 modules. */
export async function listModules(_req, res) {
  res.json({ modules: moduleCatalogue() });
}

/** POST /api/reports/:reportId/modules/:moduleKey — run one module. */
export async function executeModule(req, res) {
  const { moduleKey } = req.params;
  const mod = getModule(moduleKey);
  if (!mod) throw ApiError.notFound(`Module "${moduleKey}"`);

  // Sibling results are context for the modules that consolidate (7 and 8).
  const existing = await ModuleResult.find({ report: req.report.id });
  const moduleResults = Object.fromEntries(existing.map((r) => [r.moduleKey, r.toJSON()]));

  const { output, score = null, integrations = {} } = await runModule(moduleKey, req.body ?? {}, {
    report: req.report.toJSON(),
    moduleResults,
  });

  const result = await ModuleResult.findOneAndUpdate(
    { report: req.report.id, moduleKey },
    {
      report: req.report.id,
      moduleKey,
      input: req.body ?? {},
      output,
      score,
      action: mod.action,
      integrations,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  req.report.markModuleComplete(moduleKey);

  // Module 7 is the consolidator — its verdict becomes the report's own score.
  if (moduleKey === 'industryReport') {
    const v = verdict(output.orbitalScore);
    req.report.score = output.decision?.score ?? v.score;
    req.report.decision = output.decision?.decision ?? v.decision;
  }

  await req.report.save();

  res.status(200).json({ result, report: req.report });
}

/** GET /api/reports/:reportId/modules — every stored result for a report. */
export async function listModuleResults(req, res) {
  const results = await ModuleResult.find({ report: req.report.id }).sort({ createdAt: 1 });
  res.json({
    results: Object.fromEntries(results.map((r) => [r.moduleKey, r])),
    completed: results.map((r) => r.moduleKey),
  });
}

/** GET /api/reports/:reportId/modules/:moduleKey — one stored result. */
export async function getModuleResult(req, res) {
  const { moduleKey } = req.params;
  if (!getModule(moduleKey)) throw ApiError.notFound(`Module "${moduleKey}"`);

  const result = await ModuleResult.findOne({ report: req.report.id, moduleKey });
  if (!result) throw ApiError.notFound(`Result for module "${moduleKey}"`);
  res.json({ result });
}

/** DELETE /api/reports/:reportId/modules/:moduleKey — clear a result and re-open the gate. */
export async function deleteModuleResult(req, res) {
  const { moduleKey } = req.params;
  const deleted = await ModuleResult.findOneAndDelete({ report: req.report.id, moduleKey });
  if (!deleted) throw ApiError.notFound(`Result for module "${moduleKey}"`);

  req.report.completedModules = req.report.completedModules.filter((k) => k !== moduleKey);
  await req.report.save();
  res.status(204).end();
}
