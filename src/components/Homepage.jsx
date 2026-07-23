import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, Building2, Factory, Rocket, Crown,
  ChevronRight, ArrowRight, Sparkles, ShieldCheck,
  TrendingUp, DollarSign, Target, Award, Play, CheckCircle2,
  BarChart2, Layers, Activity,
} from 'lucide-react';
import {
  GlassPanel, RoyalHeading, RoyalButton, GhostButton, OrbitBrand, RoyalBackground,
} from './ui.jsx';

/* ============================================================
   ULTRA-LUXURY RED & GOLD LANDING EXPERIENCE
   ============================================================ */

const VERTICALS = [
  { icon: GraduationCap, name: 'Students & Scholars',      desc: 'Academic counseling, research mentorship & project management.' },
  { icon: Building2,     name: 'Educational Institutions', desc: 'Curriculum development, faculty training & org diagnosis.' },
  { icon: Factory,       name: 'MSMEs',                    desc: 'Small-team operations focused on operational bottlenecks.' },
  { icon: Building2,     name: 'Industries',               desc: 'Large-scale systemic optimization & multi-stakeholder strategy.' },
  { icon: Rocket,        name: 'Startups',                 desc: 'Idea-to-execution journeys & market validation.' },
];

const PIPELINE = [
  { n: '01', stage: 'RECEIVED',  title: 'Customer Discovery',   color: 'text-[#7A0018] bg-[#FFF1F2] border-[#FECDD3]', note: 'Idea Statement → Interaction Volume' },
  { n: '02', stage: 'PENDING',   title: 'Requirement & Profiling', color: 'text-[#78350F] bg-[#FBF3D5] border-[#E6C878]', note: 'B2B/B2C → Sector Profile' },
  { n: '03', stage: 'PROCESSED', title: 'Market Sizing',        color: 'text-[#7C3AED] bg-[#F5F3FF] border-[#DDD6FE]', note: 'TAM/SAM/SOM → Viability' },
  { n: '04', stage: 'PUBLISHED', title: 'Strategy Engine',      color: 'text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]', note: 'GTM & OKRs → Decision' },
];

const TRACKS = [
  { icon: Target,     name: 'Startup Validation', desc: 'Validate problem-solution fit before committing capital.' },
  { icon: TrendingUp, name: 'Market Opportunity', desc: 'Map TAM/SAM/SOM and competitive whitespace.' },
  { icon: DollarSign, name: 'Investor-Ready',     desc: 'Sharpen narrative, unit economics & the ask.' },
];

const STATS = [
  { value: '5',     label: 'Target Verticals', growth: '+100% Coverage', icon: Layers },
  { value: '4',     label: 'Processing Stages', growth: 'Sub-second AI',  icon: Activity },
  { value: '0–100', label: 'Orbital Score',     growth: '99.4% Precision', icon: BarChart2 },
  { value: '1 / 0', label: 'Decision Engine',   growth: 'Instant Verdict',  icon: CheckCircle2 },
];

export default function Homepage({ onEnter, onLogin }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-royal-mesh text-[#111827]">
      {/* WebGL & Layered Mesh Background */}
      <RoyalBackground />

      {/* ===== FLOATING GLASS NAVBAR WITH THIN GOLD BORDER ===== */}
      <nav className="relative z-20 mx-auto max-w-7xl px-5 py-6 md:px-8">
        <div className="flex items-center justify-between rounded-full border border-[#D4AF37]/40 bg-[#FFFFFF]/90 px-6 py-3.5 shadow-md backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <OrbitBrand size={38} />
            <div>
              <span className="font-sans text-lg font-bold text-[#111827]">The Conscious Orbit</span>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#7A0018]">Ultra-Luxury Royal Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GhostButton onClick={onLogin} className="hidden sm:inline-flex">
              Sign In
            </GhostButton>
            <RoyalButton onClick={onEnter}>
              Enter Suite <ChevronRight size={15} />
            </RoyalButton>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <header className="relative z-10 mx-auto max-w-4xl px-5 pt-8 pb-10 text-center md:px-8 md:pt-12 md:pb-14">
        <div className="flex w-full flex-col items-center justify-center text-center">
          {/* Tagline Badge — Follows H6 Font Size with Extra-Bold Gold Border & Champagne Text on Royal Red */}
          <motion.h6
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-[#D4AF37] bg-[#7A0018] px-5 py-2 font-mono text-xs sm:text-sm font-extrabold tracking-widest text-[#E6C878] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          >
            <Sparkles size={14} className="text-[#D4AF37] stroke-[2.5]" />
            ROYAL STRATEGY SYSTEM • CONSCIOUS ORBIT
          </motion.h6>

          {/* Main Display Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-3xl font-sans text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.18] text-[#111827] text-center"
          >
            <span className="text-shimmer-champagne font-extrabold">Systemic Sovereignty.</span>
            <br />
            <span className="text-[#111827] font-light">Luxury Strategy Engine.</span>
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-5 max-w-2xl font-sans text-base sm:text-lg font-normal text-[#4B5563] leading-relaxed text-center"
          >
            An ultra-luxury executive strategy platform designed to process raw business ideas into structured decisions — evaluating market opportunity, unit economics, and execution risk into a single <span className="font-mono font-bold text-[#7A0018]">Conscious Orbital Score</span>.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <RoyalButton onClick={onEnter} className="px-8 py-3.5 text-sm font-semibold shadow-md">
              <Play size={16} /> Launch Executive Suite
            </RoyalButton>
            <GhostButton onClick={onLogin} className="px-7 py-3.5 text-sm font-medium">
              Sign In <ArrowRight size={15} />
            </GhostButton>
          </motion.div>
        </div>
      </header>

      {/* ===== EXECUTIVE STATS MATRIX ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4"
        >
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card-royal-luxury p-5 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#7A0018] border border-[#E6C878]/50">
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-[0.62rem] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                    {s.growth}
                  </span>
                </div>
                <div className="mt-4 font-sans text-2xl font-extrabold text-[#111827] md:text-3xl">{s.value}</div>
                <div className="mt-1 font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-[#78350F]">{s.label}</div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* ===== VERTICALS ===== */}
      <Section id="verticals" kicker="Five Target Verticals" title="Built for every orbit of ambition">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
              >
                <GlassPanel className="group h-full p-6 transition duration-200 hover:border-[#D4AF37] hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E6C878]/60 bg-[#FFF1F2] text-[#7A0018]">
                    <Icon className="h-6 w-6 text-[#7A0018]" />
                  </div>
                  <h3 className="mt-4 font-sans text-xl font-bold text-[#111827]">{v.name}</h3>
                  <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{v.desc}</p>
                </GlassPanel>
              </motion.div>
            );
          })}
          {/* CTA tile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.45, delay: VERTICALS.length * 0.07 }}
            className="flex items-center"
          >
            <button
              onClick={onEnter}
              className="group flex h-full w-full flex-col items-start justify-center rounded-2xl border border-[#D4AF37] bg-[#FFFCF7]/80 p-6 text-left transition duration-200 hover:bg-[#FFFCF7] hover:border-[#D4AF37] cursor-pointer"
            >
              <Sparkles className="h-6 w-6 text-[#7A0018]" />
              <h3 className="mt-3 font-sans text-lg font-bold text-[#111827]">Explore the suite</h3>
              <span className="mt-1 inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#7A0018] transition group-hover:gap-2">
                Enter suite <ArrowRight size={14} />
              </span>
            </button>
          </motion.div>
        </div>
      </Section>

      {/* ===== PIPELINE ===== */}
      <Section id="pipeline" kicker="The Processing Architecture" title="Four stages from idea to decision">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((p, i) => (
            <motion.div
              key={p.stage}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative"
            >
              <GlassPanel className="h-full p-5">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-3xl font-bold text-[#D4AF37]/50">{p.n}</span>
                  <span className={`rounded-md border px-2 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider ${p.color}`}>{p.stage}</span>
                </div>
                <h4 className="mt-3 font-sans text-lg font-bold text-[#111827]">{p.title}</h4>
                <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">{p.note}</p>
              </GlassPanel>
              {/* Connector arrow */}
              {i < PIPELINE.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                  <ChevronRight size={20} className="text-[#D4AF37]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ===== SCORE SHOWCASE ===== */}
      <Section id="score" kicker="Final Evaluation Metric" title="The Conscious Orbital Score">
        <GlassPanel className="relative overflow-hidden p-8 md:p-12 border-[#D4AF37]/50">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#D4AF37]/15 blur-3xl" />
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[auto_1fr]">
            {/* Gauge */}
            <div className="mx-auto">
              <ScoreRing value={86} />
            </div>
            {/* Description */}
            <div>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-[#7A0018]" />
                <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#7A0018]">Score Aggregator</span>
              </div>
              <RoyalHeading level={3} className="mt-2">A sovereign decision in one number</RoyalHeading>
              <p className="mt-3 max-w-xl text-sm text-[#4B5563] leading-relaxed">
                Every venture is synthesized into a single 0–100 score across Feasibility, Market Potential,
                Pricing Power, and GTM Viability — then resolved into a binary decision:{' '}
                <span className="font-mono font-semibold text-[#059669]">1 · Proceed</span> or{' '}
                <span className="font-mono font-semibold text-[#7A0018]">0 · Pivot</span>.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Feasibility', value: 82, icon: ShieldCheck },
                  { label: 'Market Potential', value: 88, icon: TrendingUp },
                  { label: 'Pricing Power', value: 74, icon: DollarSign },
                  { label: 'GTM Viability', value: 90, icon: Target },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-[#E6C878]/60 bg-[#FFFCF7] p-3 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <s.icon size={13} className="text-[#7A0018]" />
                      <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-wider text-[#78350F]">{s.label}</span>
                    </div>
                    <div className="mt-1.5 font-sans text-xl font-bold text-[#111827]">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>
      </Section>

      {/* ===== FLAGSHIP TRACKS ===== */}
      <Section id="tracks" kicker="Report & Track Catalogue" title="Flagship tracks for the startup journey">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TRACKS.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <GlassPanel className="group h-full p-6 transition duration-200 hover:border-[#D4AF37] hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E6C878]/60 bg-[#FFF1F2] text-[#7A0018]">
                      <Icon className="h-5 w-5 text-[#7A0018]" />
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                  </div>
                  <h4 className="mt-4 font-sans text-xl font-bold text-[#111827]">{t.name} Track</h4>
                  <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{t.desc}</p>
                  <span className="mt-4 inline-block font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#7A0018]">Flagship · Royal Red &amp; Gold</span>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <GlassPanel className="relative overflow-hidden p-10 text-center md:p-16 border-[#D4AF37]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFF1F2] via-transparent to-[#FBF3D5]" />
            <div className="relative">
              <OrbitBrand size={64} className="mx-auto" />
              <RoyalHeading level={2} shimmer className="mt-6">
                Place your venture into orbit
              </RoyalHeading>
              <p className="mx-auto mt-4 max-w-xl text-sm text-[#4B5563] md:text-base">
                Enter the strategy suite and run your idea through the complete intelligence pipeline.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <RoyalButton onClick={onEnter} className="px-7 py-3 text-base shadow-md">
                  <Sparkles size={17} /> Enter Suite
                </RoyalButton>
                <GhostButton onClick={onLogin} className="px-7 py-3 text-base">
                  Sign In <ArrowRight size={16} />
                </GhostButton>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-[#E6C878]/60 bg-[#FFFCF7] px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <OrbitBrand size={26} />
            <span className="font-sans text-sm font-bold text-[#111827]">The Conscious Orbit</span>
          </div>
          <p className="font-mono text-[0.7rem] text-[#78350F]">
            The Conscious Orbit · Royal Red &amp; Metallic Gold Suite · © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Local Shared Helpers ---------- */

function Section({ id, kicker, title, children }) {
  return (
    <section id={id} className="relative z-10 mx-auto max-w-7xl px-5 py-14 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex items-center gap-2">
          <Crown size={16} className="text-[#7A0018]" />
          <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#7A0018]">{kicker}</span>
        </div>
        <h2 className="mt-2 font-sans text-3xl font-bold text-[#111827] md:text-4xl">{title}</h2>
      </motion.div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

// Score Ring in Gold & Emerald
function ScoreRing({ value = 86 }) {
  const R = 70;
  const C = 2 * Math.PI * R;
  const ringColor = value >= 75 ? '#059669' : value >= 50 ? '#D4AF37' : '#7A0018';
  return (
    <div className="relative h-44 w-44">
      <svg width="176" height="176" className="-rotate-90">
        <circle cx="88" cy="88" r={R} fill="none" stroke="#E6C878" strokeWidth="10" />
        <motion.circle
          cx="88" cy="88" r={R} fill="none"
          stroke={ringColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${ringColor}44)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-sans text-5xl font-extrabold text-[#7A0018]">{value}</span>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[#6B7280]">/ 100</span>
        <span className="mt-1 rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 font-mono text-[0.58rem] font-bold uppercase tracking-wider text-[#059669]">
          1 · Viable
        </span>
      </div>
    </div>
  );
}
