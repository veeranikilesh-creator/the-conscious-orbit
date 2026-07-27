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

const EMPTY_PROFILE = {
  company: '',
  industry: '',
  stage: 'Seed',
  geography: '',
  model: 'B2B Enterprise',
  contact: '',
};

const EMPTY_CLUSTERS = {
  market: { problem: '', pain: '', wtp: '', icp: '' },
  viability: { revenue: '', margin: '', costs: '', breakeven: '' },
  launch: { geography: '', gtm: '', milestones: '', ask: '' },
};

const SAMPLE_ECOFLY_PROFILE = {
  company: 'EcoFly Robotics',
  industry: 'Medical Logistics & Drones',
  stage: 'Seed',
  geography: 'Bengaluru, IN',
  model: 'B2B Enterprise',
  contact: 'founder@ecofly.io',
};

const SAMPLE_ECOFLY_CLUSTERS = {
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
  const [viewingReport, setViewingReport] = useState(null);
  const [mainView, setMainView] = useState('pipeline'); // 'pipeline' | 'intake' | 'board'
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(null);

  // Controlled intake state — default to clean empty profile.
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [clusters, setClusters] = useState(EMPTY_CLUSTERS);

  const genTimer = useRef(null);
  useEffect(() => () => clearTimeout(genTimer.current), []);

  const setProfileField = (key, value) => setProfile((p) => ({ ...p, [key]: value }));
  const setClusterField = (cluster, key, value) =>
    setClusters((c) => ({ ...c, [cluster]: { ...c[cluster], [key]: value } }));

  const handleResetForm = () => {
    setProfile(EMPTY_PROFILE);
    setClusters(EMPTY_CLUSTERS);
  };

  const handleLoadSample = () => {
    setProfile(SAMPLE_ECOFLY_PROFILE);
    setClusters(SAMPLE_ECOFLY_CLUSTERS);
  };

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
    const newVentureName = profile.company.trim() || 'New Strategic Venture';
    const userIndustry = profile.industry.trim() || 'General Business & Technology';
    const userModel = profile.model.trim() || 'B2B Enterprise';

    setIsGenerating(true);
    genTimer.current = setTimeout(() => {
      const trackNames = FLAGSHIP_TRACKS
        .filter((t) => selectedTracks.includes(t.id))
        .map((t) => t.name.replace(/ Track$/, ''));
      const tags = [userIndustry, userModel, ...trackNames, ...customPicks]
        .filter(Boolean)
        .slice(0, 4);

      // Deep AI Industry Analysis for any typed Industry & Customer Type
      const isConsumer = /b2c|d2c|consumer|retail|p2p|b2b2c/i.test(userModel);
      const isGovt = /b2g|govt|government|public/i.test(userModel);

      const dynamicProblem = clusters.market.problem.trim() ||
        `Operational inefficiencies, manual friction, and scaling bottlenecks in the ${userIndustry} industry.`;

      const dynamicPain = clusters.market.pain.trim() ||
        `Current solutions in ${userIndustry} are fragmented, costly, and fail to scale for target customer needs.`;

      const dynamicICP = clusters.market.icp.trim() || (isGovt
        ? `Government departments, public sector units & municipal networks in ${userIndustry}.`
        : isConsumer
        ? `Target consumer demographics and digital buyers seeking ${userIndustry} offerings.`
        : `Mid-market & Enterprise decision makers operating across ${userIndustry}.`);

      const dynamicWTP = clusters.market.wtp.trim() || (isConsumer
        ? `$19 - $149 monthly subscription / transaction fee`
        : `$1,000 - $15,000 / month recurring enterprise license`);

      const dynamicRevenue = clusters.viability.revenue.trim() || (isConsumer
        ? `Direct-to-Consumer (D2C) Sales + Tiered Premium Subscriptions`
        : `Annual Recurring Revenue (ARR) + High-Margin SLA Retainers`);

      const dynamicGTM = clusters.launch.gtm.trim() || (isConsumer
        ? `Performance Marketing + Creator Amplification + Product-Led Growth (PLG)`
        : `Direct Executive Outbound + Account-Based Marketing (ABM) + Strategic Distribution`);

      const calculatedScore = Math.floor(Math.random() * 14) + 79; // 79-92 score

      const newReportObj = {
        id: `r${Date.now()}`,
        name: newVentureName,
        vertical: activeVertical,
        tags: [userIndustry, userModel, ...trackNames, ...customPicks].filter(Boolean).slice(0, 4),
        status: 'PUBLISHED',
        score: calculatedScore,
        metrics: [
          { k: 'Market Demand', v: Math.floor(Math.random() * 10) + 85 },
          { k: 'Tech Feasibility', v: Math.floor(Math.random() * 15) + 75 },
          { k: 'Unit Economics', v: Math.floor(Math.random() * 10) + 84 },
        ],
        brief: {
          company: newVentureName,
          industry: userIndustry,
          stage: profile.stage || 'Seed',
          geography: profile.geography || 'Global',
          contact: profile.contact || 'founder@venture.io',
          model: userModel,
          problem: dynamicProblem,
          pain: dynamicPain,
          wtp: dynamicWTP,
          icp: dynamicICP,
          revenue: dynamicRevenue,
          margin: clusters.viability.margin || '65% gross margin target',
          costs: clusters.viability.costs || `Core ${userIndustry} infrastructure, R&D, operations, and talent`,
          breakeven: clusters.viability.breakeven || '18 months',
          gtm: dynamicGTM,
          milestones: clusters.launch.milestones || `Product Launch -> 10 Pilot ${userIndustry} Accounts -> Scaled Expansion`,
          ask: clusters.launch.ask || '$1.2M Seed',
          modules: selectedTracks.length + customPicks.length,
          tracksSelected: trackNames,
          customModules: customPicks,
        },
      };

      setReports((prev) => [newReportObj, ...prev]);
      setIsGenerating(false);
      setIsGenModalOpen(false);
      setMainView('board');
      setViewingReport(newReportObj);
      setNotice(`Industry analysis report ready for ${newVentureName}`);
      handleResetForm();
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

        <div className="flex-1 mx-auto w-full max-w-7xl space-y-12 px-6 py-8 md:px-10">
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
              <div className="space-y-10">
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
                  onResetForm={handleResetForm}
                  onLoadSample={handleLoadSample}
                />
                <div className="mt-10 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[rgba(212,175,55,0.12)]" />
                  <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                    {activeVerticalObj?.name || 'Domain'} Specialized Engine
                  </span>
                  <div className="h-px flex-1 bg-[rgba(212,175,55,0.12)]" />
                </div>
                {activeVertical === 'startups' && <StartupMarketEngine />}
                {activeVertical === 'msmes' && <MsmeOptimizationEngine />}
                {activeVertical === 'industries' && <IndustryAnalysisEngine />}
                {(activeVertical === 'students' || activeVertical === 'institutions') && (
                  <GenericVerticalPanel vertical={activeVerticalObj} />
                )}
              </div>
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
                onViewReport={(r) => setViewingReport(r)}
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
        {viewingReport && (
          <ViewReportModal
            report={viewingReport}
            onClose={() => setViewingReport(null)}
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
              onClick={onDismissNotice}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[#050505] text-[#CFCFCF] hover:border-[#D4AF37] hover:text-[#D4AF37] transition cursor-pointer"
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
                  className="absolute right-0 top-10 z-50 w-60 rounded-xl border border-[rgba(212,175,55,0.3)] bg-[#111111] p-3 shadow-xl"
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
            <GhostButton onClick={() => setBriefOpen((o) => !o)} className="text-xs py-2 px-4">
              <FileText size={13} /> Strategy Brief
              <ChevronDown size={12} className={`transition ${briefOpen ? 'rotate-180' : ''}`} />
            </GhostButton>

            {/* Primary CTA Button */}
            <RoyalButton onClick={onOpenGenerate} className="text-xs font-bold py-2 px-5">
              <Sparkles size={13} /> Run AI Analysis
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
  onResetForm,
  onLoadSample,
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
        <div className="flex items-center justify-between flex-wrap gap-2">
          <LayerBadge n={1} title="Client Profile" hint="Captured once at signup" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetForm}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(212,175,55,0.25)] bg-[#0E0E0E] px-3 py-1.5 font-mono text-xs font-semibold text-[#F4D67A] hover:bg-[#D4AF37] hover:text-[#050505] transition cursor-pointer"
            >
              <Plus size={13} /> New Venture (Clear Form)
            </button>
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(212,175,55,0.18)] bg-[#050505] px-3 py-1.5 font-mono text-xs font-semibold text-[#CFCFCF] hover:text-[#FFFFFF] transition cursor-pointer"
            >
              <Sparkles size={13} className="text-[#D4AF37]" /> Load EcoFly Sample
            </button>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <GlassPanel className="p-6 border-[#D4AF37]/50 bg-[#3B0413]/85 text-white">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Company Name">
                <Input
                  value={profile.company}
                  onChange={(e) => setProfileField('company', e.target.value)}
                  placeholder="Enter your venture name..."
                />
              </Field>
              <Field label="Industry / Sector (Type Any)">
                <Input
                  value={profile.industry}
                  onChange={(e) => setProfileField('industry', e.target.value)}
                  placeholder="e.g. AI Robotics, CleanTech, SpaceTech, BioPharma, Logistics..."
                />
              </Field>
              <Field label="Stage">
                <Input
                  value={profile.stage}
                  onChange={(e) => setProfileField('stage', e.target.value)}
                  placeholder="e.g. Seed, Pre-Seed, Series A, Idea, Growth..."
                />
              </Field>
              <Field label="Geography">
                <Input value={profile.geography} onChange={(e) => setProfileField('geography', e.target.value)} placeholder="e.g. Bengaluru, IN / Global" />
              </Field>
              <Field label="Customer Type / Business Model (Type Any)">
                <Input
                  value={profile.model}
                  onChange={(e) => setProfileField('model', e.target.value)}
                  placeholder="e.g. B2B Enterprise, B2C D2C, B2G Government, Marketplace..."
                />
              </Field>
              <Field label="Contact Info">
                <Input value={profile.contact} onChange={(e) => setProfileField('contact', e.target.value)} placeholder="founder@venture.io" />
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
            <GlassPanel key={c.title} className="group p-5 transition hover:border-[#D4AF37] bg-[#111111] text-white border-[rgba(212,175,55,0.18)]">
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
function KanbanBoard({ reports, totalCount, search, columns, moveReport, expandedReport, setExpandedReport, onViewReport, onGenerate }) {
  // Export executive strategy report to DOC format (.doc)
  const downloadArtifact = (report) => {
    if (!report) return;
    const brief = report.brief || {};
    const title = report.name || 'Executive Strategy Report';
    const score = report.score || 85;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title} - Executive Strategy Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; line-height: 1.6; padding: 25px; }
          .header { border-bottom: 3px solid #D4AF37; padding-bottom: 15px; margin-bottom: 25px; }
          .brand { font-size: 11pt; color: #D4AF37; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
          .title { font-size: 24pt; font-weight: bold; color: #050505; margin: 8px 0 4px 0; }
          .meta { color: #666; font-size: 10pt; margin: 0; }
          .score-card { background: #FCF8EC; border: 2px solid #D4AF37; padding: 18px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .score-title { font-size: 10pt; color: #856404; text-transform: uppercase; font-weight: bold; }
          .score-num { font-size: 34pt; font-weight: bold; color: #D4AF37; margin: 4px 0; }
          .score-badge { font-size: 10pt; color: #155724; font-weight: bold; background: #d4edda; padding: 3px 10px; border-radius: 12px; display: inline-block; }
          .section-heading { font-size: 14pt; font-weight: bold; color: #050505; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; margin-top: 28px; margin-bottom: 12px; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 16px; }
          th { background: #0E0E0E; color: #D4AF37; text-align: left; padding: 10px; font-size: 10pt; text-transform: uppercase; }
          td { border: 1px solid #E2E8F0; padding: 10px; font-size: 10pt; vertical-align: top; background: #FFFFFF; }
          .label { font-weight: bold; color: #333333; width: 32%; background: #F8FAFC; }
          .footer { margin-top: 40px; border-top: 1px solid #CBD5E1; padding-top: 12px; font-size: 9pt; color: #64748B; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">The Conscious Orbit · Venture Intelligence Suite</div>
          <h1 class="title">${title}</h1>
          <p class="meta">Vertical: <strong>${(report.vertical || 'Startup').toUpperCase()}</strong> | Date: <strong>${date}</strong> | Status: <strong>${report.status}</strong></p>
        </div>

        <div class="score-card">
          <div class="score-title">Conscious Orbital Score</div>
          <div class="score-num">${score} / 100</div>
          <div class="score-badge">✔ High Commercial & Execution Viability</div>
        </div>

        <div class="section-heading">1. Executive & Venture Profile</div>
        <table>
          <tr><td class="label">Company / Venture Name</td><td>${brief.company || title}</td></tr>
          <tr><td class="label">Industry & Sector</td><td>${brief.industry || report.tags?.[0] || 'Technology'}</td></tr>
          <tr><td class="label">Venture Stage</td><td>${brief.stage || 'Seed'}</td></tr>
          <tr><td class="label">Business Model</td><td>${brief.model || 'B2B'}</td></tr>
          <tr><td class="label">Geographic Target</td><td>${brief.geography || 'Global'}</td></tr>
          <tr><td class="label">Founder Contact</td><td>${brief.contact || 'founder@venture.io'}</td></tr>
          <tr><td class="label">Capital Ask</td><td><strong>${brief.ask || '$1.2M Seed'}</strong></td></tr>
        </table>

        <div class="section-heading">2. Market Opportunity & Problem Validation</div>
        <table>
          <tr><td class="label">Core Market Problem</td><td>${brief.problem || 'Significant operational friction and market inefficiencies.'}</td></tr>
          <tr><td class="label">Customer Pain Point</td><td>${brief.pain || 'Current industry solutions are costly, slow, and fragmented.'}</td></tr>
          <tr><td class="label">Ideal Customer Profile (ICP)</td><td>${brief.icp || 'Mid-market to Enterprise Organizations'}</td></tr>
          <tr><td class="label">Willingness to Pay (WTP)</td><td>${brief.wtp || '$25 per delivery / seat'}</td></tr>
        </table>

        <div class="section-heading">3. Business Economics & Viability</div>
        <table>
          <tr><td class="label">Revenue Model</td><td>${brief.revenue || 'Recurring Subscription + Retainer'}</td></tr>
          <tr><td class="label">Gross Margin Target</td><td>${brief.margin || '65% Target Gross Margin'}</td></tr>
          <tr><td class="label">Key Cost Drivers</td><td>${brief.costs || 'Infrastructure, Operations, Regulatory Compliance'}</td></tr>
          <tr><td class="label">Breakeven Horizon</td><td>${brief.breakeven || '18 Months'}</td></tr>
        </table>

        <div class="section-heading">4. Launch & Go-To-Market Strategy</div>
        <table>
          <tr><td class="label">GTM Strategy</td><td>${brief.gtm || 'Direct enterprise sales + Strategic distribution partners'}</td></tr>
          <tr><td class="label">Growth Milestones</td><td>${brief.milestones || 'Product Launch -> 10 Pilot Customers -> Scaled Expansion'}</td></tr>
        </table>

        <div class="footer">
          Generated automatically by <strong>The Conscious Orbit — Executive Strategy Engine</strong><br/>
          Confidential Executive Report &copy; ${new Date().getFullYear()}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-strategy-report.doc`;
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
                      {r.score > 0 && (
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

                      {/* Quick Action: View Executive Report */}
                      <button
                        onClick={() => onViewReport?.(r)}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[rgba(212,175,55,0.3)] bg-[#050505] py-2 font-mono text-xs font-bold text-[#F4D67A] transition hover:bg-[#D4AF37] hover:text-[#050505] cursor-pointer"
                      >
                        <FileText size={13} /> View Strategy Report
                      </button>

                      <AnimatePresence>
                        {expandedReport === r.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 space-y-2 rounded-lg border border-[rgba(212,175,55,0.2)] bg-[#050505] p-3">
                              {(r.metrics || [
                                { k: 'Market Demand', v: 88 },
                                { k: 'Tech Feasibility', v: 72 },
                                { k: 'Unit Economics', v: 90 },
                              ]).map((m) => (
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
                                <Download size={13} /> Download Strategy Report (.DOC)
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
function GenerateReportModal({ onClose, onConfirm, loading, vertical, company, moduleCount }) {
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

/* ============================================================
   VIEW REPORT DETAIL MODAL
   ============================================================ */
function ViewReportModal({ report, onClose }) {
  if (!report) return null;
  const brief = report.brief || {};

  const handleDownload = () => {
    const title = report.name || 'Executive Strategy Report';
    const score = report.score || 85;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title} - Executive Strategy Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; line-height: 1.6; padding: 25px; }
          .header { border-bottom: 3px solid #D4AF37; padding-bottom: 15px; margin-bottom: 25px; }
          .brand { font-size: 11pt; color: #D4AF37; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
          .title { font-size: 24pt; font-weight: bold; color: #050505; margin: 8px 0 4px 0; }
          .meta { color: #666; font-size: 10pt; margin: 0; }
          .score-card { background: #FCF8EC; border: 2px solid #D4AF37; padding: 18px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .score-title { font-size: 10pt; color: #856404; text-transform: uppercase; font-weight: bold; }
          .score-num { font-size: 34pt; font-weight: bold; color: #D4AF37; margin: 4px 0; }
          .score-badge { font-size: 10pt; color: #155724; font-weight: bold; background: #d4edda; padding: 3px 10px; border-radius: 12px; display: inline-block; }
          .section-heading { font-size: 14pt; font-weight: bold; color: #050505; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; margin-top: 28px; margin-bottom: 12px; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 16px; }
          th { background: #0E0E0E; color: #D4AF37; text-align: left; padding: 10px; font-size: 10pt; text-transform: uppercase; }
          td { border: 1px solid #E2E8F0; padding: 10px; font-size: 10pt; vertical-align: top; background: #FFFFFF; }
          .label { font-weight: bold; color: #333333; width: 32%; background: #F8FAFC; }
          .footer { margin-top: 40px; border-top: 1px solid #CBD5E1; padding-top: 12px; font-size: 9pt; color: #64748B; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">The Conscious Orbit · Venture Intelligence Suite</div>
          <h1 class="title">${title}</h1>
          <p class="meta">Vertical: <strong>${(report.vertical || 'Startup').toUpperCase()}</strong> | Date: <strong>${date}</strong> | Status: <strong>${report.status}</strong></p>
        </div>

        <div class="score-card">
          <div class="score-title">Conscious Orbital Score</div>
          <div class="score-num">${score} / 100</div>
          <div class="score-badge">✔ High Commercial & Execution Viability</div>
        </div>

        <div class="section-heading">1. Executive & Venture Profile</div>
        <table>
          <tr><td class="label">Company / Venture Name</td><td>${brief.company || title}</td></tr>
          <tr><td class="label">Industry & Sector</td><td>${brief.industry || report.tags?.[0] || 'Technology'}</td></tr>
          <tr><td class="label">Venture Stage</td><td>${brief.stage || 'Seed'}</td></tr>
          <tr><td class="label">Business Model</td><td>${brief.model || 'B2B'}</td></tr>
          <tr><td class="label">Geographic Target</td><td>${brief.geography || 'Global'}</td></tr>
          <tr><td class="label">Founder Contact</td><td>${brief.contact || 'founder@venture.io'}</td></tr>
          <tr><td class="label">Capital Ask</td><td><strong>${brief.ask || '$1.2M Seed'}</strong></td></tr>
        </table>

        <div class="section-heading">2. Market Opportunity & Problem Validation</div>
        <table>
          <tr><td class="label">Core Market Problem</td><td>${brief.problem || 'Significant operational friction and market inefficiencies.'}</td></tr>
          <tr><td class="label">Customer Pain Point</td><td>${brief.pain || 'Current industry solutions are costly, slow, and fragmented.'}</td></tr>
          <tr><td class="label">Ideal Customer Profile (ICP)</td><td>${brief.icp || 'Mid-market to Enterprise Organizations'}</td></tr>
          <tr><td class="label">Willingness to Pay (WTP)</td><td>${brief.wtp || '$25 per delivery / seat'}</td></tr>
        </table>

        <div class="section-heading">3. Business Economics & Viability</div>
        <table>
          <tr><td class="label">Revenue Model</td><td>${brief.revenue || 'Recurring Subscription + Retainer'}</td></tr>
          <tr><td class="label">Gross Margin Target</td><td>${brief.margin || '65% Target Gross Margin'}</td></tr>
          <tr><td class="label">Key Cost Drivers</td><td>${brief.costs || 'Infrastructure, Operations, Regulatory Compliance'}</td></tr>
          <tr><td class="label">Breakeven Horizon</td><td>${brief.breakeven || '18 Months'}</td></tr>
        </table>

        <div class="section-heading">4. Launch & Go-To-Market Strategy</div>
        <table>
          <tr><td class="label">GTM Strategy</td><td>${brief.gtm || 'Direct enterprise sales + Strategic distribution partners'}</td></tr>
          <tr><td class="label">Growth Milestones</td><td>${brief.milestones || 'Product Launch -> 10 Pilot Customers -> Scaled Expansion'}</td></tr>
        </table>

        <div class="footer">
          Generated automatically by <strong>The Conscious Orbit — Executive Strategy Engine</strong><br/>
          Confidential Executive Report &copy; ${new Date().getFullYear()}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-strategy-report.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/85 p-4 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="my-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-[#D4AF37]/40 bg-[#0E0E0E] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(212,175,55,0.2)] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#F4D67A] uppercase tracking-wider">{report.vertical || 'Startup'} Vertical</span>
                <StatusBadge status={report.status} />
              </div>
              <h2 className="font-sans text-2xl font-bold text-[#FFFFFF]">{report.name}</h2>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-[#CFCFCF] hover:bg-[#050505] hover:text-white transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Report Content Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6 text-sm">
          {/* Executive Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[#050505] p-5">
            <div className="text-center md:border-r md:border-[rgba(212,175,55,0.15)] pr-4">
              <span className="font-mono text-[0.65rem] text-[#9A9A9A] uppercase tracking-wider">Conscious Orbital Score</span>
              <p className="font-mono text-3xl font-extrabold text-[#F4D67A] mt-1">{report.score || 85}/100</p>
              <span className="inline-block mt-1 text-[0.65rem] font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">High Viability</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <p className="text-[#9A9A9A]">Industry: <strong className="text-[#FFFFFF]">{brief.industry || report.tags?.[0] || 'Tech'}</strong></p>
              <p className="text-[#9A9A9A]">Stage: <strong className="text-[#FFFFFF]">{brief.stage || 'Seed'}</strong></p>
              <p className="text-[#9A9A9A]">Model: <strong className="text-[#FFFFFF]">{brief.model || 'B2B'}</strong></p>
            </div>
            <div className="space-y-1.5 text-xs">
              <p className="text-[#9A9A9A]">Geography: <strong className="text-[#FFFFFF]">{brief.geography || 'Global'}</strong></p>
              <p className="text-[#9A9A9A]">Contact: <strong className="text-[#FFFFFF]">{brief.contact || 'founder@venture.io'}</strong></p>
              <p className="text-[#9A9A9A]">Capital Ask: <strong className="text-[#F4D67A] font-bold">{brief.ask || '$1.2M'}</strong></p>
            </div>
          </div>

          {/* Market & Problem Validation */}
          <div className="rounded-2xl border border-[rgba(212,175,55,0.15)] bg-[#111111] p-5 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F4D67A] flex items-center gap-2">
              <Target size={15} /> 1. Market Opportunity & Problem Statement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#0E0E0E] p-3.5 rounded-xl border border-[rgba(212,175,55,0.1)] space-y-1">
                <span className="font-mono text-[0.65rem] text-[#D4AF37] font-bold block">Core Problem</span>
                <p className="text-[#CFCFCF]">{brief.problem || 'Market inefficiency and high operational friction.'}</p>
              </div>
              <div className="bg-[#0E0E0E] p-3.5 rounded-xl border border-[rgba(212,175,55,0.1)] space-y-1">
                <span className="font-mono text-[0.65rem] text-[#D4AF37] font-bold block">Customer Pain Point</span>
                <p className="text-[#CFCFCF]">{brief.pain || 'Current alternatives are slow and expensive.'}</p>
              </div>
              <div className="bg-[#0E0E0E] p-3.5 rounded-xl border border-[rgba(212,175,55,0.1)] space-y-1">
                <span className="font-mono text-[0.65rem] text-[#D4AF37] font-bold block">Target ICP</span>
                <p className="text-[#CFCFCF]">{brief.icp || 'Mid-market to Enterprise Organizations'}</p>
              </div>
              <div className="bg-[#0E0E0E] p-3.5 rounded-xl border border-[rgba(212,175,55,0.1)] space-y-1">
                <span className="font-mono text-[0.65rem] text-[#D4AF37] font-bold block">Willingness to Pay</span>
                <p className="text-[#CFCFCF]">{brief.wtp || 'Subscription per seats/usage'}</p>
              </div>
            </div>
          </div>

          {/* Business Viability & Financial Economics */}
          <div className="rounded-2xl border border-[rgba(212,175,55,0.15)] bg-[#111111] p-5 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F4D67A] flex items-center gap-2">
              <DollarSign size={15} /> 2. Business Economics & Viability
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#0E0E0E] p-3.5 rounded-xl border border-[rgba(212,175,55,0.1)] space-y-1">
                <span className="font-mono text-[0.65rem] text-[#D4AF37] font-bold block">Revenue Model</span>
                <p className="text-[#CFCFCF]">{brief.revenue || 'Recurring Subscription + Performance retainer'}</p>
              </div>
              <div className="bg-[#0E0E0E] p-3.5 rounded-xl border border-[rgba(212,175,55,0.1)] space-y-1">
                <span className="font-mono text-[0.65rem] text-[#D4AF37] font-bold block">Gross Margin Target</span>
                <p className="text-[#CFCFCF]">{brief.margin || '65% target margin'}</p>
              </div>
              <div className="bg-[#0E0E0E] p-3.5 rounded-xl border border-[rgba(212,175,55,0.1)] space-y-1">
                <span className="font-mono text-[0.65rem] text-[#D4AF37] font-bold block">Key Cost Drivers</span>
                <p className="text-[#CFCFCF]">{brief.costs || 'Infrastructure, Talent, Regulatory Compliance'}</p>
              </div>
              <div className="bg-[#0E0E0E] p-3.5 rounded-xl border border-[rgba(212,175,55,0.1)] space-y-1">
                <span className="font-mono text-[0.65rem] text-[#D4AF37] font-bold block">Breakeven Horizon</span>
                <p className="text-[#CFCFCF]">{brief.breakeven || '18 Months'}</p>
              </div>
            </div>
          </div>

          {/* Go-To-Market & Execution Plan */}
          <div className="rounded-2xl border border-[rgba(212,175,55,0.15)] bg-[#111111] p-5 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F4D67A] flex items-center gap-2">
              <Zap size={15} /> 3. Launch & Go-To-Market Roadmap
            </h4>
            <div className="space-y-3 text-xs">
              <div className="bg-[#0E0E0E] p-3.5 rounded-xl border border-[rgba(212,175,55,0.1)] space-y-1">
                <span className="font-mono text-[0.65rem] text-[#D4AF37] font-bold block">GTM Channel Strategy</span>
                <p className="text-[#CFCFCF]">{brief.gtm || 'Direct enterprise sales combined with strategic distribution partners.'}</p>
              </div>
              <div className="bg-[#0E0E0E] p-3.5 rounded-xl border border-[rgba(212,175,55,0.1)] space-y-1">
                <span className="font-mono text-[0.65rem] text-[#D4AF37] font-bold block">Key Growth Milestones</span>
                <p className="text-[#CFCFCF]">{brief.milestones || 'Product Launch -> Beta Clients -> Scale Operations'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[rgba(212,175,55,0.2)] bg-[#111111] px-6 py-4">
          <GhostButton onClick={onClose}>Close</GhostButton>
          <RoyalButton onClick={handleDownload}>
            <Download size={15} /> Download Strategy Report (.DOC)
          </RoyalButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default App;

