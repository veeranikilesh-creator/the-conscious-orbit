import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, School, Factory, Building2, Rocket, Crown,
  ArrowRight, Sparkles, ShieldCheck,
  Play, BarChart2, Cpu, GitMerge, Gauge, Binary,
} from 'lucide-react';
import {
  RoyalButton, GhostButton, OrbitBrand, RoyalBackground,
} from './ui.jsx';
import { Carousel, Card } from './AppleCardsCarousel.jsx';

/* ============================================================
   ABSTRACT SVG GEOMETRY ARTWORK COMPONENTS FOR DOMAIN CARDS
   ============================================================ */

const PatternStudents = () => (
  <svg className="w-full h-full opacity-35 stroke-[#D4AF37]" viewBox="0 0 400 240" fill="none">
    <circle cx="200" cy="120" r="80" strokeWidth="1" strokeDasharray="4 4" />
    <path d="M120 120 L280 120 M200 40 L200 200" strokeWidth="1" opacity="0.6" />
    <polygon points="200,60 250,90 200,120 150,90" strokeWidth="1.5" fill="rgba(212,175,55,0.05)" />
    <circle cx="150" cy="90" r="4" fill="#F4D67A" />
    <circle cx="250" cy="90" r="4" fill="#F4D67A" />
    <circle cx="200" cy="60" r="4" fill="#F4D67A" />
  </svg>
);

const PatternInstitutions = () => (
  <svg className="w-full h-full opacity-35 stroke-[#D4AF37]" viewBox="0 0 400 240" fill="none">
    <rect x="80" y="50" width="240" height="140" rx="16" strokeWidth="1" strokeDasharray="6 6" />
    <path d="M110 90 L290 90 M110 130 L290 130 M110 170 L290 170" strokeWidth="1" opacity="0.5" />
    <path d="M150 50 L150 190 M250 50 L250 190" strokeWidth="1.5" />
    <circle cx="200" cy="110" r="28" strokeWidth="1.5" fill="rgba(212,175,55,0.08)" />
  </svg>
);

const PatternMSMEs = () => (
  <svg className="w-full h-full opacity-35 stroke-[#D4AF37]" viewBox="0 0 400 240" fill="none">
    <path d="M60 180 L140 120 L220 150 L340 70" strokeWidth="2" strokeLinecap="round" />
    <circle cx="140" cy="120" r="5" fill="#D4AF37" />
    <circle cx="220" cy="150" r="5" fill="#D4AF37" />
    <circle cx="340" cy="70" r="6" fill="#F4D67A" />
    <rect x="100" y="80" width="80" height="80" rx="12" strokeWidth="1" strokeDasharray="4 4" />
    <rect x="220" y="60" width="100" height="100" rx="16" strokeWidth="1" opacity="0.6" />
  </svg>
);

const PatternIndustries = () => (
  <svg className="w-full h-full opacity-35 stroke-[#D4AF37]" viewBox="0 0 400 240" fill="none">
    <polygon points="200,30 320,100 320,180 200,210 80,180 80,100" strokeWidth="1.5" />
    <polygon points="200,70 270,115 270,165 200,185 130,165 130,115" strokeWidth="1" strokeDasharray="3 3" />
    <path d="M200 30 L200 210 M80 100 L320 180 M80 180 L320 100" strokeWidth="1" opacity="0.4" />
  </svg>
);

const PatternStartups = () => (
  <svg className="w-full h-full opacity-35 stroke-[#D4AF37]" viewBox="0 0 400 240" fill="none">
    <ellipse cx="200" cy="120" rx="140" ry="60" strokeWidth="1.5" transform="rotate(-15 200 120)" />
    <ellipse cx="200" cy="120" rx="140" ry="60" strokeWidth="1" strokeDasharray="6 6" transform="rotate(30 200 120)" />
    <circle cx="200" cy="120" r="24" fill="rgba(212,175,55,0.12)" strokeWidth="2" />
    <circle cx="310" cy="90" r="5" fill="#F4D67A" />
  </svg>
);

const DOMAIN_CARDS_DATA = [
  {
    title: 'Students & Scholars',
    icon: GraduationCap,
    description: 'Academic counseling, research mentorship, thesis guidance, and career trajectory mapping.',
    capabilities: [
      'Personalized Academic Counseling',
      'Research & Publication Mentorship',
      'Thesis & Capstone Strategy',
      'Global Scholarship Pathing'
    ],
    patternComponent: PatternStudents
  },
  {
    title: 'Educational Institutions',
    icon: School,
    description: 'Curriculum optimization, organizational diagnosis, accreditation alignment, and digital transformation.',
    capabilities: [
      'Curriculum Benchmarking & Diagnosis',
      'Accreditation Compliance Pipelines',
      'Faculty Workflow Optimization',
      'Institutional Governance Analytics'
    ],
    patternComponent: PatternInstitutions
  },
  {
    title: 'MSMEs',
    icon: Factory,
    description: 'Operational bottleneck diagnostics, capacity building, unit economic sizing, and market expansion.',
    capabilities: [
      'Operational Bottleneck Audit',
      'Gross Margin & Cash Payback Sizing',
      'Supply-Chain Logistics Efficiency',
      'Local-to-Regional Scalability Engine'
    ],
    patternComponent: PatternMSMEs
  },
  {
    title: 'Industries',
    icon: Building2,
    description: 'Large-scale systemic optimization, innovation pipelines, strategic partnerships, and enterprise risk.',
    capabilities: [
      'Enterprise Systemic Optimization',
      'Cross-Sector Innovation Architecture',
      'Regulatory Risk Mitigation Matrix',
      'Strategic M&A & Joint Venture Readiness'
    ],
    patternComponent: PatternIndustries
  },
  {
    title: 'Startups',
    icon: Rocket,
    description: 'Market validation, TAM/SAM sizing, pricing strategy, GTM readiness, and investor positioning.',
    capabilities: [
      'Market Signal & Customer Discovery',
      'TAM / SAM Volume Sizing',
      '0-100 Orbital Index Score',
      'Binary 1 / 0 Investor Deck Verdict'
    ],
    patternComponent: PatternStartups
  }
];

const PIPELINE_STEPS = [
  { n: '01', title: 'Customer Discovery', desc: 'Raw idea statements & volume signals' },
  { n: '02', title: 'Profiling & TAM/SAM', desc: 'Sector profiling & market volume sizing' },
  { n: '03', title: 'Unit Viability',     desc: 'Gross margin & payback calculations' },
  { n: '04', title: 'Orbital Decision',   desc: '0-100 Score & binary 1/0 GO verdict' },
];

const STATS = [
  { value: '5', label: 'Vertical Engines', icon: Cpu },
  { value: '4', label: 'Pipeline Stages', icon: GitMerge },
  { value: '0–100', label: 'Orbital Index', icon: Gauge },
  { value: '1 / 0', label: 'Binary Verdict', icon: Binary },
];

export default function Homepage({ onEnter, onLogin }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#D4AF37] selection:text-[#050505]">
      {/* Background canvas */}
      <RoyalBackground />

      {/* ===== TOP NAVBAR (BRANDING LEFT, USER PROFILE RIGHT) ===== */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-12 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OrbitBrand size={32} />
          <span className="text-[#D4AF37]/60 font-thin text-base">–</span>
          <span className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-[#FFFFFF]">
            the conscious orbit
          </span>
        </div>

        {/* User Profile Avatar Trigger */}
        <button
          onClick={onLogin}
          className="group flex items-center gap-2.5 rounded-full border border-[rgba(212,175,55,0.3)] bg-[#0E0E0E]/80 px-3.5 py-1.5 backdrop-blur-md hover:border-[#D4AF37] transition cursor-pointer"
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
      <header className="relative z-10 mx-auto min-h-[80vh] lg:min-h-[85vh] max-w-7xl px-6 lg:px-12 flex items-center pt-2 pb-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-8">
          
          {/* LEFT SIDE (45% / 5 Cols on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-5 text-left flex flex-col items-start space-y-5 z-20 -mt-6 lg:-mt-10">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.12] text-left"
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
          <div className="lg:col-span-6 xl:col-span-7 relative flex items-center justify-end z-10 overflow-visible pointer-events-none opacity-30 lg:opacity-100 h-full">
            <div className="relative w-full lg:w-[130%] xl:w-[145%] lg:-mr-32 xl:-mr-48 flex items-center justify-end h-full">
              <svg
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto min-h-[90vh] object-cover"
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
      <TelemetryStats stats={STATS} />

      {/* ===== TARGET VERTICALS — APPLE-STYLE EXPANDING CAROUSEL ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-0 py-20 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 px-6 lg:px-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={15} className="text-[#D4AF37]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F4D67A] font-bold">Target Verticals</span>
            </div>
            <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#FFFFFF]">Five Core Domains of Strategy</h2>
          </div>
          <button
            onClick={onEnter}
            className="mt-4 md:mt-0 font-mono text-xs font-bold text-[#F4D67A] hover:text-[#FFFFFF] transition flex items-center gap-1.5 cursor-pointer"
          >
            Explore Suite <ArrowRight size={14} />
          </button>
        </div>

        {/* Apple Cards Carousel Container */}
        <Carousel
          items={DOMAIN_CARDS_DATA.map((card, index) => (
            <Card key={card.title} card={card} index={index} layout={true} onEnter={onEnter} />
          ))}
        />
      </section>

      {/* ===== FOUR-STAGE PIPELINE — HORIZONTAL TIMELINE ===== */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F4D67A] font-bold block mb-2">Processing Flow</span>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#FFFFFF]">Stage-Gated Strategy Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
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

      {/* ===== GRAND FINALE: THE SOVEREIGN DECISION VERDICT SECTION ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-16 overflow-hidden">
        {/* Background Ambient Layer: Faint Orbital Grid, Floating Gold Particles & Radial Lighting */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.07] blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-25 -z-10">
          <div className="absolute top-1/3 left-1/6 w-1 h-1 rounded-full bg-[#F4D67A] animate-ping" />
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <div className="absolute top-1/2 left-3/4 w-1 h-1 rounded-full bg-[#F4D67A]" />
        </div>

        {/* Staggered Viewport Animated Section Container */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* LEFT COLUMN: Executive Statement & Interactive Action */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#D4AF37]/30 bg-[#070707] px-4 py-1.5 backdrop-blur-md"
            >
              <ShieldCheck size={14} className="text-[#D4AF37]" />
              <span className="font-mono text-xs text-[#F4D67A] font-bold uppercase tracking-[0.18em]">
                Orbital Metric Engine
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FFFFFF] leading-[1.18] tracking-tight"
            >
              The Sovereign 1 / 0 Decision Verdict
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base text-[#CFCFCF] leading-relaxed max-w-xl font-sans"
            >
              Every venture strategy is distilled down to unit feasibility, pricing power, and execution risk — resolving into a single authoritative binary GO / PIVOT verdict.
            </motion.p>

            {/* Interactive Luxury CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-3"
            >
              <motion.button
                onClick={onEnter}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#F4D67A] via-[#D4AF37] to-[#C89B3C] px-9 py-4 font-sans text-sm font-bold text-[#050505] shadow-[0_8px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_14px_40px_rgba(212,175,55,0.45)] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Ripple Shimmer Effect */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out" />
                <Play size={16} className="fill-[#050505] transition-transform duration-300 group-hover:scale-110" />
                <span>Launch Strategy Engine</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </motion.button>
            </motion.div>

            {/* Refined Executive Closing Statement */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-4 border-t border-[#D4AF37]/15 w-full"
            >
              <p className="font-serif italic text-sm text-[#F4D67A]/80 tracking-wide">
                "One score. One verdict. One sovereign executive decision."
              </p>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Premium Orbital Satellite Gauge & Status Breakdown */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <ExecutiveOrbitalGauge value={88} />
          </div>
        </motion.div>

        {/* Seamless Animated Gold Line Divider to Footer */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent origin-center"
        />
      </section>

      {/* ===== SEAMLESS MINIMALIST FOOTER ===== */}
      <footer className="relative z-10 bg-[#050505] px-6 py-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <OrbitBrand size={26} />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#FFFFFF]">
              The Conscious Orbit
            </span>
          </div>
          <p className="font-mono text-[0.7rem] uppercase tracking-widest text-[#9A9A9A]">
            © 2026 The Conscious Orbit · Executive Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

function CountUpValue({ value, isVisible }) {
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    if (!isVisible) return;
    
    // Check if value has numbers to animate
    const numericMatches = value.match(/\d+/g);
    if (!numericMatches) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(numericMatches[0], 10);
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentNum = Math.floor(easedProgress * targetNum);

      setDisplayValue(value.replace(/\d+/, currentNum.toString()));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value]);

  return <span>{displayValue}</span>;
}

function TelemetryStats({ stats }) {
  // Duplicate stats list to create seamless infinite loop
  const tickerItems = [...stats, ...stats, ...stats];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mx-auto max-w-7xl px-4 my-6"
    >
      {/* Animated Top Gold Separator Line that expands from center */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent origin-center"
      />

      {/* Main Live Status Ribbon Strip */}
      <div className="relative overflow-hidden py-8 bg-[#070707]/90 rounded-xl my-1 border border-white/[0.03]">
        {/* Background 1: Faint animated flowing gold gradient */}
        <div className="pointer-events-none absolute inset-0 animate-bg-flow bg-gradient-to-r from-[#D4AF37]/[0.02] via-[#F4D67A]/[0.05] to-[#D4AF37]/[0.02] opacity-80" />

        {/* Background 2: Tiny subtle floating gold particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-1/4 left-1/5 w-1 h-1 rounded-full bg-[#F4D67A] animate-pulse" />
          <div className="absolute top-2/3 left-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
          <div className="absolute top-1/3 left-3/4 w-1 h-1 rounded-full bg-[#F4D67A] animate-pulse" />
          <div className="absolute top-3/4 left-4/5 w-1 h-1 rounded-full bg-[#D4AF37]" />
        </div>

        {/* Background 3: Scanning light sweep every 6-8 seconds */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer-sweep bg-gradient-to-r from-transparent via-[#F4D67A]/15 to-transparent w-1/3 z-10" />

        {/* Left & Right Edge Vignette Fades for seamless ticker entry */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-20" />

        {/* Continuously Moving Horizontal Ticker Container */}
        <div className="animate-ticker items-center">
          {tickerItems.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={`${s.label}-${idx}`}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="group relative flex flex-col items-center justify-center space-y-2 cursor-pointer px-12 md:px-16 py-3 min-w-[240px] text-center"
              >
                {/* Subtle Hover Ambient Glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/[0.08] group-hover:blur-md transition-all duration-300" />

                {/* Icon & Label Header */}
                <div className="flex items-center gap-2 text-[#F4D67A] group-hover:text-[#FFFFFF] transition-colors duration-300">
                  {Icon && (
                    <motion.div
                      whileHover={{ rotate: 12 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <Icon size={15} className="text-[#D4AF37] group-hover:text-[#FFFFFF] transition-colors" />
                    </motion.div>
                  )}
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] font-bold">
                    {s.label}
                  </span>
                </div>

                {/* Metric Value */}
                <div className="font-sans text-3xl md:text-4xl font-extrabold text-[#FFFFFF] group-hover:text-[#FFF8DC] tracking-tight block transition-colors duration-300 group-hover:drop-shadow-[0_0_16px_rgba(244,214,122,0.5)]">
                  <CountUpValue value={s.value} isVisible={true} />
                </div>

                {/* Animated Gold Underline */}
                <div className="h-[2px] w-12 bg-gradient-to-r from-[#D4AF37] to-[#F4D67A] rounded-full group-hover:w-20 group-hover:from-[#FFFFFF] group-hover:to-[#F4D67A] transition-all duration-300 opacity-70 group-hover:opacity-100 group-hover:shadow-[0_0_8px_#F4D67A]" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Gold Separator Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent origin-center"
      />
    </motion.div>
  );
}

function ExecutiveOrbitalGauge({ value = 88 }) {
  const R = 76;
  const C = 2 * Math.PI * R;
  const strokeDashoffset = C - (value / 100) * C;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md">
      {/* Premium Multi-Orbit Satellite Gauge Container */}
      <div className="relative flex items-center justify-center h-64 w-64">
        {/* Outer Orbit Ring 1 - Counter Clockwise Slow Rotation */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/25 animate-spin-reverse-slow" />

        {/* Outer Orbit Ring 2 - Clockwise Slow Rotation with Satellite Dot */}
        <div className="absolute inset-2 rounded-full border border-[#D4AF37]/30 animate-spin-slow">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-[#F4D67A] shadow-[0_0_12px_#F4D67A]" />
        </div>

        {/* Inner SVG Progress Arc */}
        <svg width="210" height="210" className="-rotate-90">
          <circle cx="105" cy="105" r={R} fill="none" stroke="#111111" strokeWidth="6" />
          <motion.circle
            cx="105"
            cy="105"
            r={R}
            fill="none"
            stroke="url(#goldRingGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="goldRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="50%" stopColor="#F4D67A" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>

        {/* Centered Large Orbital Score */}
        <div className="absolute flex flex-col items-center justify-center text-center space-y-0.5">
          <span className="font-sans text-5xl font-extrabold text-[#FFFFFF] tracking-tight drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <CountUpValue value={value.toString()} isVisible={true} />
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#F4D67A] font-bold">
            Orbital Index
          </span>
        </div>
      </div>

      {/* Executive Status Details Breakdown Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full rounded-2xl border border-[#D4AF37]/20 bg-[#070707] p-5 shadow-xl space-y-3"
      >
        <div className="flex items-center justify-between text-xs font-mono border-b border-[#D4AF37]/15 pb-2.5">
          <span className="text-[#9A9A9A] uppercase tracking-wider">Orbital Index</span>
          <span className="font-bold text-[#FFFFFF]">88 / 100</span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono border-b border-[#D4AF37]/15 pb-2.5">
          <span className="text-[#9A9A9A] uppercase tracking-wider">Decision</span>
          <span className="font-extrabold text-[#050505] bg-[#D4AF37] px-2.5 py-0.5 rounded-full text-[0.7rem] tracking-widest shadow-sm">
            GO (1)
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono border-b border-[#D4AF37]/15 pb-2.5">
          <span className="text-[#9A9A9A] uppercase tracking-wider">Confidence</span>
          <span className="font-bold text-[#F4D67A]">High</span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#9A9A9A] uppercase tracking-wider">Execution Ready</span>
          <span className="font-bold text-[#FFFFFF]">YES</span>
        </div>
      </motion.div>
    </div>
  );
}
