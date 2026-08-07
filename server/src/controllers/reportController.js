import { z } from 'zod';
import { Report } from '../models/Report.js';
import { Client, VERTICALS } from '../models/Client.js';
import { ModuleResult } from '../models/ModuleResult.js';
import { ApiError } from '../utils/ApiError.js';
import {
  REPORT_STATUSES,
  assertTransition,
  step,
  nextStatus,
  previousStatus,
} from '../state/reportState.js';
import {
  PIPELINE_STAGES,
  actionForStatus,
  missingModulesForStage,
  pipelineProgress,
} from '../state/actionPipeline.js';

const createSchema = z.object({
  name: z.string().min(1).max(200),
  vertical: z.enum(VERTICALS),
  clientId: z.string().optional(),
  client: z
    .object({
      company: z.string().min(1),
      industry: z.string().optional(),
      stage: z.string().optional(),
      geography: z.string().optional(),
      businessModel: z.string().optional(),
      contact: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
  tags: z.array(z.string()).default([]),
  tracks: z.array(z.string()).default([]),
  customModules: z.array(z.string()).default([]),
  clusters: z.record(z.string(), z.any()).optional(),
  intakeData: z.record(z.string(), z.any()).optional(),
});

/** POST /api/reports — create a report at RECEIVED. */
export async function createReport(req, res) {
  const data = createSchema.parse(req.body);

  let clientId = data.clientId;
  if (!clientId && data.client) {
    const client = await Client.create({ ...data.client, vertical: data.vertical });
    clientId = client.id;
  }

  const report = await Report.create({
    name: data.name,
    vertical: data.vertical,
    client: clientId,
    tags: data.tags,
    tracks: data.tracks,
    customModules: data.customModules,
    clusters: data.clusters ?? {},
    intakeData: data.intakeData ?? null,
    transitions: [{ from: null, to: 'RECEIVED', action: actionForStatus('RECEIVED'), note: 'Report created' }],
  });

  res.status(201).json({ report });
}

/** GET /api/reports — list with optional filters. */
export async function listReports(req, res) {
  const { status, vertical, search, limit = 50, skip = 0 } = req.query;

  const query = {};
  if (status) {
    if (!REPORT_STATUSES.includes(status)) {
      throw ApiError.badRequest(`Unknown status "${status}"`);
    }
    query.status = status;
  }
  if (vertical) query.vertical = vertical;
  if (search) {
    const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ name: rx }, { tags: rx }, { vertical: rx }];
  }

  const [reports, total] = await Promise.all([
    Report.find(query).sort({ createdAt: -1 }).limit(Math.min(Number(limit), 200)).skip(Number(skip)).populate('client'),
    Report.countDocuments(query),
  ]);

  res.json({ reports, total, limit: Number(limit), skip: Number(skip) });
}

/** GET /api/reports/:reportId — one report plus its module results. */
export async function getReport(req, res) {
  const results = await ModuleResult.find({ report: req.report.id });
  res.json({
    report: req.report,
    moduleResults: Object.fromEntries(results.map((r) => [r.moduleKey, r])),
    pipeline: buildPipelineView(req.report),
  });
}

/** GET /api/reports/:reportId/pipeline — status + action + gate state. */
export async function getPipeline(req, res) {
  res.json({ pipeline: buildPipelineView(req.report) });
}

/** PATCH /api/reports/:reportId/status — explicit transition. */
export async function setStatus(req, res) {
  const { status, note } = z.object({ status: z.string(), note: z.string().optional() }).parse(req.body);

  assertTransition(req.report.status, status);
  req.report.recordTransition(status, note);
  await req.report.save();

  res.json({ report: req.report, pipeline: buildPipelineView(req.report) });
}

/** POST /api/reports/:reportId/advance — move one stage forward. */
export async function advanceReport(req, res) {
  const to = step(req.report.status, 1);
  req.report.recordTransition(to, req.body?.note ?? 'Advanced one stage');
  await req.report.save();
  res.json({ report: req.report, pipeline: buildPipelineView(req.report) });
}

/** POST /api/reports/:reportId/revert — move one stage back. */
export async function revertReport(req, res) {
  const to = step(req.report.status, -1);
  req.report.recordTransition(to, req.body?.note ?? 'Reverted one stage');
  await req.report.save();
  res.json({ report: req.report, pipeline: buildPipelineView(req.report) });
}

/** POST /api/reports/:reportId/generate — run all modules and generate scores.
 *  Triggered by admin after reviewing intake data. */
export async function generateReport(req, res) {
  const report = req.report;

  if (report.status !== 'RECEIVED') {
    return res.status(409).json({
      error: 'Report not in RECEIVED status',
      message: `Report is currently ${report.status}. Can only generate from RECEIVED status.`,
    });
  }

  // Import the module runner
  const { getModule, runModule } = await import('../modules/index.js');
  const { verdict } = await import('../utils/scoring.js');

  // Build module inputs from intake data and clusters
  const intakeData = report.intakeData ? Object.fromEntries(report.intakeData) : {};
  const clusters = report.clusters ? Object.fromEntries(
    Object.entries(report.clusters).map(([k, v]) => [k, v ? Object.fromEntries(Object.entries(v)) : {}])
  ) : {};

  // Define which modules run in each stage
  const stageModules = [
    ['customerDiscovery'],
    ['profiling', 'businessModelValidation'],
    ['marketSize', 'feasibility', 'pricing', 'marketResearch', 'gtm', 'okr', 'industryReport'],
  ];

  // Run all modules and advance through stages
  for (const moduleKeys of stageModules) {
    for (const key of moduleKeys) {
      const mod = getModule(key);
      if (!mod) continue;

      // Build input from intake data
      const input = intakeData[key] || intakeData;

      try {
        const existing = await ModuleResult.find({ report: report.id });
        const moduleResults = Object.fromEntries(existing.map((r) => [r.moduleKey, r.toJSON()]));

        const { output, score = null, integrations = {} } = await runModule(key, input, {
          report: report.toJSON(),
          moduleResults,
        });

        await ModuleResult.findOneAndUpdate(
          { report: report.id, moduleKey: key },
          {
            report: report.id,
            moduleKey: key,
            input,
            output,
            score,
            action: mod.action,
            integrations,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        report.markModuleComplete(key);

        // Module 7 is the consolidator
        if (key === 'industryReport') {
          const v = verdict(output.orbitalScore);
          report.score = output.decision?.score ?? v.score;
          report.decision = output.decision?.decision ?? v.decision;
        }
      } catch (err) {
        console.error(`Module ${key} failed:`, err.message);
      }
    }

    // Advance to next stage
    try {
      const { step: stepFn } = await import('../state/reportState.js');
      const next = stepFn(report.status, 1);
      report.recordTransition(next, `Advanced after ${moduleKeys.join(', ')}`);
    } catch (err) {
      console.error('Advance failed:', err.message);
    }
  }

  await report.save();
  res.json({ report: report.toJSON(), pipeline: buildPipelineView(report) });
}

/** DELETE /api/reports/:reportId — remove the report and its module results. */
export async function deleteReport(req, res) {
  await ModuleResult.deleteMany({ report: req.report.id });
  await req.report.deleteOne();
  res.status(204).end();
}

/** Shared status + action + gate projection. */
function buildPipelineView(report) {
  const missing = missingModulesForStage(report.status, report.completedModules);
  return {
    status: report.status,
    action: actionForStatus(report.status),
    progressPercent: pipelineProgress(report.status),
    canAdvance: Boolean(nextStatus(report.status)) && missing.length === 0,
    canRevert: Boolean(previousStatus(report.status)),
    nextStatus: nextStatus(report.status),
    previousStatus: previousStatus(report.status),
    missingModules: missing,
    completedModules: report.completedModules,
    stages: PIPELINE_STAGES.map((stage) => ({
      ...stage,
      reached: REPORT_STATUSES.indexOf(report.status) >= REPORT_STATUSES.indexOf(stage.status),
      current: stage.status === report.status,
    })),
    transitions: report.transitions,
  };
}
