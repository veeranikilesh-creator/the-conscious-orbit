import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Building2, Factory, Rocket, Crown,
  ChevronRight, Sparkles, FileText, LayoutDashboard, Settings,
  Layers, ClipboardList, Search, DollarSign, Cpu, Home,
  TrendingUp, Download, CheckCircle2,
  Plus, X, ChevronDown, Target, Zap,
} from 'lucide-react';
import './App.css';
import {
  GlassPanel, RoyalHeading, Field, Input, Textarea, Select,
  RoyalButton, GhostButton, StatusBadge, StatusDot, OrbitBrand,
  AiPulseBadge, AiInsightWidget
} from './components/ui.jsx';
import VentureProcessor from './components/VentureProcessor.jsx';
import { StartupMarketEngine, MsmeOptimizationEngine, IndustryAnalysisEngine } from './components/VerticalEngines.jsx';
import Homepage from './components/Homepage.jsx';
import Login from './components/Login.jsx';
import Contact from './components/Contact.jsx';
import ExecutiveDashboard from './components/ExecutiveDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

/* ============================================================
   THE CONSCIOUS ORBIT — Ultra-Luxury Red & Gold Executive Workspace
   ============================================================ */

const VERTICALS = [
  { id: 'students',      name: 'Students & Scholars',        icon: GraduationCap, desc: 'Academic counseling, research mentorship & project management' },
  { id: 'institutions',  name: 'Educational Institutions',   icon: Building2,     desc: 'Curriculum development, faculty training & org diagnosis' },
  { id: 'msmes',         name: 'MSMEs',                       icon: Factory,      desc: 'Small-team operations focused on operational bottlenecks' },
  { id: 'industries',    name: 'Industries',                  icon: Building2,    desc: 'Large-scale systemic optimization & multi-stakeholder strategy' },
  { id: 'startups',      name: 'Startups',                    icon: Rocket,       desc: 'Idea-to-execution journeys & market validation' },
];

const CLUSTER_TABS = [
  { id: 'market',  name: 'Market & Customer Foundation', cluster: 'Cluster 1' },
  { id: 'viability', name: 'Business Viability',         cluster: 'Cluster 2' },
  { id: 'launch',  name: 'Launch & Execution',           cluster: 'Cluster 3' },
];

const FLAGSHIP_TRACKS = [
  { id: 'validation', name: 'Startup Validation Track', desc: 'Validate problem-solution fit before committing capital.', icon: Target },
  { id: 'opportunity', name: 'Market Opportunity Track', desc: 'Map TAM/SAM/SOM and competitive whitespace.', icon: TrendingUp },
  { id: 'investor',   name: 'Investor-Ready Track',     desc: 'Sharpen narrative, unit economics & the ask.', icon: DollarSign },
];

const KANBAN_COLUMNS = [
  { status: 'RECEIVED',  action: 'SCRUMING',    note: 'Reviewing business ideas & problem statements' },
  { status: 'PENDING',   action: 'REQUIREMENT', note: 'Gathering customer data & B2B/B2C specs' },
  { status: 'PROCESSED', action: 'MAPPING',     note: 'Defining TAM/SAM/SOM conversions' },
  { status: 'PUBLISHED', action: 'DELIVERED',   note: 'Generated scores & downloadable artifacts' },
];

const BUILD_YOUR_OWN = [
  'Market Sizing', 'Competitor Teardown', 'Pricing Strategy', 'GTM Plan',
  'Financial Model', 'Risk Register', 'User Personas', 'OKR Framework',
];

const SEED_REPORTS = [
  { id: 'r1', name: 'EcoFly Medical Drones', vertical: 'startups', tags: ['Logistics', 'Healthcare'], status: 'PUBLISHED',  score: 86 },
  { id: 'r2', name: 'Apex AI Recruiter',      vertical: 'startups', tags: ['HR Tech', 'SaaS'],       status: 'PROCESSED', score: 72 },
  { id: 'r3', name: 'GreenPack Biodegradable',vertical: 'startups', tags: ['Eco', 'Retail'],         status: 'PENDING',   score: 64 },
  { id: 'r4', name: 'Nimbus Cloud Audit',     vertical: 'startups', tags: ['Fintech', 'B2B'],        status: 'RECEIVED',  score: 0 },
  { id: 'r5', name: 'Verdant Agri-Tech',      vertical: 'msmes',    tags: ['AgriTech'],              status: 'PROCESSED', score: 78 },
  { id: 'r6', name: 'Helix Pharma Ops',       vertical: 'industries', tags: ['Pharma'],             status: 'PUBLISHED',  score: 91 },
];

function App() {
  const [page, setPage] = useState('home'); // 'home' | 'login' | 'dashboard' | 'admin-dashboard'
  const [userEmail, setUserEmail] = useState('');
  const [activeVertical, setActiveVertical] = useState('startups');
  const [activeCluster, setActiveCluster] = useState('market');
  const [selectedTracks, setSelectedTracks] = useState(['validation', 'investor']);
  const [customPicks, setCustomPicks] = useState(['Market Sizing']);
  const [reports, setReports] = useState(SEED_REPORTS);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedReport, setExpandedReport] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mainView, setMainView] = useState('pipeline'); // 'pipeline' | 'intake' | 'board'

  const toggleTrack = (id) =>
    setSelectedTracks((p) => (p.includes(id) ? p.filter((t) => t !== id) : [...p, id]));
  const toggleCustom = (name) =>
    setCustomPicks((p) => (p.includes(name) ? p.filter((t) => t !== name) : [...p, name]));

  const moveReport = (id, dir) => {
    const order = ['RECEIVED', 'PENDING', 'PROCESSED', 'PUBLISHED'];
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const idx = order.indexOf(r.status);
        const next = Math.min(order.length - 1, Math.max(0, idx + dir));
        return { ...r, status: order[next] };
      })
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setReports((prev) => [
        {
          id: `r${Date.now()}`,
          name: 'AI Strategy Report',
          vertical: activeVertical,
          tags: ['AI Analysis'],
          status: 'RECEIVED',
          score: 0,
        },
        ...prev,
      ]);
      setIsGenerating(false);
      setIsGenModalOpen(false);
    }, 1900);
  };

  const activeVerticalObj = VERTICALS.find((v) => v.id === activeVertical);

  // ---- Page routing ----
  if (page === 'home') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Homepage
            onEnter={() => setPage('dashboard')}
            onLogin={() => setPage('login')}
            onContact={() => setPage('contact')}
          />
        </motion.div>
      </AnimatePresence>
    );
  }
  if (page === 'contact') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="contact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Contact onBack={() => setPage('home')} />
        </motion.div>
      </AnimatePresence>
    );
  }
  if (page === 'login') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Login
            onLogin={(role, email) => {
              setUserEmail(email || '');
              setPage(role === 'admin' ? 'admin-dashboard' : 'dashboard');
            }}
            onBack={() => setPage('home')}
          />
        </motion.div>
      </AnimatePresence>
    );
  }
  if (page === 'admin-dashboard') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="admin-dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AdminDashboard
            onLogout={() => setPage('home')}
            onGoHome={() => setPage('home')}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ExecutiveDashboard
          onLogout={() => setPage('home')}
          onGoHome={() => setPage('home')}
          userEmail={userEmail}
        />
      </motion.div>
    </AnimatePresence>
  );
}

/* ============================================================
   MAGIC UI — Scroll Velocity Infinite Domain Navigator Component
   ============================================================ */
function ScrollVelocityContainer({ children, className = '' }) {
  return (
    <div className={`scroll-velocity-container ${className}`}>
      {children}
    </div>
  );
}

function ScrollVelocityRow({ verticals, activeVertical, setActiveVertical }) {
  const [isHovered, setIsHovered] = useState(false);
  // Duplicate list multiple times for seamless infinite looping
  const infiniteVerticals = [...verticals, ...verticals, ...verticals, ...verticals];

  return (
    <motion.div
      className="scroll-velocity-track"
      animate={{ x: ['0%', '-50%'] }}
      transition={{
        ease: 'linear',
        duration: isHovered ? 120 : 35, // Slow down significantly on hover
        repeat: Infinity,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {infiniteVerticals.map((v, idx) => {
        const active = activeVertical?.id === v.id;
        return (
          <button
            key={`${v.id}-${idx}`}
            onClick={() => setActiveVertical(v.id)}
            className={`scroll-velocity-item ${active ? 'active' : ''}`}
          >
            {v.name}
          </button>
        );
      })}
    </motion.div>
  );
}

/* ============================================================
   TOPBAR — Luxury Black & Gold Executive Navbar with ScrollVelocity
   ============================================================ */
function Topbar({ verticals, activeVertical, setActiveVertical, goHome, onProfileClick }) {
  return (
    <header className="sticky top-0 z-40 scroll-velocity-header px-6 py-3.5 text-[#FFFFFF]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 md:gap-6">
        
        {/* LEFT: Minimal Home Button */}
        <button
          onClick={goHome}
          className="group flex items-center gap-2 text-sm font-semibold text-[#F4F4F4] transition hover:text-[#D4AF37] cursor-pointer shrink-0 px-2 py-1.5"
        >
          <Home size={18} className="text-[#F4F4F4] group-hover:text-[#D4AF37] transition" />
          <span className="font-sans font-medium tracking-wide">Home</span>
        </button>

        {/* CENTER: Magic UI ScrollVelocity Infinite Domain Navigation (Full Navbar Width) */}
        <div className="flex-1 mx-2 overflow-hidden">
          <ScrollVelocityContainer>
            <ScrollVelocityRow
              verticals={verticals}
              activeVertical={activeVertical}
              setActiveVertical={setActiveVertical}
            />
          </ScrollVelocityContainer>
        </div>

        {/* RIGHT: Search, Notifications, Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.2)] bg-[#050505] px-3.5 py-1.5 text-xs text-[#CFCFCF] focus-within:border-[#D4AF37] transition">
            <Search size={14} className="text-[#9A9A9A]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-xs text-[#FFFFFF] placeholder-[#9A9A9A] focus:outline-none w-20 lg:w-28"
            />
          </div>

          <button
            title="Notifications"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[#050505] text-[#CFCFCF] hover:border-[#D4AF37] hover:text-[#D4AF37] transition cursor-pointer"
          >
            <Zap size={14} />
          </button>

          <button
            onClick={onProfileClick}
            className="flex items-center gap-1.5 rounded-full border border-[rgba(212,175,55,0.25)] bg-[#050505] px-3 py-1 text-xs font-bold text-[#FFFFFF] hover:border-[#D4AF37] transition cursor-pointer"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[#050505] font-mono text-[0.6rem] font-bold">
              EX
            </div>
            <span className="hidden xl:inline font-mono text-xs text-[#CFCFCF]">Profile</span>
          </button>
        </div>

      </div>
    </header>
  );
}

/* ============================================================
   SIDEBAR — Black & Gold Executive Sidebar
   ============================================================ */
function Sidebar({ verticals, activeVertical, setActiveVertical, open, setOpen, goHome }) {
  return (
    <aside
      className={`sticky top-0 z-20 flex h-screen flex-col border-r border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] text-[#FFFFFF] transition-all duration-300 ${
        open ? 'w-72' : 'w-20'
      }`}
    >
      {/* Brand */}
      <button
        onClick={goHome}
        className="group flex w-full items-center gap-3 px-5 py-6 text-left transition hover:bg-[#111111] cursor-pointer"
        title="Back to home"
      >
        <OrbitBrand size={38} />
        {open && (
          <div className="overflow-hidden">
            <h1 className="font-sans text-lg font-bold leading-tight text-[#FFFFFF]">
              The Conscious Orbit
            </h1>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#D4AF37]">
              Executive Suite
            </p>
          </div>
        )}
      </button>

      <button
        onClick={() => setOpen((o) => !o)}
        className="absolute -right-3 top-7 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-[#D4AF37] bg-[#111111] text-[#D4AF37] shadow-md transition hover:bg-[#050505] cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <ChevronRight size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {open && (
          <p className="px-3 pb-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#F4D67A]">
            Target Verticals
          </p>
        )}
        {verticals.map((v) => {
          const Icon = v.icon;
          const active = activeVertical === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setActiveVertical(v.id)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 border cursor-pointer ${
                active
                  ? 'bg-[#111111] text-[#FFFFFF] border-[#D4AF37] shadow-sm'
                  : 'text-[#CFCFCF] hover:text-[#FFFFFF] hover:bg-[#050505] border-transparent'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-md bg-[#D4AF37]" />
              )}
              <Icon
                size={18}
                className={`shrink-0 ${active ? 'text-[#F4D67A]' : 'text-[#D4AF37]'}`}
              />
              {open && (
                <span className="truncate text-sm font-medium">{v.name}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {open && (
        <div className="space-y-1 px-3 pb-5">
          <p className="px-3 pb-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#F4D67A]">
            System
          </p>
          <button
            onClick={goHome}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#CFCFCF] transition hover:bg-[#050505] hover:text-[#D4AF37] cursor-pointer"
          >
            <Home size={18} className="text-[#D4AF37]" />
            Back to Home
          </button>
          {[
            { icon: LayoutDashboard, label: 'Overview' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#CFCFCF] transition hover:bg-[#050505] hover:text-[#D4AF37] cursor-pointer"
            >
              <item.icon size={18} className="text-[#D4AF37]" />
              {item.label}
            </button>
          ))}
          <div className="mt-4 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[#050505] p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span className="font-mono text-xs font-semibold text-[#FFFFFF]">Executive AI Tier</span>
            </div>
            <p className="mt-1 text-[0.68rem] text-[#9A9A9A]">
              All 5 verticals &amp; tracks unlocked
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ============================================================
   SECONDARY NAVIGATION — Compact Pill Navigation
   ============================================================ */
function MainViewTabs({ mainView, setMainView }) {
  const tabs = [
    { id: 'pipeline', label: 'Venture Intelligence Pipeline', icon: Cpu },
    { id: 'intake',   label: 'Opportunity Intake',            icon: Layers },
    { id: 'board',    label: 'Executive Tracking',            icon: ClipboardList },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] p-1.5 backdrop-blur-md">
      {tabs.map((tab) => {
        const active = mainView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setMainView(tab.id)}
            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              active
                ? 'bg-[#D4AF37] text-[#050505] font-bold shadow-xs'
                : 'text-[#CFCFCF] hover:text-[#FFFFFF] hover:bg-[#111111]'
            }`}
          >
            <tab.icon size={13} className={active ? 'text-[#050505]' : 'text-[#D4AF37]'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function VerticalHero({ vertical, onOpenGenerate }) {
  const Icon = vertical?.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassPanel className="p-4 md:p-5 border-[rgba(212,175,55,0.15)] bg-[#121212] text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT: Domain Icon + ACTIVE DOMAIN badge + Title + Short Description */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[rgba(212,175,55,0.3)] bg-[#050505] text-[#D4AF37]">
              {Icon && <Icon className="h-6 w-6 text-[#D4AF37]" />}
            </div>
            <div className="space-y-0.5 text-left">
              <div className="flex items-center gap-2">
                <h2 className="font-sans text-xl font-bold text-[#F8F8F8]">
                  {vertical?.name}
                </h2>
                <span className="rounded-md border border-[#D4AF37]/40 bg-[#050505] px-2 py-0.5 font-mono text-[0.58rem] font-bold uppercase tracking-wider text-[#D4AF37]">
                  ACTIVE DOMAIN
                </span>
              </div>
              <p className="text-xs text-[#CFCFCF] truncate max-w-lg">{vertical?.desc}</p>
            </div>
          </div>

          {/* RIGHT: Health Status + Secondary CTA + Primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Health Status */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-[rgba(212,175,55,0.15)] bg-[#050505] px-3 py-1.5 font-mono text-xs text-[#10B981]">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Optimal</span>
            </div>

            {/* Secondary CTA Button */}
            <GhostButton className="text-xs py-2 px-4">
              <FileText size={13} /> Strategy Brief
            </GhostButton>

            {/* Primary CTA Button */}
            <RoyalButton onClick={onOpenGenerate} className="text-xs font-bold py-2 px-5">
              <Sparkles size={13} /> Run AI Analysis
            </RoyalButton>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}



/* ============================================================
   THREE-LAYER INTAKE ENGINE
   ============================================================ */
function ThreeLayerEngine({
  activeCluster, setActiveCluster,
  selectedTracks, toggleTrack,
  customPicks, toggleCustom,
  onGenerate,
}) {
  return (
    <section className="space-y-7">
      <SectionTitle
        icon={Layers}
        kicker="Startup Vertical"
        title="Three-Layer Dynamic Intake Engine"
        subtitle="A layered architecture: capture once, cluster by theme, then select flagship tracks."
      />

      {/* LAYER 1 — CLIENT PROFILE */}
      <div className="space-y-3">
        <LayerBadge n={1} title="Client Profile" hint="Captured once at signup" />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <GlassPanel className="p-6 border-[#D4AF37]/50 bg-[#3B0413]/85 text-white">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Company Name">
                <Input defaultValue="EcoFly Robotics" />
              </Field>
              <Field label="Industry">
                <Select defaultValue="Logistics">
                  <option>Logistics</option><option>Healthcare</option><option>Fintech</option>
                  <option>SaaS</option><option>AgriTech</option>
                </Select>
              </Field>
              <Field label="Stage">
                <Select defaultValue="Seed">
                  <option>Idea</option><option>Pre-Seed</option><option>Seed</option>
                  <option>Series A</option><option>Growth</option>
                </Select>
              </Field>
              <Field label="Geography">
                <Input defaultValue="Bengaluru, IN" />
              </Field>
              <Field label="Business Model">
                <Select defaultValue="B2B">
                  <option>B2B</option><option>B2C</option><option>B2B2C</option><option>Marketplace</option>
                </Select>
              </Field>
              <Field label="Contact Info">
                <Input defaultValue="founder@ecofly.io" />
              </Field>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* LAYER 2 — CLUSTER FORMS */}
      <div className="space-y-3">
        <LayerBadge n={2} title="Cluster Forms" hint="Report-specific inputs grouped by theme" />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
          <GlassPanel className="overflow-hidden p-0 border-[#D4AF37]/50 bg-[#350310]">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] p-2">
              {CLUSTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCluster(tab.id)}
                  className={`relative rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer ${
                    activeCluster === tab.id ? 'text-[#FFFFFF]' : 'text-[#FECDD3] hover:text-[#FFFFFF]'
                  }`}
                >
                  {activeCluster === tab.id && (
                    <motion.span
                      layoutId="cluster-tab"
                      className="absolute inset-0 rounded-lg bg-[#D4AF37] border border-[#F4D67A] shadow-xs"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className={`font-mono text-[0.62rem] font-bold uppercase tracking-wider ${activeCluster === tab.id ? 'text-[#050505]' : 'text-[#F4D67A]'}`}>
                      {tab.cluster}
                    </span>
                    {tab.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab body */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCluster}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  {activeCluster === 'market' && (
                    <>
                      <Field label="Problem statement">
                        <Textarea defaultValue="Rural clinics wait hours for emergency blood & vaccine deliveries." className="min-h-[90px]" />
                      </Field>
                      <Field label="Specific pain point">
                        <Textarea defaultValue="Last-mile cold-chain breaks spoil 30% of medical cargo." className="min-h-[90px]" />
                      </Field>
                      <Field label="Willingness-to-pay signals">
                        <Input defaultValue="$15–25 per priority delivery" />
                      </Field>
                      <Field label="Ideal customer profile">
                        <Input defaultValue="Regional health networks, 50+ clinics" />
                      </Field>
                    </>
                  )}
                  {activeCluster === 'viability' && (
                    <>
                      <Field label="Revenue model"><Input defaultValue="Per-delivery + monthly retainer" /></Field>
                      <Field label="Unit economics (gross margin)"><Input defaultValue="62% at scale" /></Field>
                      <Field label="Key costs"><Input defaultValue="Fleet, batteries, BVLOS compliance" /></Field>
                      <Field label="Break-even timeline"><Input defaultValue="Month 18" /></Field>
                    </>
                  )}
                  {activeCluster === 'launch' && (
                    <>
                      <Field label="Launch geography"><Input defaultValue="Karnataka pilot zone" /></Field>
                      <Field label="Go-to-market motion"><Input defaultValue="Govt partnerships + NGO tenders" /></Field>
                      <Field label="Key milestones (12mo)"><Textarea defaultValue="3 hubs live · 10 clinics onboarded · BVLOS certified" className="min-h-[70px]" /></Field>
                      <Field label="Funding ask"><Input defaultValue="$1.2M seed" /></Field>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* LAYER 3 — REPORT & TRACK CATALOGUE */}
      <div className="space-y-3">
        <LayerBadge n={3} title="Report & Track Catalogue" hint="Flagship tracks + build-your-own" />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="space-y-5">
          {/* Flagship tracks */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {FLAGSHIP_TRACKS.map((track) => {
              const Icon = track.icon;
              const selected = selectedTracks.includes(track.id);
              return (
                <button
                  key={track.id}
                  onClick={() => toggleTrack(track.id)}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition duration-200 cursor-pointer ${
                    selected
                      ? 'border-[#D4AF37] bg-[#111111] shadow-md ring-1 ring-[#D4AF37]'
                      : 'border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="relative flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(212,175,55,0.3)] bg-[#0E0E0E] text-[#D4AF37]">
                      <Icon className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                    {selected && <CheckCircle2 className="h-5 w-5 text-[#10B981]" />}
                  </div>
                  <h4 className="relative mt-4 font-sans text-lg font-bold text-[#FFFFFF]">{track.name}</h4>
                  <p className="relative mt-1 text-xs text-[#CFCFCF]">{track.desc}</p>
                  <span className="relative mt-3 inline-block font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#F4D67A]">
                    Flagship Executive Track
                  </span>
                </button>
              );
            })}
          </div>

          {/* Build your own picker */}
          <GlassPanel className="p-6 border-[rgba(212,175,55,0.25)] bg-[#111111]">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#D4AF37]" />
              <h4 className="font-sans text-lg font-bold text-[#FFFFFF]">Build Your Own Track</h4>
            </div>
            <p className="mt-1 text-sm text-[#CFCFCF]">Compose a custom report from modular components.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {BUILD_YOUR_OWN.map((mod) => {
                const on = customPicks.includes(mod);
                return (
                  <button
                    key={mod}
                    onClick={() => toggleCustom(mod)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sans text-xs font-medium transition cursor-pointer ${
                      on
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-[#050505] font-bold'
                        : 'border-[rgba(212,175,55,0.2)] bg-[#0E0E0E] text-[#CFCFCF] hover:border-[#D4AF37]'
                    }`}
                  >
                    {on && <CheckCircle2 size={12} className="text-[#050505]" />}
                    {mod}
                  </button>
                );
              })}
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Generate Report button */}
      <div className="sticky bottom-4 z-10">
        <button
          onClick={onGenerate}
          className="btn-royal-red flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold shadow-lg cursor-pointer"
        >
          <Sparkles size={18} /> Generate Report
          <span className="ml-2 rounded-full bg-[#050505]/40 px-2 py-0.5 font-mono text-xs text-[#050505]">
            {selectedTracks.length + customPicks.length} modules
          </span>
        </button>
      </div>
    </section>
  );
}

/* ============================================================
   GENERIC PANEL — Students / Institutions
   ============================================================ */
function GenericVerticalPanel({ vertical }) {
  const Icon = vertical?.icon;
  const cards =
    vertical?.id === 'students'
      ? [
          { icon: GraduationCap, title: 'Academic Counseling', desc: '1:1 mentorship plans, course trajectories & research direction.' },
          { icon: ClipboardList, title: 'Research Mentorship', desc: 'Pair scholars with domain guides; track thesis milestones.' },
          { icon: Target, title: 'Project Management', desc: 'Scoped deliverables, deadlines & advisor reviews.' },
        ]
      : [
          { icon: FileText, title: 'Curriculum Development', desc: 'Design outcomes-aligned curricula across departments.' },
          { icon: Users, title: 'Faculty Training', desc: 'Upskill faculty with tracked competency modules.' },
          { icon: Building2, title: 'Organizational Diagnosis', desc: 'Audit institutional health across stakeholders.' },
        ];
  return (
    <section className="space-y-6">
      <SectionTitle
        icon={Icon}
        kicker="Engagement Modules"
        title={`${vertical?.name} Modules`}
        subtitle="Sovereign engagement workflows tailored to this vertical."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((c) => {
          const CIcon = c.icon;
          return (
            <GlassPanel key={c.title} className="group p-5 transition hover:border-[#D4AF37] bg-[#111111] text-white border-[rgba(212,175,55,0.18)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(212,175,55,0.3)] bg-[#0E0E0E] text-[#D4AF37]">
                <CIcon className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <h4 className="mt-4 font-sans text-lg font-bold text-[#FFFFFF]">{c.title}</h4>
              <p className="mt-1 text-sm text-[#CFCFCF]">{c.desc}</p>
              <button className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#F4D67A] transition hover:gap-2 cursor-pointer">
                Explore <ChevronRight size={13} />
              </button>
            </GlassPanel>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   KANBAN BOARD — report lifecycle tracking
   ============================================================ */
function KanbanBoard({ reports, columns, moveReport, expandedReport, setExpandedReport, onGenerate }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          icon={ClipboardList}
          kicker="Operations Pipeline"
          title="Application & Report Tracking"
          subtitle="The lifecycle of every generated report — from intake to published artifact."
          noMargin
        />
        <RoyalButton onClick={onGenerate}>
          <Plus size={15} /> New Report
        </RoyalButton>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {columns.map((col) => {
          const items = reports.filter((r) => r.status === col.status);
          return (
            <div key={col.status} className="flex flex-col rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[#111111] shadow-xs">
              {/* Column header */}
              <div className="flex items-center justify-between border-b border-[rgba(212,175,55,0.18)] px-4 py-3 bg-[#0E0E0E]">
                <div className="flex items-center gap-2">
                  <StatusDot status={col.status} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">{col.status}</span>
                </div>
                <span className="rounded-md border border-[rgba(212,175,55,0.3)] bg-[#050505] px-2 py-0.5 font-mono text-xs font-bold text-[#F4D67A]">{items.length}</span>
              </div>
              <div className="border-b border-[rgba(212,175,55,0.15)] bg-[#050505] px-4 py-2">
                <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#F4D67A]">
                  Action · {col.action}
                </span>
                <p className="mt-0.5 text-[0.68rem] text-[#9A9A9A]">{col.note}</p>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-3 p-3">
                <AnimatePresence>
                  {items.map((r) => (
                    <motion.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      className="group rounded-xl border border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] p-3.5 transition hover:border-[#D4AF37] hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-sans text-base font-bold leading-snug text-[#FFFFFF]">{r.name}</h5>
                        <StatusBadge status={r.status} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.tags.map((t) => (
                          <span key={t} className="rounded-md bg-[#050505] px-1.5 py-0.5 font-mono text-[0.62rem] text-[#F4D67A] border border-[rgba(212,175,55,0.2)]">{t}</span>
                        ))}
                      </div>

                      {/* Score */}
                      {r.status === 'PUBLISHED' && r.score > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#050505]">
                            <div
                              className="h-full rounded-full bg-[#D4AF37]"
                              style={{ width: `${r.score}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-[#F4D67A]">{r.score}</span>
                          <button
                            onClick={() => setExpandedReport(expandedReport === r.id ? null : r.id)}
                            className="text-[#CFCFCF] transition hover:text-[#FFFFFF] cursor-pointer"
                            aria-label="Expand"
                          >
                            <ChevronDown size={14} className={`transition ${expandedReport === r.id ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      )}

                      <AnimatePresence>
                        {expandedReport === r.id && r.status === 'PUBLISHED' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 space-y-2 rounded-lg border border-[rgba(212,175,55,0.2)] bg-[#050505] p-3">
                              {[
                                { k: 'Market Demand', v: 88 },
                                { k: 'Tech Feasibility', v: 72 },
                                { k: 'Unit Economics', v: 90 },
                              ].map((m) => (
                                <div key={m.k} className="flex items-center gap-2 text-[0.68rem]">
                                  <span className="w-28 text-[#CFCFCF]">{m.k}</span>
                                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#0E0E0E]">
                                    <div className="h-full bg-[#D4AF37]" style={{ width: `${m.v}%` }} />
                                  </div>
                                  <span className="w-7 text-right font-mono font-bold text-[#F4D67A]">{m.v}</span>
                                </div>
                              ))}
                              <button className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#D4AF37] bg-[#D4AF37] py-2 font-mono text-xs font-bold text-[#050505] transition hover:bg-[#F4D67A] cursor-pointer">
                                <Download size={13} /> Download Artifact
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Mover controls */}
                      <div className="mt-3 flex items-center justify-between opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => moveReport(r.id, -1)}
                          disabled={r.status === 'RECEIVED'}
                          className="font-mono text-[0.62rem] text-[#FECDD3] transition hover:text-[#FFFFFF] disabled:opacity-30 cursor-pointer"
                        >
                          ← Back
                        </button>
                        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[#E6C878]">{r.vertical}</span>
                        <button
                          onClick={() => moveReport(r.id, 1)}
                          disabled={r.status === 'PUBLISHED'}
                          className="font-mono text-[0.62rem] text-[#FECDD3] transition hover:text-[#FFFFFF] disabled:opacity-30 cursor-pointer"
                        >
                          Advance →
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#D4AF37]/40 px-3 py-8 text-center text-xs text-[#FECDD3]/60">
                    No reports in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   GENERATE REPORT MODAL
   ============================================================ */
function GenerateReportModal({ onClose, onConfirm, loading, vertical }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A0108]/75 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.25)] bg-[#111111] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] px-6 py-4">
          <div className="relative flex items-center gap-2">
            <Crown className="h-5 w-5 text-[#D4AF37]" />
            <h3 className="font-sans text-lg font-bold text-[#FFFFFF]">Generate AI Strategy Report</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-[#CFCFCF] transition hover:bg-[#050505] hover:text-[#FFFFFF] cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-sm text-[#CFCFCF] leading-relaxed">
            Compose a new report for the <strong className="text-[#F4D67A]">{vertical?.name}</strong> vertical.
            Selected modules will be synthesized into a flagship deliverable.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: Layers, label: 'Intake' },
              { icon: Sparkles, label: 'Synthesize' },
              { icon: Download, label: 'Deliver' },
            ].map((step, i) => (
              <div key={step.label} className="rounded-xl border border-[rgba(212,175,55,0.18)] bg-[#050505] p-3">
                <step.icon size={16} className="mx-auto text-[#D4AF37]" />
                <p className="mt-1.5 font-mono text-[0.68rem] text-[#CFCFCF]">{i + 1}. {step.label}</p>
              </div>
            ))}
          </div>
          {loading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#F4D67A]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-4 w-4 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37]"
              />
              Synthesizing neural insights...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <RoyalButton onClick={onConfirm} disabled={loading}>
            <Sparkles size={15} /> {loading ? 'Generating…' : 'Confirm & Generate'}
          </RoyalButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   Small shared presentational helpers
   ============================================================ */
function SectionTitle({ icon: Icon, kicker, title, subtitle, noMargin }) {
  return (
    <div className={noMargin ? '' : 'mb-1'}>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-[#D4AF37]" />}
        <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#F4D67A]">{kicker}</span>
      </div>
      <h2 className="mt-1 font-sans text-2xl font-bold leading-tight text-[#FFFFFF] md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1 max-w-2xl text-sm text-[#CFCFCF]">{subtitle}</p>}
    </div>
  );
}

function LayerBadge({ n, title, hint }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4AF37] bg-[#0E0E0E] font-mono text-sm font-bold text-[#F4D67A]">
        {n}
      </div>
      <div>
        <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#F4D67A]">Layer {n}</span>
        <h3 className="font-sans text-lg font-bold text-[#FFFFFF]">{title}</h3>
      </div>
      <span className="ml-1 hidden text-xs text-[#9A9A9A] sm:inline">— {hint}</span>
    </div>
  );
}

export default App;

