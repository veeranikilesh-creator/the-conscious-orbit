import mongoose from 'mongoose';
import { REPORT_STATUSES, INITIAL_STATUS } from '../state/reportState.js';
import { ACTIONS, actionForStatus } from '../state/actionPipeline.js';
import { VERTICALS } from './Client.js';

/* ============================================================
   REPORT — the unit of work that moves through the pipeline.

   toJSON emits exactly the shape the existing frontend already
   renders on the Kanban board ({ id, name, vertical, tags,
   status, score }), so the UI needs no changes to consume it.
   ============================================================ */

/** Layer 2 cluster answers — free-form per cluster, validated at the module layer. */
const clustersSchema = new mongoose.Schema(
  {
    market: {
      problem: String,
      pain: String,
      wtp: String,
      icp: String,
    },
    viability: {
      revenue: String,
      margin: String,
      costs: String,
      breakeven: String,
    },
    launch: {
      geography: String,
      gtm: String,
      milestones: String,
      ask: String,
    },
  },
  { _id: false }
);

/** One entry per status change — the report's own history. */
const transitionSchema = new mongoose.Schema(
  {
    from: { type: String, enum: [...REPORT_STATUSES, null] },
    to: { type: String, enum: REPORT_STATUSES, required: true },
    action: { type: String, enum: ACTIONS },
    at: { type: Date, default: Date.now },
    note: String,
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', index: true },
    vertical: { type: String, required: true, enum: VERTICALS, index: true },
    tags: { type: [String], default: [] },

    status: { type: String, enum: REPORT_STATUSES, default: INITIAL_STATUS, index: true },
    action: { type: String, enum: ACTIONS, default: actionForStatus(INITIAL_STATUS) },

    /** Final Conscious Orbital Score, 0–100. Zero until the aggregate runs. */
    score: { type: Number, default: 0, min: 0, max: 100 },
    /** Binary GO/PIVOT verdict, null until scored. */
    decision: { type: Number, enum: [0, 1, null], default: null },

    /** Selected flagship tracks + build-your-own modules. */
    tracks: { type: [String], default: [] },
    customModules: { type: [String], default: [] },

    clusters: { type: clustersSchema, default: () => ({}) },

    /** Module keys with a stored result — read by the action-pipeline gate. */
    completedModules: { type: [String], default: [] },

    transitions: { type: [transitionSchema], default: [] },
    publishedAt: Date,
  },
  { timestamps: true }
);

reportSchema.index({ status: 1, vertical: 1 });
reportSchema.index({ name: 'text', tags: 'text' });

/** Record a transition on the document without saving it. */
reportSchema.methods.recordTransition = function recordTransition(to, note) {
  this.transitions.push({ from: this.status, to, action: actionForStatus(to), note });
  this.status = to;
  this.action = actionForStatus(to);
  if (to === 'PUBLISHED') this.publishedAt = new Date();
  return this;
};

reportSchema.methods.markModuleComplete = function markModuleComplete(moduleKey) {
  if (!this.completedModules.includes(moduleKey)) this.completedModules.push(moduleKey);
  return this;
};

reportSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  },
});

export const Report = mongoose.model('Report', reportSchema);
