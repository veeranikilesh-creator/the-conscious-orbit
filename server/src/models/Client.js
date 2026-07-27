import mongoose from 'mongoose';

/* ============================================================
   CLIENT — Layer 1 of the intake engine.
   Captured once at signup; every report references one client.
   ============================================================ */

export const VERTICALS = ['students', 'institutions', 'msmes', 'industries', 'startups'];
export const BUSINESS_MODELS = ['B2B', 'B2C', 'B2B2C', 'Marketplace'];
export const STAGES = ['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Growth'];

const clientSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true, maxlength: 200 },
    vertical: { type: String, required: true, enum: VERTICALS, index: true },
    industry: { type: String, trim: true },
    stage: { type: String, enum: STAGES, default: 'Idea' },
    geography: { type: String, trim: true },
    businessModel: { type: String, enum: BUSINESS_MODELS, default: 'B2B' },
    contact: { type: String, trim: true, lowercase: true },
  },
  { timestamps: true }
);

clientSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  },
});

export const Client = mongoose.model('Client', clientSchema);
