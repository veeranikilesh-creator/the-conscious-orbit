import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion';
import {
  GraduationCap, Building2, Crown,
  ChevronRight, Sparkles, FileText,
  Layers, ClipboardList, Search, Cpu, Home,
  TrendingUp, DollarSign, Download, CheckCircle2, Bell,
  Plus, X, ChevronDown, Target, Zap, Users,
} from 'lucide-react';
import './App.css';
import {
  GlassPanel, Field, Input, Textarea, Select,
  RoyalButton, GhostButton, StatusBadge, StatusDot,
  AiPulseBadge, AiInsightWidget
} from './components/ui.jsx';
import { VERTICALS, REPORT_STATUSES } from './constants.js';
import VentureProcessor from './components/VentureProcessor.jsx';
import { StartupMarketEngine, MsmeOptimizationEngine, IndustryAnalysisEngine } from './components/VerticalEngines.jsx';
import Homepage from './components/Homepage.jsx';
import Login from './components/Login.jsx';

/* ============================================================
   THE CONSCIOUS ORBIT — Ultra-Luxury Red & Gold Executive Workspace
   ============================================================ */

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

/* Seed values for the Layer 1 / Layer 2 intake forms. These are the initial
   state of the controlled inputs — edits persist across cluster tab switches
   and are read by handleGenerate when composing a report. */
const INITIAL_PROFILE = {
  company: 'EcoFly Robotics',
  industry: 'Logistics',
  stage: 'Seed',
  geography: 'Bengaluru, IN',
  model: 'B2B',
  contact: 'founder@ecofly.io',
};

const INITIAL_CLUSTERS = {
  market: {
    problem: 'Rural clinics wait hours for emergency blood & vaccine deliveries.',
    pain: 'Last-mile cold-chain breaks spoil 30% of medical cargo.',
    wtp: '$15–25 per priority delivery',
    icp: 'Regional health networks, 50+ clinics',
  },
  viability: {
    revenue: 'Per-delivery + monthly retainer',
    margin: '62% at scale',
    costs: 'Fleet, batteries, BVLOS compliance',
    breakeven: 'Month 18',
  },
  launch: {
    geography: 'Karnataka pilot zone',
    gtm: 'Govt partnerships + NGO tenders',
    milestones: '3 hubs live · 10 clinics onboarded · BVLOS certified',
    ask: '$1.2M seed',
  },
};

const SEED_REPORTS = [
  { id: 'r1', name: 'EcoFly Medical Drones', vertical: 'startups', tags: ['Logistics', 'Healthcare'], status: 'PUBLISHED',  score: 86 },
  { id: 'r2', name: 'Apex AI Recruiter',      vertical: 'startups', tags: ['HR Tech', 'SaaS'],       status: 'PROCESSED', score: 72 },
  { id: 'r3', name: 'GreenPack Biodegradable',vertical: 'startups', tags: ['Eco', 'Retail'],         status: 'PENDING',   score: 64 },
  { id: 'r4', name: 'Nimbus Cloud Audit',     vertical: 'startups', tags: ['Fintech', 'B2B'],        status: 'RECEIVED',  score: 0 },
  { id: 'r5', name: 'Verdant Agri-Tech',      vertical: 'msmes',    tags: ['AgriTech'],              status: 'PROCESSED', score: 78 },
  { id: 'r6', name: 'Helix Pharma Ops',       vertical: 'industries', tags: ['Pharma'],             status: 'PUBLISHED',  score: 91 },
];

function App() {
  const [page, setPage] = useState('home'); // 'home' | 'login' | 'dashboard'
  const [activeVertical, setActiveVertical] = useState('startups');
  const [activeCluster, setActiveCluster] = useState('market');
  const [selectedTracks, setSelectedTracks] = useState(['validation', 'investor']);
  const [customPicks, setCustomPicks] = useState(['Market Sizing']);
  const [reports, setReports] = useState(SEED_REPORTS);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedReport, setExpandedReport] = useState(null);
  const [mainView, setMainView] = useState('pipeline'); // 'pipeline' | 'intake' | 'board'
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(null);

  // Controlled intake state — read by handleGenerate.
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [clusters, setClusters] = useState(INITIAL_CLUSTERS);

  const genTimer = useRef(null);
  useEffect(() => () => clearTimeout(genTimer.current), []);

  const setProfileField = (key, value) => setProfile((p) => ({ ...p, [key]: value }));
  const setClusterField = (cluster, key, value) =>
    setClusters((c) => ({ ...c, [cluster]: { ...c[cluster], [key]: value } }));

  const toggleTrack = (id) =>
    setSelectedTracks((p) => (p.includes(id) ? p.filter((t) => t !== id) : [...p, id]));
  const toggleCustom = (name) =>
    setCustomPicks((p) => (p.includes(name) ? p.filter((t) => t !== name) : [...p, name]));

  const moveReport = (id, dir) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const idx = REPORT_STATUSES.indexOf(r.status);
        const next = Math.min(REPORT_STATUSES.length - 1, Math.max(0, idx + dir));
        return { ...r, status: REPORT_STATUSES[next] };
      })
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    genTimer.current = setTimeout(() => {
      // Compose the report from what the user actually entered.
      const trackNames = FLAGSHIP_TRACKS
        .filter((t) => selectedTracks.includes(t.id))
        .map((t) => t.name.replace(/ Track$/, ''));
      const tags = [profile.industry, profile.model, ...trackNames, ...customPicks]
        .filter(Boolean)
        .slice(0, 4);

      setReports((prev) => [
        {
          id: `r${Date.now()}`,
          name: profile.company.trim() || 'Untitled Venture',
          vertical: activeVertical,
          tags: tags.length ? tags : ['AI Analysis'],
          status: 'RECEIVED',
          score: 0,
          brief: {
            stage: profile.stage,
            geography: profile.geography,
            contact: profile.contact,
            modules: selectedTracks.length + customPicks.length,
            ...clusters.market,
            ...clusters.viability,
            ...clusters.launch,
          },
        },
        ...prev,
      ]);
      setIsGenerating(false);
      setIsGenModalOpen(false);
      setMainView('board');
      setNotice(`Report queued for ${profile.company.trim() || 'Untitled Venture'}`);
    }, 1900);
  };

  const activeVerticalObj = VERTICALS.find((v) => v.id === activeVertical);

  const visibleReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.vertical.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [reports, search]);

  // ---- Page routing ----
  // A single AnimatePresence wraps every page so the outgoing page can finish
  // its exit transition before the incoming one mounts.
  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <AnimatePresence mode="wait">
      {page === 'home' && (
        <motion.div key="home" {...fade}>
          <Homepage onEnter={() => setPage('dashboard')} onLogin={() => setPage('login')} />
        </motion.div>
      )}

      {page === 'login' && (
        <motion.div key="login" {...fade}>
          <Login onLogin={() => setPage('dashboard')} onBack={() => setPage('home')} />
        </motion.div>
      )}

      {page === 'dashboard' && (
    <motion.div key="dashboard" {...fade} className="min-h-screen bg-royal-mesh text-[#111827] flex flex-col w-full">
      {/* ============ MAIN WORKSPACE ============ */}
      <main className="flex-1 overflow-x-hidden flex flex-col w-full">
        {/* TOPBAR — Sticky Executive Navbar */}
        <Topbar
          verticals={VERTICALS}
          activeVertical={activeVerticalObj}
          setActiveVertical={setActiveVertical}
          goHome={() => setPage('home')}
          onProfileClick={() => setPage('login')}
          search={search}
          setSearch={setSearch}
          notice={notice}
          onDismissNotice={() => setNotice(null)}
        />

        <div className="flex-1 mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:space-y-12 sm:px-6 sm:py-8 md:px-10">
          {/* SCREEN 1: HERO CARD */}
          <VerticalHero vertical={activeVerticalObj} onOpenGenerate={() => setIsGenModalOpen(true)} />

          {/* SCREEN 2: NAVIGATION TABS */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <MainViewTabs mainView={mainView} setMainView={setMainView} />
            <AiPulseBadge label="AI Co-Pilot Telemetry Active" />
          </div>

          {/* SCREEN 3: PRIMARY WORKSPACE (PIPELINE / INTAKE / BOARD) */}
          <div className="space-y-10">
            {/* ---------- PIPELINE VIEW ---------- */}
            {mainView === 'pipeline' && <VentureProcessor />}

            {/* ---------- INTAKE VIEW ---------- */}
            {mainView === 'intake' && (
              <>
                {activeVertical === 'startups' && (
                  <>
                    <ThreeLayerEngine
                      activeCluster={activeCluster}
                      setActiveCluster={setActiveCluster}
                      selectedTracks={selectedTracks}
                      toggleTrack={toggleTrack}
                      customPicks={customPicks}
                      toggleCustom={toggleCustom}
                      profile={profile}
                      setProfileField={setProfileField}
                      clusters={clusters}
                      setClusterField={setClusterField}
                      onGenerate={() => setIsGenModalOpen(true)}
                    />
                    <div className="mt-10 flex items-center gap-4">
                      <div className="h-px flex-1 bg-[rgba(212,175,55,0.12)]" />
                      <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Function Engine</span>
                      <div className="h-px flex-1 bg-[rgba(212,175,55,0.12)]" />
                    </div>
                    <StartupMarketEngine />
                  </>
                )}
                {activeVertical === 'msmes' && <MsmeOptimizationEngine />}
                {activeVertical === 'industries' && <IndustryAnalysisEngine />}
                {(activeVertical === 'students' || activeVertical === 'institutions') && (
                  <GenericVerticalPanel vertical={activeVerticalObj} />
                )}
              </>
            )}

            {/* ---------- BOARD VIEW ---------- */}
            {mainView === 'board' && (
              <KanbanBoard
                reports={visibleReports}
                totalCount={reports.length}
                search={search}
                columns={KANBAN_COLUMNS}
                moveReport={moveReport}
                expandedReport={expandedReport}
                setExpandedReport={setExpandedReport}
                onGenerate={() => setIsGenModalOpen(true)}
              />
            )}
          </div>

          {/* SCREEN 4: AI INTELLIGENCE CENTER (LOWER SCROLL SECTION) */}
          <section className="pt-8 space-y-8 border-t border-[rgba(212,175,55,0.12)]">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#D4AF37]" />
              <div>
                <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Neural Telemetry &amp; Insights
                </span>
                <h3 className="font-sans text-2xl font-bold text-[#F8F8F8]">AI Intelligence Center</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
              {/* Startups Neural Read */}
              <div className="lg:col-span-7">
                <AiInsightWidget verticalName={activeVerticalObj?.name} />
              </div>

              {/* Executive Recommendations & Risk Signals */}
              <div className="lg:col-span-5">
                <GlassPanel className="p-5 space-y-4 border-[rgba(212,175,55,0.12)] bg-[#151515] text-white rounded-[22px]">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[#D4AF37]" />
                    <h4 className="font-sans text-base font-bold text-[#F8F8F8]">Executive Recommendations</h4>
                  </div>
                  <p className="text-xs text-[#9A9A9A]">Opportunity signals &amp; risk detection for {activeVerticalObj?.name}.</p>
                  <div className="space-y-2 pt-1">
                    {[
                      { label: 'Synthesize Market Fit', desc: 'Auto-map TAM/SAM/SOM whitespace' },
                      { label: 'Audit Bottlenecks', desc: 'Isolate single points of operational failure' },
                      { label: 'Generate Pitch Narrative', desc: 'Format investor-ready deck & financial ask' },
                    ].map((act) => (
                      <button
                        key={act.label}
                        onClick={() => setIsGenModalOpen(true)}
                        className="group flex w-full items-center justify-between rounded-xl border border-[rgba(212,175,55,0.12)] bg-[#1B1B1B] p-3 text-left transition hover:border-[#D4AF37] hover:scale-[1.01] cursor-pointer"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#F8F8F8] group-hover:text-[#D4AF37] transition">{act.label}</p>
                          <p className="font-mono text-[0.62rem] text-[#9A9A9A]">{act.desc}</p>
                        </div>
                        <ChevronRight size={14} className="text-[#D4AF37] transition group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </GlassPanel>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ============ GENERATE REPORT MODAL ============ */}
      <AnimatePresence>
        {isGenModalOpen && (
          <GenerateReportModal
            onClose={() => setIsGenModalOpen(false)}
            onConfirm={handleGenerate}
            loading={isGenerating}
            vertical={activeVerticalObj}
            company={profile.company}
            moduleCount={selectedTracks.length + customPicks.length}
          />
        )}
      </AnimatePresence>
    </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   MAGIC UI — Scroll Velocity Infinite Domain Navigator Component
   ============================================================ */

/* The marquee only eases its speed down on hover. Touch devices have no hover,
   so there the domains never stop moving and every tap chases a sliding target.
   Compact viewports get a plain swipeable row instead — same buttons, same
   handler, same pill styling; it just holds still. */
function useIsCompact(query = '(max-width: 767px)') {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

function DomainScrollRow({ verticals, activeVertical, setActiveVertical }) {
  return (
    <div className="domain-scroller" role="tablist" aria-label="Active domain">
      {verticals.map((v) => {
        const active = activeVertical?.id === v.id;
        return (
          <button
            key={v.id}
            role="tab"
            aria-selected={active}
            onClick={() => setActiveVertical(v.id)}
            className={`scroll-velocity-item ${active ? 'active' : ''}`}
          >
            {v.name}
          </button>
        );
      })}
    </div>
  );
}

function ScrollVelocityContainer({ children, className = '' }) {
  return (
    <div className={`scroll-velocity-container ${className}`}>
      {children}
    </div>
  );
}

function ScrollVelocityRow({ verticals, activeVertical, setActiveVertical }) {
  // Duplicate list multiple times for seamless infinite looping
  const infiniteVerticals = [...verticals, ...verticals, ...verticals, ...verticals];

  // Drive the marquee from a motion value rather than an animate() tween: changing
  // a tween's duration mid-flight restarts it (visible jump), whereas scaling the
  // per-frame delta lets hover ease the speed down continuously.
  const x = useMotionValue(0);
  const xPercent = useTransform(x, (v) => `${v}%`);
  const speed = useRef(1);
  const BASE_PERCENT_PER_SEC = 50 / 35; // travel 50% of the track every 35s

  useAnimationFrame((_, delta) => {
    const next = x.get() - (delta / 1000) * BASE_PERCENT_PER_SEC * speed.current;
    // The list is duplicated 4x, so -50% lands on an identical frame — wrap there.
    x.set(next <= -50 ? next + 50 : next);
  });

  return (
    <motion.div
      className="scroll-velocity-track"
      style={{ x: xPercent }}
      onMouseEnter={() => { speed.current = 35 / 120; }}
      onMouseLeave={() => { speed.current = 1; }}
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
function Topbar({
  verticals, activeVertical, setActiveVertical, goHome, onProfileClick,
  search, setSearch, notice, onDismissNotice,
}) {
  const isCompact = useIsCompact();

  return (
    <header className="sticky top-0 z-40 scroll-velocity-header px-3 py-3 text-[#FFFFFF] sm:px-6 sm:py-3.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 md:gap-6">

        {/* LEFT: Minimal Home Button */}
        <button
          onClick={goHome}
          aria-label="Home"
          className="group flex items-center gap-2 text-sm font-semibold text-[#F4F4F4] transition hover:text-[#D4AF37] cursor-pointer shrink-0 px-1.5 py-1.5 sm:px-2"
        >
          <Home size={18} className="shrink-0 text-[#F4F4F4] group-hover:text-[#D4AF37] transition" />
          <span className="hidden sm:inline font-sans font-medium tracking-wide">Home</span>
        </button>

        {/* CENTER: Magic UI ScrollVelocity Infinite Domain Navigation (Full Navbar Width) */}
        <div className="min-w-0 flex-1 mx-1 overflow-hidden sm:mx-2">
          {isCompact ? (
            <DomainScrollRow
              verticals={verticals}
              activeVertical={activeVertical}
              setActiveVertical={setActiveVertical}
            />
          ) : (
            <ScrollVelocityContainer>
              <ScrollVelocityRow
                verticals={verticals}
                activeVertical={activeVertical}
                setActiveVertical={setActiveVertical}
              />
            </ScrollVelocityContainer>
          )}
        </div>

        {/* RIGHT: Search, Notifications, Profile */}
        <div className="flex items-center gap-1.5 shrink-0 sm:gap-2.5">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.2)] bg-[#050505] px-3.5 py-1.5 text-xs text-[#CFCFCF] focus-within:border-[#D4AF37] transition">
            <Search size={14} className="text-[#9A9A9A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="bg-transparent text-xs text-[#FFFFFF] placeholder-[#9A9A9A] focus:outline-none w-20 lg:w-28"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="text-[#9A9A9A] transition hover:text-[#D4AF37] cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              title={notice || 'No new notifications'}
              aria-label="Notifications"
              onClick={onDismissNotice}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[#050505] text-[#CFCFCF] hover:border-[#D4AF37] hover:text-[#D4AF37] transition cursor-pointer sm:h-8 sm:w-8"
            >
              <Bell size={14} />
              {notice && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#D4AF37] ring-2 ring-[#0B0B0B]" />
              )}
            </button>
            <AnimatePresence>
              {notice && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-10 z-50 w-60 max-w-[calc(100vw-1.5rem)] rounded-xl border border-[rgba(212,175,55,0.3)] bg-[#111111] p-3 shadow-xl"
                >
                  <p className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#F4D67A]">
                    Latest Activity
                  </p>
                  <p className="mt-1 text-xs text-[#CFCFCF]">{notice}</p>
                  <button
                    onClick={onDismissNotice}
                    className="mt-2 font-mono text-[0.62rem] font-bold text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={onProfileClick}
            aria-label="Profile"
            className="flex items-center gap-1.5 rounded-full border border-[rgba(212,175,55,0.25)] bg-[#050505] px-2.5 py-1.5 text-xs font-bold text-[#FFFFFF] hover:border-[#D4AF37] transition cursor-pointer sm:px-3 sm:py-1"
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
  const [briefOpen, setBriefOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassPanel className="p-4 md:p-5 border-[rgba(212,175,55,0.15)] bg-[#121212] text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT: Domain Icon + ACTIVE DOMAIN badge + Title + Short Description */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[rgba(212,175,55,0.3)] bg-[#050505] text-[#D4AF37]">
              {Icon && <Icon className="h-6 w-6 text-[#D4AF37]" />}
            </div>
            <div className="min-w-0 space-y-0.5 text-left">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="font-sans text-lg font-bold text-[#F8F8F8] sm:text-xl">
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
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:shrink-0 lg:flex-nowrap">
            {/* Health Status */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-[rgba(212,175,55,0.15)] bg-[#050505] px-3 py-1.5 font-mono text-xs text-[#10B981]">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Optimal</span>
            </div>

            {/* Secondary CTA Button */}
            <GhostButton onClick={() => setBriefOpen((o) => !o)} className="text-xs py-2 px-3.5 sm:px-4">
              <FileText size={13} className="shrink-0" /> Strategy Brief
              <ChevronDown size={12} className={`shrink-0 transition ${briefOpen ? 'rotate-180' : ''}`} />
            </GhostButton>

            {/* Primary CTA Button */}
            <RoyalButton onClick={onOpenGenerate} className="text-xs font-bold py-2 px-4 sm:px-5">
              <Sparkles size={13} className="shrink-0" /> Run AI Analysis
            </RoyalButton>
          </div>
        </div>

        {/* Expandable strategy brief for the active domain */}
        <AnimatePresence>
          {briefOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[rgba(212,175,55,0.15)] pt-4 sm:grid-cols-3">
                {[
                  { k: 'Engagement Focus', v: vertical?.desc },
                  { k: 'Primary Deliverable', v: 'Conscious Orbital Score & 1/0 verdict' },
                  { k: 'Typical Cycle', v: '4 stages · intake to published artifact' },
                ].map((row) => (
                  <div key={row.k} className="rounded-xl border border-[rgba(212,175,55,0.18)] bg-[#050505] p-3">
                    <p className="font-mono text-[0.6rem] font-bold uppercase tracking-wider text-[#F4D67A]">{row.k}</p>
                    <p className="mt-1 text-xs text-[#CFCFCF]">{row.v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
  profile, setProfileField,
  clusters, setClusterField,
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
          <GlassPanel className="p-4 sm:p-6 border-[#D4AF37]/50 bg-[#3B0413]/85 text-white">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Company Name">
                <Input value={profile.company} onChange={(e) => setProfileField('company', e.target.value)} />
              </Field>
              <Field label="Industry">
                <Select value={profile.industry} onChange={(e) => setProfileField('industry', e.target.value)}>
                  <option>Logistics</option><option>Healthcare</option><option>Fintech</option>
                  <option>SaaS</option><option>AgriTech</option>
                </Select>
              </Field>
              <Field label="Stage">
                <Select value={profile.stage} onChange={(e) => setProfileField('stage', e.target.value)}>
                  <option>Idea</option><option>Pre-Seed</option><option>Seed</option>
                  <option>Series A</option><option>Growth</option>
                </Select>
              </Field>
              <Field label="Geography">
                <Input value={profile.geography} onChange={(e) => setProfileField('geography', e.target.value)} />
              </Field>
              <Field label="Business Model">
                <Select value={profile.model} onChange={(e) => setProfileField('model', e.target.value)}>
                  <option>B2B</option><option>B2C</option><option>B2B2C</option><option>Marketplace</option>
                </Select>
              </Field>
              <Field label="Contact Info">
                <Input value={profile.contact} onChange={(e) => setProfileField('contact', e.target.value)} />
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
                  className={`relative max-w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition cursor-pointer sm:px-4 ${
                    activeCluster === tab.id ? 'text-[#FFFFFF]' : 'text-[#FECDD3] hover:text-[#FFFFFF]'
                  }`}
                >
                  {activeCluster === tab.id && (
                    <motion.span
                      layoutId="cluster-tab"
                      className="absolute inset-0 rounded-lg bg-[#D4AF37] border border-[#F4D67A] shadow-xs"
                    />
                  )}
                  <span className="relative z-10 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className={`font-mono text-[0.62rem] font-bold uppercase tracking-wider ${activeCluster === tab.id ? 'text-[#050505]' : 'text-[#F4D67A]'}`}>
                      {tab.cluster}
                    </span>
                    {tab.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab body */}
            <div className="p-4 sm:p-6">
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
                        <Textarea value={clusters.market.problem} onChange={(e) => setClusterField('market', 'problem', e.target.value)} className="min-h-[90px]" />
                      </Field>
                      <Field label="Specific pain point">
                        <Textarea value={clusters.market.pain} onChange={(e) => setClusterField('market', 'pain', e.target.value)} className="min-h-[90px]" />
                      </Field>
                      <Field label="Willingness-to-pay signals">
                        <Input value={clusters.market.wtp} onChange={(e) => setClusterField('market', 'wtp', e.target.value)} />
                      </Field>
                      <Field label="Ideal customer profile">
                        <Input value={clusters.market.icp} onChange={(e) => setClusterField('market', 'icp', e.target.value)} />
                      </Field>
                    </>
                  )}
                  {activeCluster === 'viability' && (
                    <>
                      <Field label="Revenue model"><Input value={clusters.viability.revenue} onChange={(e) => setClusterField('viability', 'revenue', e.target.value)} /></Field>
                      <Field label="Unit economics (gross margin)"><Input value={clusters.viability.margin} onChange={(e) => setClusterField('viability', 'margin', e.target.value)} /></Field>
                      <Field label="Key costs"><Input value={clusters.viability.costs} onChange={(e) => setClusterField('viability', 'costs', e.target.value)} /></Field>
                      <Field label="Break-even timeline"><Input value={clusters.viability.breakeven} onChange={(e) => setClusterField('viability', 'breakeven', e.target.value)} /></Field>
                    </>
                  )}
                  {activeCluster === 'launch' && (
                    <>
                      <Field label="Launch geography"><Input value={clusters.launch.geography} onChange={(e) => setClusterField('launch', 'geography', e.target.value)} /></Field>
                      <Field label="Go-to-market motion"><Input value={clusters.launch.gtm} onChange={(e) => setClusterField('launch', 'gtm', e.target.value)} /></Field>
                      <Field label="Key milestones (12mo)"><Textarea value={clusters.launch.milestones} onChange={(e) => setClusterField('launch', 'milestones', e.target.value)} className="min-h-[70px]" /></Field>
                      <Field label="Funding ask"><Input value={clusters.launch.ask} onChange={(e) => setClusterField('launch', 'ask', e.target.value)} /></Field>
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
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition duration-200 cursor-pointer sm:p-5 ${
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
          <GlassPanel className="p-4 sm:p-6 border-[rgba(212,175,55,0.25)] bg-[#111111]">
            <div className="flex items-center gap-2">
              <Zap size={16} className="shrink-0 text-[#D4AF37]" />
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
          className="btn-royal-red flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl px-4 py-3.5 text-sm font-bold shadow-lg cursor-pointer sm:px-6 sm:py-4 sm:text-base"
        >
          <Sparkles size={18} className="shrink-0" /> Generate Report
          <span className="ml-0 rounded-full bg-[#050505]/40 px-2 py-0.5 font-mono text-xs text-[#050505] sm:ml-2">
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
  const [openCard, setOpenCard] = useState(null);
  const cards =
    vertical?.id === 'students'
      ? [
          { icon: GraduationCap, title: 'Academic Counseling', desc: '1:1 mentorship plans, course trajectories & research direction.',
            steps: ['Baseline aptitude & interest mapping', 'Course trajectory plan per semester', 'Quarterly advisor review checkpoints'] },
          { icon: ClipboardList, title: 'Research Mentorship', desc: 'Pair scholars with domain guides; track thesis milestones.',
            steps: ['Domain guide matching', 'Thesis milestone calendar', 'Publication readiness review'] },
          { icon: Target, title: 'Project Management', desc: 'Scoped deliverables, deadlines & advisor reviews.',
            steps: ['Deliverable scoping & sign-off', 'Deadline tracking board', 'Advisor review gates'] },
        ]
      : [
          { icon: FileText, title: 'Curriculum Development', desc: 'Design outcomes-aligned curricula across departments.',
            steps: ['Learning-outcome mapping', 'Departmental gap analysis', 'Accreditation alignment pass'] },
          { icon: Users, title: 'Faculty Training', desc: 'Upskill faculty with tracked competency modules.',
            steps: ['Competency baseline survey', 'Module assignment & tracking', 'Post-training impact scoring'] },
          { icon: Building2, title: 'Organizational Diagnosis', desc: 'Audit institutional health across stakeholders.',
            steps: ['Multi-stakeholder interviews', 'Process bottleneck audit', 'Institutional health scorecard'] },
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
          const open = openCard === c.title;
          return (
            <GlassPanel key={c.title} className="group p-4 transition hover:border-[#D4AF37] bg-[#111111] text-white border-[rgba(212,175,55,0.18)] sm:p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(212,175,55,0.3)] bg-[#0E0E0E] text-[#D4AF37]">
                <CIcon className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <h4 className="mt-4 font-sans text-lg font-bold text-[#FFFFFF]">{c.title}</h4>
              <p className="mt-1 text-sm text-[#CFCFCF]">{c.desc}</p>
              <button
                onClick={() => setOpenCard(open ? null : c.title)}
                className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#F4D67A] transition hover:gap-2 cursor-pointer"
              >
                {open ? 'Collapse' : 'Explore'}
                <ChevronRight size={13} className={`transition ${open ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-3 space-y-1.5 border-t border-[rgba(212,175,55,0.18)] pt-3">
                      {c.steps.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-xs text-[#CFCFCF]">
                          <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
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
function KanbanBoard({ reports, totalCount, search, columns, moveReport, expandedReport, setExpandedReport, onGenerate }) {
  // Serialize a published report to a JSON file the browser downloads locally.
  const downloadArtifact = (report) => {
    const payload = {
      report: report.name,
      vertical: report.vertical,
      status: report.status,
      orbitalScore: report.score,
      tags: report.tags,
      ...(report.brief ? { brief: report.brief } : {}),
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-orbital-report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

      {search && (
        <div className="flex items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.25)] bg-[#0E0E0E] px-4 py-2.5">
          <Search size={13} className="text-[#D4AF37]" />
          <span className="font-mono text-xs text-[#CFCFCF]">
            Showing <strong className="text-[#F4D67A]">{reports.length}</strong> of {totalCount} reports matching
            <strong className="text-[#FFFFFF]"> “{search}”</strong>
          </span>
        </div>
      )}

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
                      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1.5">
                        <h5 className="min-w-0 font-sans text-base font-bold leading-snug text-[#FFFFFF]">{r.name}</h5>
                        <StatusBadge status={r.status} className="shrink-0" />
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
                              <button
                                onClick={() => downloadArtifact(r)}
                                className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#D4AF37] bg-[#D4AF37] py-2 font-mono text-xs font-bold text-[#050505] transition hover:bg-[#F4D67A] cursor-pointer"
                              >
                                <Download size={13} /> Download Artifact
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Mover controls — `hover-reveal` keeps these visible on
                          touch devices, where `group-hover` never fires. */}
                      <div className="hover-reveal mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 opacity-0 transition group-hover:opacity-100">
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
function GenerateReportModal({ onClose, onConfirm, loading, vertical, company, moduleCount }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1A0108]/75 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-[rgba(212,175,55,0.25)] bg-[#111111] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between gap-3 border-b border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] px-4 py-4 sm:px-6">
          <div className="relative flex min-w-0 items-center gap-2">
            <Crown className="h-5 w-5 shrink-0 text-[#D4AF37]" />
            <h3 className="font-sans text-base font-bold text-[#FFFFFF] sm:text-lg">Generate AI Strategy Report</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="shrink-0 rounded-lg p-1 text-[#CFCFCF] transition hover:bg-[#050505] hover:text-[#FFFFFF] cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-6 sm:px-6">
          <p className="text-sm text-[#CFCFCF] leading-relaxed">
            Compose a new report for <strong className="text-[#F4D67A]">{company?.trim() || 'Untitled Venture'}</strong> in
            the <strong className="text-[#F4D67A]">{vertical?.name}</strong> vertical, synthesizing
            {' '}<strong className="text-[#FFFFFF]">{moduleCount}</strong> selected module{moduleCount === 1 ? '' : 's'}.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: Layers, label: 'Intake' },
              { icon: Sparkles, label: 'Synthesize' },
              { icon: Download, label: 'Deliver' },
            ].map((step, i) => (
              <div key={step.label} className="rounded-xl border border-[rgba(212,175,55,0.18)] bg-[#050505] p-2.5 sm:p-3">
                <step.icon size={16} className="mx-auto text-[#D4AF37]" />
                <p className="mt-1.5 font-mono text-[0.6rem] text-[#CFCFCF] sm:text-[0.68rem]">{i + 1}. {step.label}</p>
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
        <div className="flex flex-wrap justify-end gap-2.5 border-t border-[rgba(212,175,55,0.18)] bg-[#0E0E0E] px-4 py-4 sm:gap-3 sm:px-6">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <RoyalButton onClick={onConfirm} disabled={loading}>
            <Sparkles size={15} className="shrink-0" /> {loading ? 'Generating…' : 'Confirm & Generate'}
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

