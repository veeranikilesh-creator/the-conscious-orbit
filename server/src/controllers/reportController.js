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
    })
    .optional(),
  tags: z.array(z.string()).default([]),
  tracks: z.array(z.string()).default([]),
  customModules: z.array(z.string()).default([]),
  clusters: z.record(z.string(), z.any()).optional(),
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
