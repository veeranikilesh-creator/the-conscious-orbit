import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, TrendingUp, DollarSign, FileText, Target,
  BarChart3, Cpu, Zap, Layers,
  Briefcase, Award, Loader2,
} from 'lucide-react';
import { GlassPanel } from './ui.jsx';

/* ============================================================
   VENTURE PROCESSOR — Ultra-Luxury Processing Architecture
   ============================================================ */

const PIPELINE = [
  {
    stage: 'RECEIVED',
    title: 'Customer Discovery',
    modules: [
      { name: 'Scrum Engine', icon: Cpu },
      { name: 'Discovery Form', icon: FileText },
    ],
    input: 'Idea Statement',
    output: 'Interaction Volume',
    desc: 'Capture the core business idea / problem statement and evaluate direct consumer communication feasibility.',
    detail: [
      { label: 'Business Idea / Problem', value: 'Autonomous solar drones for rural medical delivery' },
      { label: 'Consumer Communication', value: 'Feasible — direct clinic outreach' },
      { label: 'Interaction Volume', value: '45 stakeholders · 12 weekly' },
    ],
    color: 'royal',
  },
  {
    stage: 'PENDING',
    title: 'Requirement & Profiling',
    modules: [
      { name: 'Profiling Classifier', icon: Briefcase },
      { name: 'Sector Mapping', icon: Layers },
    ],
    input: 'B2B / B2C Categorization',
    output: 'Sector Profile',
    desc: 'Classify the business model, then map consumer demographics, target industry, and ideal company profile.',
    detail: [
      { label: 'Model Classification', value: 'B2B' },
      { label: 'Target Sector', value: 'Logistics · Healthcare · Remote Aviation' },
      { label: 'Ideal Company Profile', value: 'Regional health networks, 50+ clinics' },
    ],
    color: 'gold',
  },
  {
    stage: 'PROCESSED',
    title: 'Market Sizing',
    modules: [
      { name: 'TAM/SAM/SOM Calculator', icon: BarChart3 },
      { name: 'Viability Diagnostic', icon: TrendingUp },
    ],
    input: 'Industry Data & Conversion Rates',
    output: 'Converted Market Size & Score',
    desc: 'Calculate Total Addressable Market, Serviceable Available Market, and Serviceable Obtainable Market conversion rates.',
    detail: [
      { label: 'TAM (Total Addressable)', value: '$50,000,000' },
      { label: 'SAM (Serviceable Available)', value: '$7,500,000 (15%)' },
      { label: 'SOM (Serviceable Obtainable)', value: '$750,000 (10% SAM)' },
    ],
    color: 'purple',
  },
  {
    stage: 'PUBLISHED',
    title: 'Strategy Engine',
    modules: [
      { name: 'GTM & Pricing Engine', icon: DollarSign },
      { name: 'Score Aggregator', icon: Award },
    ],
    input: 'Cluster Forms + Track Catalogue',
    output: 'Final Score (0-100) & Decision (1/0)',
    desc: 'Synthesize profile data, market size, and custom tracks into the Conscious Orbital Score and binary viability decision.',
    detail: [
      { label: 'Conscious Orbital Score', value: '86 / 100' },
      { label: 'Decision Verdict', value: '1 · PROCEED (Viable)' },
      { label: 'Deliverable Status', value: 'Report Generated & Unlocked' },
    ],
    color: 'emerald',
  },
];

const COLOR_MAP = {
  royal: {
    badge: 'bg-[#FFF1F2] text-[#7A0018] border-[#FECDD3]',
    border: 'border-[#FECDD3]',
    bg: 'bg-[#FFF1F2]',
    text: 'text-[#7A0018]',
    fill: 'bg-[#7A0018]',
  },
  gold: {
    badge: 'bg-[#FBF3D5] text-[#78350F] border-[#E6C878]',
    border: 'border-[#E6C878]',
    bg: 'bg-[#FBF3D5]',
    text: 'text-[#78350F]',
    fill: 'bg-[#D4AF37]',
  },
  purple: {
    badge: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
    border: 'border-[#DDD6FE]',
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#7C3AED]',
    fill: 'bg-[#7C3AED]',
  },
  emerald: {
    badge: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
    border: 'border-[#A7F3D0]',
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#059669]',
    fill: 'bg-[#059669]',
  },
};

export default function VentureProcessor() {
  const [activeStage, setActiveStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const current = PIPELINE[activeStage];

  const handleSimulate = () => {
    setIsProcessing(true);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < PIPELINE.length) {
        setActiveStage(step);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 1100);
  };

  return (
    <section className="space-y-8">
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[#7A0018]" />
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#7A0018]">
              Processing Architecture
            </span>
          </div>
          <h2 className="mt-1 font-sans text-2xl font-bold leading-tight text-[#111827] md:text-3xl">
            Venture Intelligence Pipeline
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[#6B7280]">
            Interactive four-stage pipeline: from raw discovery input to the final Conscious Orbital Score.
          </p>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isProcessing}
          className="btn-royal-red flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Processing Stages...
            </>
          ) : (
            <>
              <Zap size={14} /> Run Live Pipeline
            </>
          )}
        </button>
      </div>

      {/* PIPELINE NODES STRIP */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PIPELINE.map((p, i) => {
          const colors = COLOR_MAP[p.color];
          const active = activeStage === i;
          return (
            <button
              key={p.stage}
              onClick={() => setActiveStage(i)}
              className={`group relative flex flex-col rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                active
                  ? 'border-[#D4AF37] bg-[#FFFFFF] shadow-md ring-1 ring-[#D4AF37]'
                  : 'border-[#E6C878]/60 bg-[#FFFCF7] hover:border-[#D4AF37]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#6B7280]">
                  Stage 0{i + 1}
                </span>
                <span className={`rounded-md border px-2 py-0.5 font-mono text-[0.58rem] font-bold uppercase tracking-wider ${colors.badge}`}>
                  {p.stage}
                </span>
              </div>
              <h4 className="mt-3 font-sans text-base font-bold text-[#111827] group-hover:text-[#7A0018]">
                {p.title}
              </h4>
              <p className="mt-1 font-mono text-[0.68rem] text-[#6B7280] truncate">
                {p.input} → {p.output}
              </p>
              {active && (
                <motion.div
                  layoutId="active-stage-indicator"
                  className="mt-3 h-1 w-full rounded-full bg-[#7A0018]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ACTIVE STAGE DETAIL VIEW */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <StageDetailCard stage={current} colors={COLOR_MAP[current.color]} index={activeStage} />
        </motion.div>
      </AnimatePresence>

      {/* FINAL SCORE AGGREGATOR PANEL */}
      <ScoreAggregatorCard />
    </section>
  );
}

function StageDetailCard({ stage, colors, index }) {
  const c = colors;
  return (
    <GlassPanel className="overflow-hidden p-0 border-[#E6C878]/60">
      <div className="flex items-center justify-between border-b border-[#E6C878]/60 bg-[#FFFCF7] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bg} font-mono text-sm font-bold ${c.text}`}>
            0{index + 1}
          </div>
          <div>
            <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#6B7280]">Active Inspection</span>
            <h4 className="font-sans text-lg font-bold text-[#111827]">{stage.title}</h4>
          </div>
        </div>
        <span className={`rounded-md border px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider ${c.badge}`}>
          {stage.stage}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_1.2fr]">
        {/* Left */}
        <div className="border-b border-[#E6C878]/60 p-6 lg:border-b-0 lg:border-r">
          <p className="text-sm text-[#4B5563] leading-relaxed">{stage.desc}</p>
          <h5 className="mt-5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#7A0018]">Core Processing Modules</h5>
          <div className="mt-3 space-y-2">
            {stage.modules.map((m) => (
              <div key={m.name} className={`flex items-center gap-3 rounded-xl border ${c.border} bg-[#FFFFFF] p-3`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
                  <m.icon size={16} className={c.text} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{m.name}</p>
                  <p className="font-mono text-[0.66rem] text-[#6B7280]">Module · {stage.stage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="p-6">
          <h5 className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#7A0018]">Key Input / Output</h5>
          <div className="mt-3 space-y-2">
            {stage.detail.map((d) => (
              <div key={d.label} className="flex items-center justify-between gap-3 rounded-xl border border-[#E6C878]/60 bg-[#FFFCF7] px-4 py-2.5">
                <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[#6B7280]">{d.label}</span>
                <span className="text-right text-sm font-semibold text-[#111827]">{d.value}</span>
              </div>
            ))}
          </div>
          <div className={`mt-4 flex items-center gap-2 rounded-xl border ${c.border} bg-[#FFFFFF] p-3`}>
            <Zap size={14} className={c.text} />
            <span className="text-xs text-[#4B5563]">
              Output <strong className={c.text}>{stage.output}</strong> is forwarded to the next stage.
            </span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

function ScoreAggregatorCard() {
  const metrics = [
    { label: 'Feasibility Score', value: 82, weight: '30%', icon: ShieldCheck },
    { label: 'Market Potential',  value: 88, weight: '30%', icon: TrendingUp },
    { label: 'Pricing Power',     value: 74, weight: '20%', icon: DollarSign },
    { label: 'GTM Viability',     value: 90, weight: '20%', icon: Target },
  ];

  return (
    <GlassPanel className="p-6 md:p-8 border-[#D4AF37]/50 bg-gradient-to-br from-[#FFFFFF] via-[#FFFCF7] to-[#FBF3D5]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-[#7A0018]" />
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#7A0018]">
              Score Aggregator
            </span>
          </div>
          <h3 className="mt-1 font-sans text-2xl font-bold text-[#111827]">Conscious Orbital Score Synthesis</h3>
          <p className="mt-1 max-w-lg text-sm text-[#4B5563]">
            Weighted formula synthesizing feasibility, TAM metrics, unit economics, and GTM readiness.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#D4AF37] bg-[#FFFFFF] p-4 shadow-sm">
          <div className="text-center font-mono">
            <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[#6B7280]">Final Score</p>
            <p className="font-sans text-4xl font-extrabold text-[#7A0018]">86<span className="text-xs text-[#6B7280]">/100</span></p>
          </div>
          <div className="h-10 w-px bg-[#E6C878]/60" />
          <div className="text-center font-mono">
            <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[#6B7280]">Decision</p>
            <span className="rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 text-xs font-bold text-[#059669]">
              1 · PROCEED
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-[#E6C878]/60 bg-[#FFFFFF] p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <m.icon size={14} className="text-[#7A0018]" />
                <span className="font-mono text-[0.65rem] uppercase text-[#6B7280]">{m.label}</span>
              </div>
              <span className="font-mono text-[0.6rem] text-[#6B7280]">{m.weight}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-sans text-xl font-bold text-[#111827]">{m.value}</span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#E5E7EB]">
                <div className="h-full rounded-full bg-[#7A0018]" style={{ width: `${m.value}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
