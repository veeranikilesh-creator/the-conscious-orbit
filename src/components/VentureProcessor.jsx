import React, { useState, useRef, useEffect } from 'react';
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
    badge: 'bg-[#D4AF37] text-[#050505] border-[#F4D67A] font-bold',
    border: 'border-[#D4AF37]/50',
    bg: 'bg-[#111111]',
    text: 'text-[#F4D67A]',
    fill: 'bg-[#D4AF37]',
  },
  gold: {
    badge: 'bg-[#78350F]/80 text-[#E6C878] border-[#E6C878]',
    border: 'border-[#E6C878]/50',
    bg: 'bg-[#78350F]',
    text: 'text-[#E6C878]',
    fill: 'bg-[#D4AF37]',
  },
  purple: {
    badge: 'bg-[#4C1D95]/80 text-[#DDD6FE] border-[#C084FC]',
    border: 'border-[#C084FC]/50',
    bg: 'bg-[#4C1D95]',
    text: 'text-[#DDD6FE]',
    fill: 'bg-[#7C3AED]',
  },
  emerald: {
    badge: 'bg-[#065F46]/80 text-[#A7F3D0] border-[#34D399]',
    border: 'border-[#34D399]/50',
    bg: 'bg-[#065F46]',
    text: 'text-[#A7F3D0]',
    fill: 'bg-[#059669]',
  },
};

export default function VentureProcessor() {
  const [activeStage, setActiveStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const current = PIPELINE[activeStage];

  // Held in a ref so the interval can be cleared if the component unmounts
  // mid-run (e.g. the user switches away from the Pipeline tab).
  const intervalRef = useRef(null);
  useEffect(() => () => clearInterval(intervalRef.current), []);

  const handleSimulate = () => {
    clearInterval(intervalRef.current);
    setIsProcessing(true);
    setActiveStage(0);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      if (step < PIPELINE.length) {
        setActiveStage(step);
      } else {
        clearInterval(intervalRef.current);
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
            <Cpu size={16} className="text-[#D4AF37]" />
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#F4D67A]">
              Processing Architecture
            </span>
          </div>
          <h2 className="mt-1 font-sans text-2xl font-bold leading-tight text-[#F2F2F2] md:text-3xl">
            Venture Intelligence Pipeline
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[#CFCFCF]">
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

      {/* PIPELINE CONNECTED HORIZONTAL JOURNEY NODES */}
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PIPELINE.map((p, i) => {
          const colors = COLOR_MAP[p.color];
          const active = activeStage === i;
          return (
            <div key={p.stage} className="relative">
              <button
                onClick={() => setActiveStage(i)}
                className={`group relative flex flex-col w-full rounded-[22px] border p-5 text-left transition-all duration-200 cursor-pointer ${
                  active
                    ? 'border-[#D4AF37] bg-[#121212] shadow-md ring-1 ring-[#D4AF37]'
                    : 'border-[rgba(212,175,55,0.12)] bg-[#121212] hover:border-[#D4AF37] hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    0{i + 1}
                  </span>
                  <span className={`rounded-md border px-2 py-0.5 font-mono text-[0.58rem] font-bold uppercase tracking-wider ${colors.badge}`}>
                    {p.stage}
                  </span>
                </div>
                <h4 className="mt-3 font-sans text-base font-bold text-[#F8F8F8] group-hover:text-[#D4AF37] transition">
                  {p.title}
                </h4>
                <p className="mt-1 font-mono text-[0.65rem] text-[#CFCFCF] truncate">
                  {p.input} → {p.output}
                </p>
                {active && (
                  <motion.div
                    layoutId="active-stage-indicator"
                    className="mt-3 h-1 w-full rounded-full bg-[#D4AF37]"
                  />
                )}
              </button>

              {/* Connecting Gold Progress Line */}
              {i < PIPELINE.length - 1 && (
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 hidden lg:block pointer-events-none">
                  <div className="h-0.5 w-4 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/20" />
                </div>
              )}
            </div>
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
    <GlassPanel className="overflow-hidden p-0 border-[rgba(212,175,55,0.25)] bg-[#111111]">
      <div className="flex items-center justify-between border-b border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bg} font-mono text-sm font-bold ${c.text}`}>
            0{index + 1}
          </div>
          <div>
            <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#F4D67A]">Active Inspection</span>
            <h4 className="font-sans text-lg font-bold text-[#FFFFFF]">{stage.title}</h4>
          </div>
        </div>
        <span className={`rounded-md border px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider ${c.badge}`}>
          {stage.stage}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_1.2fr]">
        {/* Left */}
        <div className="border-b border-[rgba(212,175,55,0.18)] p-6 lg:border-b-0 lg:border-r">
          <p className="text-sm text-[#CFCFCF] leading-relaxed">{stage.desc}</p>
          <h5 className="mt-5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#F4D67A]">Core Processing Modules</h5>
          <div className="mt-3 space-y-2">
            {stage.modules.map((m) => (
              <div key={m.name} className={`flex items-center gap-3 rounded-xl border border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] p-3`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
                  <m.icon size={16} className={c.text} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#FFFFFF]">{m.name}</p>
                  <p className="font-mono text-[0.66rem] text-[#9A9A9A]">Module · {stage.stage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="p-6">
          <h5 className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#F4D67A]">Key Input / Output</h5>
          <div className="mt-3 space-y-2">
            {stage.detail.map((d) => (
              <div key={d.label} className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(212,175,55,0.18)] bg-[#050505] px-4 py-2.5">
                <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[#CFCFCF]">{d.label}</span>
                <span className="text-right text-sm font-semibold text-[#FFFFFF]">{d.value}</span>
              </div>
            ))}
          </div>
          <div className={`mt-4 flex items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] p-3`}>
            <Zap size={14} className="text-[#D4AF37]" />
            <span className="text-xs text-[#CFCFCF]">
              Output <strong className="text-[#F4D67A]">{stage.output}</strong> is forwarded to the next stage.
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
    <GlassPanel className="p-6 border-[rgba(212,175,55,0.15)] bg-[#151515] text-white rounded-[22px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-[#D4AF37]" />
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Score Aggregator
            </span>
          </div>
          <h3 className="font-sans text-2xl font-bold text-[#F8F8F8]">Conscious Orbital Score Synthesis</h3>
          <p className="max-w-lg text-xs text-[#CFCFCF]">
            Weighted formula synthesizing feasibility, TAM metrics, unit economics, and GTM readiness.
          </p>
        </div>

        {/* RIGHT: Large Final Score Card */}
        <div className="flex items-center gap-4 rounded-xl border border-[rgba(212,175,55,0.15)] bg-[#1B1B1B] p-4 shadow-sm">
          <div className="text-center font-mono">
            <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[#9A9A9A]">Final Score</p>
            <p className="font-sans text-3xl font-extrabold text-[#F8F8F8]">86<span className="text-xs text-[#9A9A9A]">/100</span></p>
          </div>
          <div className="h-10 w-px bg-[rgba(212,175,55,0.2)]" />
          <div className="text-center font-mono space-y-1">
            <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[#9A9A9A]">Decision</p>
            <span className="rounded-md border border-[#10B981] bg-[#065F46]/80 px-2 py-0.5 text-xs font-bold text-[#10B981]">
              1 · PROCEED
            </span>
          </div>
        </div>
      </div>

      {/* LEFT: 4 Compact Score Cards */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-[rgba(212,175,55,0.15)] bg-[#1B1B1B] p-3.5 transition hover:border-[#D4AF37]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <m.icon size={14} className="text-[#D4AF37]" />
                <span className="font-mono text-[0.65rem] uppercase text-[#CFCFCF]">{m.label}</span>
              </div>
              <span className="font-mono text-[0.6rem] text-[#D4AF37]">{m.weight}</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="font-sans text-lg font-bold text-[#F8F8F8]">{m.value}</span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#050505]">
                <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${m.value}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

