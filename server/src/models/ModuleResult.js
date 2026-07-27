import mongoose from 'mongoose';

/* ============================================================
   MODULE RESULT — one document per (report, module) pair.

   Every one of the 10 modules writes here. `input` is what the
   caller submitted, `output` is what the module computed, and
   `score` is that module's 0–100 contribution to the final
   Orbital Score. Re-running a module upserts rather than
   duplicating, so a report has at most one result per module.
   ============================================================ */

export const MODULE_KEYS = [
  'customerDiscovery',
  'profiling',
  'marketSize',
  'feasibility',
  'pricing',
  'marketResearch',
  'industryReport',
  'businessModelValidation',
  'gtm',
  'okr',
];

const moduleResultSchema = new mongoose.Schema(
  {
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true, index: true },
    moduleKey: { type: String, required: true, enum: MODULE_KEYS },

    /** Raw submitted payload, kept for audit and re-runs. */
    input: { type: mongoose.Schema.Types.Mixed, default: {} },
    /** Module-specific computed output. */
    output: { type: mongoose.Schema.Types.Mixed, default: {} },

    /** 0–100 contribution; null for modules that don't score (e.g. OKR tracking). */
    score: { type: Number, min: 0, max: 100, default: null },
    /** Which pipeline action produced this result. */
    action: String,

    /** Populated when the module called an external service. */
    integrations: {
      spyfu: { used: { type: Boolean, default: false }, live: { type: Boolean, default: false } },
      ai: { used: { type: Boolean, default: false }, live: { type: Boolean, default: false }, model: String },
    },
  },
  { timestamps: true }
);

// One result per module per report — re-running overwrites.
moduleResultSchema.index({ report: 1, moduleKey: 1 }, { unique: true });

moduleResultSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  },
});

export const ModuleResult = mongoose.model('ModuleResult', moduleResultSchema);
