import React from 'react';
import { motion } from 'framer-motion';
import {
  Crown, ArrowRight, ShieldCheck, Play,
} from 'lucide-react';
import {
  RoyalButton, GhostButton, OrbitBrand, RoyalBackground,
} from './ui.jsx';
import { VERTICALS } from '../constants.js';

/* ============================================================
   BLACK & GOLD EXECUTIVE MINIMALIST HOME EXPERIENCE
   ============================================================ */

const PIPELINE_STEPS = [
  { n: '01', title: 'Customer Discovery', desc: 'Raw idea statements & volume signals' },
  { n: '02', title: 'Profiling & TAM/SAM', desc: 'Sector profiling & market volume sizing' },
  { n: '03', title: 'Unit Viability',     desc: 'Gross margin & payback calculations' },
  { n: '04', title: 'Orbital Decision',   desc: '0-100 Score & binary 1/0 GO verdict' },
];

const STATS = [
  { value: '5', label: 'Vertical Engines' },
  { value: '4', label: 'Pipeline Stages' },
  { value: '0–100', label: 'Orbital Index' },
  { value: '1 / 0', label: 'Binary Verdict' },
];

export default function Homepage({ onEnter, onLogin }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#D4AF37] selection:text-[#050505]">
      {/* Background canvas */}
      <RoyalBackground />

      {/* ===== TOP NAVBAR (BRANDING LEFT, USER PROFILE RIGHT) ===== */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pt-8 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <OrbitBrand size={32} className="shrink-0" />
          <span className="hidden sm:inline text-[#D4AF37]/60 font-thin text-base">–</span>
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#FFFFFF]">
            the conscious orbit
          </span>
        </div>

        {/* User Profile Avatar Trigger */}
        <button
          onClick={onLogin}
          className="group flex shrink-0 items-center gap-2.5 rounded-full border border-[rgba(212,175,55,0.3)] bg-[#0E0E0E]/80 px-3.5 py-1.5 backdrop-blur-md hover:border-[#D4AF37] transition cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F4D67A] text-[#050505] font-mono text-xs font-bold shadow-xs">
            EX
          </div>
          <span className="hidden sm:inline font-mono text-xs font-semibold text-[#CFCFCF] group-hover:text-[#FFFFFF]">
            Executive Profile
          </span>
        </button>
      </div>

      {/* ===== HERO SECTION — SPLIT SCREEN LAYOUT ===== */}
      <header className="relative z-10 mx-auto min-h-[80vh] lg:min-h-[85vh] max-w-7xl px-4 sm:px-6 lg:px-12 flex items-center pt-8 pb-10 lg:pt-2">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 sm:gap-12 lg:gap-8">

          {/* LEFT SIDE (45% / 5 Cols on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-5 text-left flex flex-col items-start space-y-5 z-20 lg:-mt-10">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[2.1rem] sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.12] text-left"
            >
              <span className="font-serif italic font-normal tracking-tight text-[#FFFFFF] block">Systemic Sovereignty.</span>
              <span className="font-serif italic font-normal bg-gradient-to-r from-[#FFFFFF] via-[#F4D67A] to-[#D4AF37] bg-clip-text text-transparent block mt-2">
                Strategy Platform.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl font-sans text-base sm:text-lg text-[#CFCFCF] leading-relaxed text-left"
            >
              Synthesize raw business ideas into authoritative, sovereign decisions — mapping TAM/SAM opportunity, unit economics, and risk into a single <span className="font-mono font-bold text-[#D4AF37]">Conscious Orbital Score</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center gap-4"
            >
              <RoyalButton onClick={onEnter} className="px-9 py-4 text-sm font-bold shadow-xl">
                <Play size={16} /> Launch Strategy Engine
              </RoyalButton>
              <GhostButton onClick={onLogin} className="px-8 py-4 text-sm font-semibold">
                Sign In <ArrowRight size={15} />
              </GhostButton>
            </motion.div>
          </div>

          {/* RIGHT SIDE — EXACT HIGH-CONTRAST GOLD CHEVRON ARTWORK (REDUCED THICKNESS, NO FADING) */}
          <div className="lg:col-span-6 xl:col-span-7 relative hidden sm:flex items-center justify-end z-10 overflow-hidden lg:overflow-visible pointer-events-none opacity-30 lg:opacity-100 h-full">
            <div className="relative w-full lg:w-[130%] xl:w-[145%] lg:-mr-32 xl:-mr-48 flex items-center justify-end h-full">
              <svg
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto min-h-[34vh] sm:min-h-[45vh] lg:min-h-[90vh] object-cover"
                preserveAspectRatio="xMaxYMid slice"
              >
                <defs>
                  {/* Solid Vibrant Gold Metallic Gradient — 100% Opacity (No Fading) */}
                  <linearGradient id="goldMetallicSolid" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5D77F" />
                    <stop offset="35%" stopColor="#D4AF37" />
                    <stop offset="75%" stopColor="#C89B3C" />
                    <stop offset="100%" stopColor="#8A6A18" />
                  </linearGradient>

                  <linearGradient id="goldLineSolid" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5D77F" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>

                {/* 1. Thin Left Tip Gold Line Chevron */}
                <path
                  d="M 80 400 L 530 20 M 80 400 L 530 780"
                  stroke="url(#goldLineSolid)"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                />

                {/* 2. Thinner Width Solid Gold Metallic Chevron Band (100% Opaque) */}
                <path
                  d="M 230 400 L 650 0 L 840 0 L 420 400 L 840 800 L 650 800 Z"
                  fill="url(#goldMetallicSolid)"
                />

                {/* 3. Outer Right Accent Gold Line Chevron */}
                <path
                  d="M 480 400 L 900 0 M 480 400 L 900 800"
                  stroke="url(#goldLineSolid)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

        </div>
      </header>

      {/* ===== SLEEK MINIMALIST DIVIDER WITH TELEMETRY METRICS ===== */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.4)] to-transparent" />
        <div className="py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="space-y-1">
              <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight block">{s.value}</span>
              <span className="font-mono text-[0.68rem] uppercase tracking-widest text-[#F4D67A] block">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.4)] to-transparent" />
      </div>

      {/* ===== TARGET VERTICALS — 3D LUXURY FLIP CARDS ===== */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={15} className="shrink-0 text-[#D4AF37]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F4D67A] font-bold">Target Verticals</span>
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFFFFF]">Five Core Domains of Strategy</h2>
          </div>
          <button
            onClick={onEnter}
            className="mt-4 md:mt-0 font-mono text-xs font-bold text-[#F4D67A] hover:text-[#FFFFFF] transition flex items-center gap-1.5 cursor-pointer"
          >
            Explore Suite <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {VERTICALS.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={onEnter}
                className="flip-card cursor-pointer"
              >
                <div className="flip-card-inner">
                  {/* FRONT */}
                  <div className="flip-card-front">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[#0E0E0E] text-[#D4AF37]">
                      <Icon size={26} />
                    </div>
                    <h3 className="flip-card-title">{v.short}</h3>
                    <p className="flip-card-subtitle font-mono text-xs text-[#9A9A9A] uppercase tracking-wider">
                      Domain 0{i + 1} · Hover to Inspect
                    </p>
                  </div>

                  {/* BACK */}
                  <div className="flip-card-back">
                    <h3 className="flip-card-title text-xl">{v.name}</h3>
                    <p className="flip-card-subtitle">{v.desc}</p>
                    <div className="mt-6 flex items-center gap-2 font-mono text-xs font-bold text-[#D4AF37] border border-[rgba(212,175,55,0.3)] bg-[#050505] px-4 py-2 rounded-xl">
                      <span>Launch Module</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== FOUR-STAGE PIPELINE — HORIZONTAL TIMELINE ===== */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F4D67A] font-bold block mb-2">Processing Flow</span>
          <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFFFFF]">Stage-Gated Strategy Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 relative">
          {PIPELINE_STEPS.map((step, idx) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative space-y-3 text-left border-l-2 md:border-l-0 md:border-t-2 border-[#D4AF37]/40 pl-5 md:pl-0 md:pt-5"
            >
              <span className="font-mono text-2xl font-extrabold text-[#D4AF37] block">{step.n}</span>
              <h4 className="font-sans text-base font-bold text-[#FFFFFF]">{step.title}</h4>
              <p className="text-xs text-[#9A9A9A] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== ORBITAL GAUGE SHOWCASE SECTION ===== */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 rounded-3xl border border-[rgba(212,175,55,0.2)] bg-[#0E0E0E] p-6 sm:p-8 md:p-12 shadow-2xl">
          <div className="space-y-4 max-w-xl text-left">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(212,175,55,0.3)] bg-[#050505] px-4 py-1.5">
              <ShieldCheck size={14} className="shrink-0 text-[#D4AF37]" />
              <span className="font-mono text-xs text-[#F4D67A] font-bold uppercase tracking-wider">Orbital Metric Engine</span>
            </div>
            <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#FFFFFF]">The Sovereign 1 / 0 Decision Verdict</h3>
            <p className="text-sm text-[#CFCFCF] leading-relaxed">
              Every venture strategy is distilled down to unit feasibility, pricing power, and execution risk — resolving into a clear binary GO / PIVOT verdict.
            </p>
            <div className="pt-2">
              <RoyalButton onClick={onEnter}>Test Your Idea</RoyalButton>
            </div>
          </div>

          <div className="flex flex-col items-center shrink-0">
            <ScoreRing value={88} />
          </div>
        </div>
      </section>

      {/* ===== MINIMAL FOOTER ===== */}
      <footer className="relative z-10 border-t border-[rgba(212,175,55,0.18)] bg-[#050505] px-4 sm:px-6 py-10">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <OrbitBrand size={30} className="shrink-0" />
            <span className="font-sans text-sm font-bold text-[#FFFFFF]">The Conscious Orbit</span>
          </div>
          <p className="font-mono text-xs text-[#9A9A9A]">
            © 2026 The Conscious Orbit · Executive Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

function ScoreRing({ value = 88 }) {
  const R = 68;
  const C = 2 * Math.PI * R;
  const strokeDashoffset = C - (value / 100) * C;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg width="170" height="170" className="-rotate-90">
          <circle cx="85" cy="85" r={R} fill="none" stroke="#111111" strokeWidth="8" />
          <motion.circle
            cx="85" cy="85" r={R} fill="none"
            stroke="#D4AF37"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute text-center">
          <span className="font-sans text-4xl font-extrabold text-[#FFFFFF] block">{value}</span>
          <span className="font-mono text-[0.62rem] uppercase tracking-widest text-[#9A9A9A] block mt-0.5">Orbital Index</span>
        </div>
      </div>
      <div className="mt-4 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-4 py-1.5 text-[#050505] font-extrabold font-mono text-xs shadow-md">
        VERDICT: GO (1)
      </div>
    </div>
  );
}
