import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { checkHealth, listReports, generateReportViaApi, getReport } from "../api.js";
import { downloadReportDoc } from "../reportDoc.js";
import { StartupMarketEngine, MsmeOptimizationEngine, IndustryAnalysisEngine } from "./VerticalEngines.jsx";
import {
  Search,
  Bell,
  LogOut,
  HelpCircle,
  Sparkles,
  Plus,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  TrendingUp,
  Target,
  ShieldAlert,
  DollarSign,
  Layers,
  Cpu,
  FileText,
  X,
  Building2,
  Filter,
  ArrowRight,
  PieChart,
  Activity,
  Check,
  MessageSquare,
  Folder,
  FolderPlus,
  Play,
  Clock,
  BarChart3,
  Zap,
  RotateCcw,
  Download
} from "lucide-react";

/* ============================================================
   10 INTELLIGENCE MODULES INITIAL SEED DATA
   ============================================================ */
const INITIAL_INTELLIGENCE_MODULES = [
  {
    id: "mod-1",
    code: "MOD-01",
    name: "Market Sizing & Whitespace",
    category: "Market Foundation",
    icon: Target,
    status: "COMPLETED",
    score: 88,
    desc: "TAM/SAM/SOM estimation, competitive whitespace mapping, and structural market sizing.",
    lastUpdated: "2 hours ago",
    project: "EcoFly Medical Drones"
  },
  {
    id: "mod-2",
    code: "MOD-02",
    name: "Competitor Intelligence",
    category: "Market Foundation",
    icon: Layers,
    status: "COMPLETED",
    score: 92,
    desc: "Feature teardowns, pricing models, positioning matrices, and defensibility moats.",
    lastUpdated: "4 hours ago",
    project: "Apex AI Recruiter"
  },
  {
    id: "mod-3",
    code: "MOD-03",
    name: "Financial Viability & Unit Economics",
    category: "Business Viability",
    icon: DollarSign,
    status: "IN_PROGRESS",
    score: 76,
    desc: "CAC, LTV, payback period, gross margin modeling, and break-even trajectory.",
    lastUpdated: "Just now",
    project: "GreenPack Biodegradable"
  },
  {
    id: "mod-4",
    code: "MOD-04",
    name: "Go-To-Market Strategy",
    category: "Launch & Execution",
    icon: TrendingUp,
    status: "COMPLETED",
    score: 85,
    desc: "Channel selection, sales cycle optimization, partner ecosystems, and early traction engines.",
    lastUpdated: "1 day ago",
    project: "EcoFly Medical Drones"
  },
  {
    id: "mod-5",
    code: "MOD-05",
    name: "Risk & Vulnerability Audit",
    category: "Business Viability",
    icon: ShieldAlert,
    status: "IN_PROGRESS",
    score: 64,
    desc: "Single points of failure, supply chain exposure, key-person dependencies, and regulatory risks.",
    lastUpdated: "3 hours ago",
    project: "Nimbus Cloud Audit"
  },
  {
    id: "mod-6",
    code: "MOD-06",
    name: "Customer Persona & Demand Signal",
    category: "Market Foundation",
    icon: Activity,
    status: "COMPLETED",
    score: 90,
    desc: "Problem severity validation, willingness-to-pay signals, and user journey bottlenecks.",
    lastUpdated: "Yesterday",
    project: "Helix Pharma Ops"
  },
  {
    id: "mod-7",
    code: "MOD-07",
    name: "Regulatory & Compliance Framework",
    category: "Business Viability",
    icon: Building2,
    status: "PENDING",
    score: 45,
    desc: "ISO, GDPR, HIPAA, and industry-specific compliance requirements audit.",
    lastUpdated: "Queued",
    project: "Verdant Agri-Tech"
  },
  {
    id: "mod-8",
    code: "MOD-08",
    name: "Technology Architecture Audit",
    category: "Launch & Execution",
    icon: Cpu,
    status: "COMPLETED",
    score: 95,
    desc: "System scalability, tech stack vulnerability, maintenance debt, and IP audit.",
    lastUpdated: "2 days ago",
    project: "Apex AI Recruiter"
  },
  {
    id: "mod-9",
    code: "MOD-09",
    name: "Operations & Supply Bottlenecks",
    category: "Launch & Execution",
    icon: PieChart,
    status: "IN_PROGRESS",
    score: 82,
    desc: "Process latency, fulfillment overheads, vendor SLA analysis, and operational yield.",
    lastUpdated: "5 hours ago",
    project: "Helix Pharma Ops"
  },
  {
    id: "mod-10",
    code: "MOD-10",
    name: "Executive Verdict & Scorecard",
    category: "Executive Governance",
    icon: Sparkles,
    status: "COMPLETED",
    score: 89,
    desc: "Synthesized binary GO/NO-GO recommendation, capital deployment verdict, and board summary.",
    lastUpdated: "1 hour ago",
    project: "EcoFly Medical Drones"
  }
];

/* ============================================================
   INITIAL CLIENT PROJECTS SEED DATA
   ============================================================ */
/* ---- Backend bridge ------------------------------------------------------
   The server's report shape ({ id, name, vertical, tags, status, score,
   decision, completedModules, clusters }) maps onto this dashboard's project
   cards. When no API is reachable the seeds below stay and every action keeps
   its original simulation, so the UI is unchanged offline. */

/** Server module keys in MOD-01…MOD-10 order, for scoring the module cards. */
const MODULE_KEY_ORDER = [
  "customerDiscovery", "profiling", "marketSize", "feasibility", "pricing",
  "marketResearch", "industryReport", "businessModelValidation", "gtm", "okr",
];

/** This form's stage labels → the Client model's STAGES enum. */
const STAGE_TO_SERVER = {
  "Idea & Problem Validation": "Idea",
  "Early Stage / Seed": "Seed",
  "Early Traction / Series A": "Series A",
  "Growth & Expansion": "Growth",
};

function projectFromReport(r) {
  const score = r.score ?? 0;
  const verdict =
    r.decision === 0 ? `PIVOT (${score}%)`
    : r.decision === 1 ? `GO (${score}%)`
    : score > 0 ? `CONDITIONAL (${score}%)`
    : "IN PIPELINE";
  return {
    id: r.id,
    title: r.name,
    industry: r.tags?.[0] || r.vertical,
    verdict,
    status: r.status === "PUBLISHED" ? "ACTIVE" : "UNDER_REVIEW",
    modulesProcessed: `${(r.completedModules || []).length}/10`,
    date: (r.createdAt || new Date().toISOString()).split("T")[0],
    description: r.clusters?.market?.problem || "Venture evaluated through the intelligence pipeline.",
    fromApi: true,
  };
}

/* ---- New Project requirements wizard ------------------------------------
   Five steps that collect the actual inputs the ten calculators score on.
   Every field except the name is optional — blanks fall back to the
   documented defaults inside buildModuleInputs(), so a quick submission
   still runs; the more that is answered, the more the score is the user's
   own business rather than the placeholders'. */

const EMPTY_PROJECT_FORM = {
  startupName: "",
  sector: "Healthcare & Logistics",
  stage: "Early Stage / Seed",
  businessModel: "B2B Enterprise",
  geography: "",
  contact: "",
  description: "",
  // Market problem (report section 2)
  painPoint: "",
  icp: "",
  wtpText: "",
  // Business economics (report section 3)
  revenueModel: "",
  grossMargin: "",
  costDrivers: "",
  // Launch & GTM (report section 4)
  gtmStrategy: "",
  milestones: "",
  // Customer reach (MOD-01)
  consumerCommunication: true,
  reachableConsumers: "",
  interviewsCompleted: "",
  weeklyInteractions: "",
  // Market size (MOD-03)
  tam: "",
  samPercent: "",
  conversionRate: "",
  // Feasibility self-rating (MOD-04)
  technical: 70,
  operational: 70,
  financial: 70,
  regulatory: 70,
  teamCapability: 70,
  // Pricing & investment (MOD-05 / MOD-08 / MOD-09)
  ourPrice: "",
  competitorLowPrice: "",
  competitorHighPrice: "",
  capitalRequired: "",
  monthsToBreakEven: "",
  expectedAnnualReturn: "",
  monthlyMarketingBudget: "",
};

const WIZARD_STEPS = [
  "Venture Basics",
  "Market Problem",
  "Customer Reach",
  "Market Size",
  "Feasibility",
  "Pricing & Economics",
  "Investment & Launch",
];

function ReqText({ label, value, onChange, placeholder, hint, rows }) {
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${fieldCls} rounded-2xl resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={fieldCls}
        />
      )}
      {hint && <p className="text-[0.65rem] text-[#8C6D58]">{hint}</p>}
    </div>
  );
}

const fieldCls =
  "w-full rounded-xl border border-[#D4AF37]/60 bg-white px-3.5 py-2.5 text-xs text-[#4A0A13] placeholder-[#8C6D58]/60 focus:border-[#400A12] focus:outline-none shadow-xs";
const labelCls =
  "font-mono text-[0.68rem] uppercase font-bold text-[#B8860B] tracking-wider";

function ReqNumber({ label, value, onChange, placeholder, hint }) {
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={fieldCls}
      />
      {hint && <p className="text-[0.65rem] text-[#8C6D58]">{hint}</p>}
    </div>
  );
}

function ReqSlider({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className={labelCls}>{label}</label>
        <span className="font-mono text-xs font-bold text-[#400A12]">{value}/100</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#400A12] cursor-pointer"
      />
    </div>
  );
}

const INITIAL_MY_PROJECTS = [
  {
    id: "p1",
    title: "EcoFly Medical Drones",
    industry: "Healthcare & Logistics",
    verdict: "GO (89%)",
    status: "ACTIVE",
    modulesProcessed: "10/10",
    date: "2026-08-01",
    description: "Autonomous cold-chain drone delivery network for rural tier-2 hospital hubs."
  },
  {
    id: "p2",
    title: "Apex AI Recruiter",
    industry: "HR Tech & Enterprise SaaS",
    verdict: "GO (86%)",
    status: "ACTIVE",
    modulesProcessed: "9/10",
    date: "2026-07-28",
    description: "AI autonomous agent system for technical engineering candidate screening."
  },
  {
    id: "p3",
    title: "GreenPack Biodegradable",
    industry: "Retail & Packaging",
    verdict: "CONDITIONAL (72%)",
    status: "UNDER_REVIEW",
    modulesProcessed: "6/10",
    date: "2026-07-25",
    description: "Bio-polymers derived from agricultural waste for eco-friendly packaging."
  },
  {
    id: "p4",
    title: "Nimbus Cloud Audit",
    industry: "Fintech B2B",
    verdict: "PENDING",
    status: "INTAKE",
    modulesProcessed: "2/10",
    date: "2026-08-03",
    description: "Automated real-time compliance audit engine for AWS/GCP cloud environments."
  }
];

/* ============================================================
   INITIAL POSTED BUSINESS QUESTIONS & RESPONSES
   ============================================================ */
const INITIAL_QUERIES = [
  {
    id: "q1",
    question: "Can an autonomous drone logistics model for hospital cold-chains achieve positive unit economics in tier-2 cities within 18 months?",
    category: "Business Viability",
    project: "EcoFly Medical Drones",
    status: "COMPLETED",
    score: 89,
    timestamp: "2 hours ago",
    response: "Unit economics break-even achieved at month 18.4 based on MOD-03 financial modeling with $4.20 per delivery mile overhead. Customer payback period is 4.2 months. GO (89%) capital allocation verdict recommended."
  },
  {
    id: "q2",
    question: "What is the TAM/SAM competitive whitespace for AI recruiter screening agents in enterprise SaaS hiring?",
    category: "Market Foundation",
    project: "Apex AI Recruiter",
    status: "COMPLETED",
    score: 86,
    timestamp: "1 day ago",
    response: "Global TAM estimated at $14.8B with SAM of $3.2B at 24.5% CAGR. Primary whitespace lies in multi-round live technical coding assessment. Moat defensibility verified across MOD-02."
  },
  {
    id: "q3",
    question: "What are the primary regulatory compliance barriers for bio-polymer packaging in EU export markets?",
    category: "Business Viability",
    project: "GreenPack Biodegradable",
    status: "IN_PROGRESS",
    score: 72,
    timestamp: "3 days ago",
    response: "EU Single-Use Plastics Directive compliance requires EN 13432 compostability certification. Preliminary MOD-07 score indicates 72% readiness with 2 open compliance action items."
  }
];

export default function ExecutiveDashboard({ onLogout, onGoHome, onOpenLegacy }) {
  // Navigation & View States
  const [navbarSection, setNavbarSection] = useState("queries"); // 'queries' | 'modules' | 'track' | 'engines'
  const [engineTab, setEngineTab] = useState("startup");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data States
  const [projectsList, setProjectsList] = useState(INITIAL_MY_PROJECTS);
  const [queriesList, setQueriesList] = useState(INITIAL_QUERIES);
  const [modulesList, setModulesList] = useState(INITIAL_INTELLIGENCE_MODULES);

  // Dropdowns & Modals
  const [isMyProjectsDropdownOpen, setIsMyProjectsDropdownOpen] = useState(false);
  const [isViewProjectsModalOpen, setIsViewProjectsModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  // Question Form State
  const [questionText, setQuestionText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Market Foundation");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [questionSuccess, setQuestionSuccess] = useState(false);

  // New Project Form & Analysis State
  const [newProjectForm, setNewProjectForm] = useState(EMPTY_PROJECT_FORM);
  const [wizardStep, setWizardStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatusText, setAnalysisStatusText] = useState("Initializing orbital synthesis engine...");

  /* 'checking' until the health probe answers; 'offline' keeps every flow on
     its original simulation. */
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const health = await checkHealth(controller.signal);
        if (!health.ready) { setApiStatus("offline"); return; }
        const data = await listReports(controller.signal);
        setApiStatus("online");
        const rows = (data?.reports || []).map(projectFromReport);
        // An empty database shouldn't blank the portal on first run.
        if (rows.length) setProjectsList(rows);
      } catch (err) {
        if (err.name !== "AbortError") setApiStatus("offline");
      }
    })();
    return () => controller.abort();
  }, []);

  const notifications = [
    { id: 1, title: "Module 10 Evaluation Ready", time: "10m ago", read: false },
    { id: 2, title: "EcoFly Medical Drones achieved 89% score", time: "1h ago", read: false },
    { id: 3, title: "New market risk flag identified for Nimbus", time: "3h ago", read: true }
  ];

  // Submit Business Question Handler
  const handlePostQuestionSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setIsSubmittingQuestion(true);

    setTimeout(() => {
      const newQuery = {
        id: `q-${Date.now()}`,
        question: questionText,
        category: selectedCategory,
        project: projectsList[0]?.title || "Client Venture Evaluation",
        status: "COMPLETED",
        score: Math.floor(Math.random() * 12) + 84, // 84-95%
        timestamp: "Just now",
        response: `Cross-module synthesis completed for question. Demand signal strength verified at 88%. Unit economic payback projected within target window. Recommendation: Proceed to Phase 2 Execution.`
      };
      setQueriesList((prev) => [newQuery, ...prev]);
      setIsSubmittingQuestion(false);
      setQuestionSuccess(true);

      setTimeout(() => {
        setQuestionSuccess(false);
        setIsQuestionModalOpen(false);
        setQuestionText("");
        setNavbarSection("queries"); // Switch navbar to Query Section to display response!
      }, 1200);
    }, 1400);
  };

  // "Do Analysis" Handler for New Project — drives the real pipeline when the
  // API is up, otherwise falls through to the original simulation below.
  const handleDoAnalysis = async (e) => {
    e.preventDefault();
    if (!newProjectForm.startupName.trim()) return;

    // Enter / "Next" advances the wizard; only the last step submits.
    if (wizardStep < WIZARD_STEPS.length - 1) {
      setWizardStep((s) => s + 1);
      return;
    }

    if (apiStatus === "online") {
      setIsAnalyzing(true);
      try {
        const result = await generateReportViaApi(
          {
            name: newProjectForm.startupName,
            vertical: "startups",
            tags: [newProjectForm.sector],
            tracks: [],
            customModules: [],
            profile: {
              company: newProjectForm.startupName,
              industry: newProjectForm.sector,
              stage: STAGE_TO_SERVER[newProjectForm.stage] || "Seed",
              geography: newProjectForm.geography,
              model: newProjectForm.businessModel,
              contact: newProjectForm.contact,
            },
            /* The clusters carry the narrative sections of the exported
               strategy report verbatim, and feed the calculators' text
               fallbacks (wtp, breakeven, ask). */
            clusters: {
              market: {
                problem: newProjectForm.description,
                pain: newProjectForm.painPoint,
                wtp: newProjectForm.wtpText,
                icp: newProjectForm.icp,
              },
              viability: {
                revenue: newProjectForm.revenueModel,
                margin: newProjectForm.grossMargin,
                costs: newProjectForm.costDrivers,
                breakeven: newProjectForm.monthsToBreakEven ? `${newProjectForm.monthsToBreakEven} months` : "",
              },
              launch: {
                geography: newProjectForm.geography,
                gtm: newProjectForm.gtmStrategy,
                milestones: newProjectForm.milestones,
                ask: newProjectForm.capitalRequired
                  ? `USD ${Number(newProjectForm.capitalRequired).toLocaleString()}`
                  : "",
              },
            },
            requirements: {
              consumerCommunication: newProjectForm.consumerCommunication,
              reachableConsumers: newProjectForm.reachableConsumers,
              interviewsCompleted: newProjectForm.interviewsCompleted,
              weeklyInteractions: newProjectForm.weeklyInteractions,
              tam: newProjectForm.tam,
              samPercent: newProjectForm.samPercent,
              conversionRate: newProjectForm.conversionRate,
              technical: newProjectForm.technical,
              operational: newProjectForm.operational,
              financial: newProjectForm.financial,
              regulatory: newProjectForm.regulatory,
              teamCapability: newProjectForm.teamCapability,
              ourPrice: newProjectForm.ourPrice,
              competitorLowPrice: newProjectForm.competitorLowPrice,
              competitorHighPrice: newProjectForm.competitorHighPrice,
              capitalRequired: newProjectForm.capitalRequired,
              monthsToBreakEven: newProjectForm.monthsToBreakEven,
              expectedAnnualReturn: newProjectForm.expectedAnnualReturn,
              monthlyMarketingBudget: newProjectForm.monthlyMarketingBudget,
            },
          },
          (label, done, total) => setAnalysisStatusText(`${label} (${done}/${total})…`)
        );

        setProjectsList((prev) => [projectFromReport(result.report), ...prev]);
        // Hand the finished strategy report over as a Word document too.
        downloadReportDoc(result.report, result.moduleResults || {});
        // Real per-module scores where the server returned them.
        const results = result.moduleResults || {};
        setModulesList((prev) =>
          prev.map((mod, i) => {
            const run = results[MODULE_KEY_ORDER[i]];
            return run
              ? { ...mod, project: newProjectForm.startupName, status: "COMPLETED", score: Math.round(run.score ?? mod.score), lastUpdated: "Just now" }
              : mod;
          })
        );
        setIsAnalyzing(false);
        setIsNewProjectModalOpen(false);
        setNewProjectForm(EMPTY_PROJECT_FORM);
        setWizardStep(0);
        setNavbarSection("modules");
        return;
      } catch (err) {
        // Server refused or dropped mid-run — finish with the simulation so
        // the user still gets a project card, and stop trusting the API.
        setApiStatus("offline");
        setAnalysisStatusText(`Backend unavailable (${err.message}) — completing locally…`);
      }
    }

    setIsAnalyzing(true);
    setAnalysisStatusText(`Auditing ${newProjectForm.startupName} across 10 intelligence modules...`);

    // Step-by-step progress simulation
    setTimeout(() => {
      setAnalysisStatusText("Evaluating Market Whitespace & TAM/SAM Sizing (MOD-01)...");
    }, 600);
    setTimeout(() => {
      setAnalysisStatusText("Modeling Unit Economics & Risk Matrix (MOD-03 & MOD-05)...");
    }, 1200);
    setTimeout(() => {
      setAnalysisStatusText("Synthesizing Executive Scorecard & Final Verdict...");
    }, 1800);

    setTimeout(() => {
      const calculatedScore = Math.floor(Math.random() * 10) + 86; // 86-95%
      const newProj = {
        id: `p-${Date.now()}`,
        title: newProjectForm.startupName,
        industry: newProjectForm.sector,
        verdict: `GO (${calculatedScore}%)`,
        status: "ACTIVE",
        modulesProcessed: "10/10",
        date: new Date().toISOString().split("T")[0],
        description: newProjectForm.description || "Newly evaluated startup project."
      };

      setProjectsList((prev) => [newProj, ...prev]);

      // Update all 10 module scores to reflect analysis for this new startup
      setModulesList((prev) =>
        prev.map((mod) => ({
          ...mod,
          project: newProjectForm.startupName,
          status: "COMPLETED",
          score: Math.floor(Math.random() * 14) + 82, // 82-95%
          lastUpdated: "Just now"
        }))
      );

      setIsAnalyzing(false);
      setIsNewProjectModalOpen(false);
      setNewProjectForm(EMPTY_PROJECT_FORM);
        setWizardStep(0);
      setNavbarSection("modules"); // Switch navbar to Module Wise Score to highlight results!
    }, 2400);
  };

  /* Download any project's strategy report as a Word document. API rows get
     the full pipeline output (module scores + verdict); local sample rows get
     the document built from what the card knows. */
  const handleDownloadReport = async (p) => {
    if (p.fromApi && apiStatus === "online") {
      try {
        const data = await getReport(p.id);
        downloadReportDoc(data.report, data.moduleResults || {});
        return;
      } catch {
        /* fall through to the local shape */
      }
    }
    const m = /\((\d+)%\)/.exec(p.verdict || "");
    downloadReportDoc(
      {
        name: p.title,
        vertical: p.industry,
        status: p.status === "ACTIVE" ? "PUBLISHED" : "PROCESSED",
        score: m ? Number(m[1]) : 0,
        decision: /GO/.test(p.verdict || "") ? 1 : /PIVOT/.test(p.verdict || "") ? 0 : null,
        clusters: { market: { problem: p.description } },
      },
      {}
    );
  };

  // Filtered queries based on search
  const filteredQueries = queriesList.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.response.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered modules based on search
  const filteredModules = modulesList.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A0A13] font-sans selection:bg-[#D4AF37] selection:text-[#4A0A13] flex flex-col w-full pb-16">
      
      {/* ============================================================
         1. EXECUTIVE TOP NAVBAR (HEADER)
         ============================================================ */}
      <header className="sticky top-0 z-30 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Title & Breadcrumbs */}
          <div className="flex flex-col text-center md:text-left w-full md:w-auto">
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#4A0A13] tracking-tight">
              Dashboard
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-semibold text-[#8C6D58] mt-0.5">
              <button
                onClick={onGoHome}
                className="hover:text-[#4A0A13] transition cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-[#4A0A13]">Dashboard</span>
            </div>
          </div>

          {/* Right Header Controls (Search, Bell, Profile Avatar, Logout) */}
          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto">
            
            {/* Search Input Box */}
            <div className="relative flex-1 md:w-72 lg:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D58]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search queries, modules, projects..."
                className="w-full bg-[#F5EAD4]/90 border border-[#D4AF37]/40 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-[#4A0A13] placeholder-[#8C6D58]/70 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C6D58] hover:text-[#4A0A13]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setNotificationsRead(true);
                }}
                className="relative p-2 rounded-full hover:bg-[#F5EAD4] text-[#B8860B] transition cursor-pointer"
                title="Notifications"
              >
                <Bell size={20} />
                {!notificationsRead && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#FAF7F2]" />
                )}
              </button>

              {/* Notifications Popover */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#FAF4E8] border border-[#D4AF37]/50 rounded-2xl shadow-xl p-4 z-50 text-[#4A0A13]"
                  >
                    <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2 mb-3">
                      <span className="font-bold text-xs uppercase font-mono tracking-wider text-[#B8860B]">
                        Notifications
                      </span>
                      <button
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-[#8C6D58] hover:text-[#4A0A13]"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-white/60 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition text-xs"
                        >
                          <p className="font-semibold text-[#4A0A13]">{n.title}</p>
                          <span className="text-[0.65rem] text-[#8C6D58]">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar */}
            <div
              className="w-9 h-9 rounded-full bg-[#B8860B] hover:bg-[#9A7008] text-white font-extrabold text-xs flex items-center justify-center shadow-xs cursor-pointer select-none transition"
              title="Executive Profile (Nehal)"
            >
              NS
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout || onGoHome}
              type="button"
              className="flex items-center gap-1 text-xs font-bold text-[#7A1C29] hover:text-[#4A0A13] transition cursor-pointer px-2 py-1 rounded-lg hover:bg-[#F5EAD4]"
              title="Log Out"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>
      </header>

      {/* ============================================================
         2. MAIN HERO WORKSPACE BANNER (WITH 3 WELCOME CARD BUTTONS)
         ============================================================ */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 space-y-8 flex-1">
        
        {/* Banner Card */}
        <div className="relative w-full bg-[#400A12] border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-7 text-[#FAF4E8] shadow-xl">
          
          {/* Subtle Ambient Lighting Background */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(212,175,55,0.18)_0%,transparent_60%)]" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_80%_20%,rgba(245,215,127,0.1)_0%,transparent_50%)]" />
          </div>

          <div className="relative z-10 space-y-3">
            
            {/* Pill Tag: Client Workspace */}
            <div className="inline-block bg-[#FAF4E8] text-[#400A12] font-bold text-[0.7rem] px-3 py-1 rounded-full shadow-xs tracking-wide">
              Client Executive Workspace
            </div>

            {/* Headline: Welcome back, Nehal! 👋 */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FAF4E8] tracking-tight leading-tight flex items-center gap-2">
              <span>Welcome back, Nehal!</span>
              <span className="animate-bounce inline-block">👋</span>
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#FAF4E8]/85 font-sans max-w-3xl leading-relaxed">
              Ready to validate a new business idea? Post your question or problem statement to start structured evaluation across 10 intelligence modules.
            </p>

            {/* ============================================================
               THREE WELCOME CARD BUTTONS (WITH DROPDOWN MENU FOR MY PROJECTS)
               ============================================================ */}
            <div className="pt-2 flex flex-wrap items-center gap-3 relative z-30">
              
              {/* BUTTON 1: ? Post Business Question */}
              <button
                onClick={() => setIsQuestionModalOpen(true)}
                type="button"
                className="group flex items-center gap-2 bg-[#C89B3C] hover:bg-[#D4AF37] active:scale-[0.98] text-[#400A12] font-extrabold px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer border border-[#F5D77F]/40 text-xs tracking-wide"
              >
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#400A12] text-[#C89B3C] font-mono text-[0.65rem] font-bold">
                  ?
                </span>
                <span>Post Business Question</span>
              </button>

              {/* BUTTON 2: My Projects (With Dropdown Menu for View Projects & New Project) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMyProjectsDropdownOpen(!isMyProjectsDropdownOpen)}
                  className="flex items-center gap-2 border border-[#FAF4E8]/40 hover:border-[#FAF4E8] bg-white/10 hover:bg-white/20 active:scale-[0.98] text-[#FAF4E8] font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer text-xs tracking-wide"
                >
                  <Folder size={15} className="text-[#F5D77F]" />
                  <span>My Projects</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 text-[#F5D77F] ${
                      isMyProjectsDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu Popover (Positioned ABOVE the button) */}
                <AnimatePresence>
                  {isMyProjectsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-2 w-64 bg-[#FAF4E8] border border-[#D4AF37] rounded-2xl shadow-2xl p-2 z-50 text-[#4A0A13] space-y-1"
                    >
                      <div className="px-3 py-1.5 border-b border-[#D4AF37]/30">
                        <p className="font-mono text-[0.68rem] font-extrabold uppercase text-[#B8860B]">
                          Project Directory ({projectsList.length})
                        </p>
                      </div>

                      {/* Dropdown Item 1: View Projects */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMyProjectsDropdownOpen(false);
                          setIsViewProjectsModalOpen(true);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F5EAD4] transition text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-[#400A12] text-[#F5D77F]">
                            <Folder size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#4A0A13] group-hover:text-[#B8860B]">
                              View Projects
                            </p>
                            <p className="text-[0.65rem] text-[#8C6D58]">
                              Previous client projects & status
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={13} className="text-[#8C6D58] group-hover:translate-x-0.5 transition" />
                      </button>

                      {/* Dropdown Item 2: New Project */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMyProjectsDropdownOpen(false);
                          setIsNewProjectModalOpen(true);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F5EAD4] transition text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-[#B8860B] text-white">
                            <FolderPlus size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#4A0A13] group-hover:text-[#B8860B]">
                              New Project
                            </p>
                            <p className="text-[0.65rem] text-[#8C6D58]">
                              Post new startup & run analysis
                            </p>
                          </div>
                        </div>
                        <Sparkles size={13} className="text-[#B8860B]" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* BUTTON 3: New Project Analysis Action */}
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                type="button"
                className="flex items-center gap-2 bg-[#5C0F1A] hover:bg-[#7A1C29] border border-[#D4AF37]/50 active:scale-[0.98] text-[#FAF4E8] font-extrabold px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer text-xs tracking-wide"
              >
                <Sparkles size={14} className="text-[#F5D77F]" />
                <span>+ New Project Analysis</span>
              </button>

            </div>

          </div>
        </div>

        {/* ============================================================
           3. THREE NAV SECTIONS BELOW WELCOME CARD (HOMEPAGE NAVBAR FORMAT)
           ============================================================ */}
        <div className="relative z-20 bg-[#F5EAD4]/90 border border-[#D4AF37]/40 rounded-2xl p-2.5 sm:px-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Homepage Nav Format: Clean Tabs with Gold Underline & Active Styling */}
          <nav className="flex items-center justify-center sm:justify-start gap-2 sm:gap-6 w-full overflow-x-auto py-1">
            
            {/* 1. Query Section */}
            <button
              type="button"
              onClick={() => setNavbarSection("queries")}
              className={`group relative text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap py-2 px-3 sm:px-4 rounded-xl flex items-center gap-2 ${
                navbarSection === "queries"
                  ? "bg-[#400A12] text-[#FAF4E8] shadow-md border border-[#D4AF37]/50"
                  : "text-[#4A0A13] hover:bg-[#FAF4E8]/80 hover:text-[#7A1C29]"
              }`}
            >
              <MessageSquare size={16} className={navbarSection === "queries" ? "text-[#F5D77F]" : "text-[#B8860B]"} />
              <span>1. Query Section</span>
              <span className="text-[0.65rem] px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 font-mono font-normal">
                {queriesList.length}
              </span>
              {navbarSection === "queries" && (
                <motion.span layoutId="navbarUnderline" className="absolute -bottom-1 left-3 right-3 h-0.5 bg-[#D4AF37] rounded-full" />
              )}
            </button>

            {/* 2. Module Wise Score */}
            <button
              type="button"
              onClick={() => setNavbarSection("modules")}
              className={`group relative text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap py-2 px-3 sm:px-4 rounded-xl flex items-center gap-2 ${
                navbarSection === "modules"
                  ? "bg-[#400A12] text-[#FAF4E8] shadow-md border border-[#D4AF37]/50"
                  : "text-[#4A0A13] hover:bg-[#FAF4E8]/80 hover:text-[#7A1C29]"
              }`}
            >
              <Layers size={16} className={navbarSection === "modules" ? "text-[#F5D77F]" : "text-[#B8860B]"} />
              <span>2. Module Wise Score</span>
              <span className="text-[0.65rem] px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 font-mono font-normal">
                10
              </span>
              {navbarSection === "modules" && (
                <motion.span layoutId="navbarUnderline" className="absolute -bottom-1 left-3 right-3 h-0.5 bg-[#D4AF37] rounded-full" />
              )}
            </button>

            {/* 3. Track Status */}
            <button
              type="button"
              onClick={() => setNavbarSection("track")}
              className={`group relative text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap py-2 px-4 rounded-xl flex items-center gap-2 ${
                navbarSection === "track"
                  ? "bg-[#400A12] text-[#FAF4E8] shadow-md border border-[#D4AF37]/50"
                  : "text-[#4A0A13] hover:bg-[#FAF4E8]/80 hover:text-[#7A1C29]"
              }`}
            >
              <Activity size={16} className={navbarSection === "track" ? "text-[#F5D77F]" : "text-[#B8860B]"} />
              <span>3. Track Status</span>
              {navbarSection === "track" && (
                <motion.span layoutId="navbarUnderline" className="absolute -bottom-1 left-3 right-3 h-0.5 bg-[#D4AF37] rounded-full" />
              )}
            </button>

            {/* 4. Vertical Engines */}
            <button
              type="button"
              onClick={() => setNavbarSection("engines")}
              className={`group relative text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap py-2 px-4 rounded-xl flex items-center gap-2 ${
                navbarSection === "engines"
                  ? "bg-[#400A12] text-[#FAF4E8] shadow-md border border-[#D4AF37]/50"
                  : "text-[#4A0A13] hover:bg-[#FAF4E8]/80 hover:text-[#7A1C29]"
              }`}
            >
              <Cpu size={16} className={navbarSection === "engines" ? "text-[#F5D77F]" : "text-[#B8860B]"} />
              <span>4. Vertical Engines</span>
              {navbarSection === "engines" && (
                <motion.span layoutId="navbarUnderline" className="absolute -bottom-1 left-3 right-3 h-0.5 bg-[#D4AF37] rounded-full" />
              )}
            </button>

            {/* 5. The original three-layer intake workspace, untouched */}
            {onOpenLegacy && (
              <button
                type="button"
                onClick={onOpenLegacy}
                className="group relative text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap py-2 px-4 rounded-xl flex items-center gap-2 text-[#4A0A13] hover:bg-[#FAF4E8]/80 hover:text-[#7A1C29]"
              >
                <FileText size={16} className="text-[#B8860B]" />
                <span>5. Intake Engine</span>
              </button>
            )}

          </nav>

          {/* Right Live System Telemetry Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#8C6D58] shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[0.68rem]">Systemic Telemetry Live</span>
          </div>

        </div>

        {/* ============================================================
           4. DYNAMIC SECTION CONTENT RENDERER
           ============================================================ */}

        {/* ---------------- SECTION 1: QUERY SECTION ---------------- */}
        {navbarSection === "queries" && (
          <section className="space-y-6 pt-2">
            
            {/* Clean Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#4A0A13] flex items-center gap-2">
                  <MessageSquare size={22} className="text-[#B8860B]" />
                  <span>Query Section</span>
                </h3>
                <p className="text-xs text-[#8C6D58] mt-0.5">
                  AI intelligence responses for posted business questions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold bg-[#F5EAD4] text-[#B8860B] px-3 py-1.5 rounded-full border border-[#D4AF37]/30">
                  {queriesList.length} Active Queries
                </span>
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(true)}
                  className="flex items-center gap-2 bg-[#400A12] hover:bg-[#5C0F1A] text-[#F5D77F] font-bold px-4 py-2 rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Post Question</span>
                </button>
              </div>
            </div>

            {/* Queries Grid */}
            <div className="grid grid-cols-1 gap-5">
              {filteredQueries.map((q) => (
                <div
                  key={q.id}
                  className="bg-white/95 border border-[#D4AF37]/35 hover:border-[#D4AF37] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 space-y-4"
                >
                  {/* Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.68rem] font-bold uppercase bg-[#F5EAD4] text-[#B8860B] px-2.5 py-0.5 rounded-md">
                        {q.category}
                      </span>
                      <span className="text-xs font-bold text-[#4A0A13]">
                        {q.project}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[0.68rem] text-[#8C6D58] font-mono">
                        {q.timestamp}
                      </span>
                      <span className="text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {q.status} ({q.score}%)
                      </span>
                    </div>
                  </div>

                  {/* Business Question Statement */}
                  <div className="space-y-1 pl-1">
                    <h4 className="font-serif text-lg font-bold text-[#400A12] leading-snug">
                      "{q.question}"
                    </h4>
                  </div>

                  {/* AI Response Card */}
                  <div className="bg-[#FAF4E8] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.68rem] uppercase font-bold text-[#B8860B] flex items-center gap-1.5">
                        <Sparkles size={13} className="text-[#B8860B]" />
                        <span>AI Verdict & Intelligence Response</span>
                      </span>
                      <span className="text-[0.68rem] font-extrabold text-[#400A12] bg-[#F5EAD4] px-2.5 py-0.5 rounded-md">
                        {q.score}% Confidence
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A0A13] leading-relaxed">
                      {q.response}
                    </p>
                  </div>
                </div>
              ))}

              {filteredQueries.length === 0 && (
                <div className="text-center py-12 bg-white/60 border border-dashed border-[#D4AF37]/40 rounded-2xl">
                  <p className="text-sm font-semibold text-[#8C6D58]">
                    No queries found matching "{searchQuery}".
                  </p>
                  <button
                    onClick={() => setIsQuestionModalOpen(true)}
                    className="mt-3 text-xs font-bold text-[#400A12] underline cursor-pointer"
                  >
                    Post a new business question
                  </button>
                </div>
              )}
            </div>

          </section>
        )}

        {/* ---------------- SECTION 2: MODULE WISE SCORE ---------------- */}
        {navbarSection === "modules" && (
          <section className="space-y-6 pt-2">
            
            {/* Clean Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#4A0A13] flex items-center gap-2">
                  <Layers size={22} className="text-[#B8860B]" />
                  <span>Module Wise Score</span>
                </h3>
                <p className="text-xs text-[#8C6D58] mt-0.5">
                  Intelligence evaluation scores across all 10 modules.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#F5EAD4] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 text-xs font-bold text-[#4A0A13]">
                <span className="text-[#B8860B]">Avg Orbital Score:</span>
                <span className="font-mono text-[#400A12] font-extrabold text-sm">84.8%</span>
              </div>
            </div>

            {/* 10 Intelligence Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredModules.map((mod) => {
                const IconComponent = mod.icon;
                return (
                  <div
                    key={mod.id}
                    className="group bg-white/95 border border-[#D4AF37]/35 hover:border-[#D4AF37] rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Row: Code & Score Pill */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[0.68rem] font-bold text-[#B8860B] uppercase bg-[#F5EAD4] px-2.5 py-0.5 rounded-md">
                          {mod.code}
                        </span>
                        
                        {/* HIGHLIGHTED SCORE BADGE */}
                        <div className="flex items-center gap-1.5 bg-[#400A12] text-[#F5D77F] px-3 py-1 rounded-xl border border-[#D4AF37]/40 shadow-xs">
                          <span className="font-mono text-sm font-extrabold">
                            {mod.score}%
                          </span>
                        </div>
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-start gap-3 pt-1">
                        <div className="p-2.5 rounded-xl bg-[#400A12] text-[#F5D77F] shrink-0 shadow-xs">
                          <IconComponent size={18} />
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-bold text-[#4A0A13] group-hover:text-[#B8860B] transition">
                            {mod.name}
                          </h4>
                          <p className="text-[0.68rem] font-mono text-[#8C6D58]">
                            {mod.category}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#6A4B3A] leading-relaxed line-clamp-2">
                        {mod.desc}
                      </p>

                      {/* Progress Bar */}
                      <div className="pt-1">
                        <div className="flex items-center justify-between text-[0.65rem] font-mono text-[#8C6D58] mb-1">
                          <span>Readiness Metric</span>
                          <span className="font-bold text-[#400A12]">{mod.score}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#F5EAD4] rounded-full overflow-hidden border border-[#D4AF37]/20">
                          <div
                            className="h-full bg-gradient-to-r from-[#C89B3C] to-[#400A12] rounded-full transition-all duration-500"
                            style={{ width: `${mod.score}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="pt-3 mt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-[0.68rem] text-[#8C6D58]">
                      <span className="font-mono">{mod.project}</span>
                      <span className="font-mono">Updated {mod.lastUpdated}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </section>
        )}

        {/* ---------------- SECTION 3: TRACK STATUS ---------------- */}
        {navbarSection === "track" && (
          <section className="space-y-6 pt-2">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#4A0A13] flex items-center gap-2">
                  <Activity size={22} className="text-[#B8860B]" />
                  <span>Track Status — Project Evaluation Status Location</span>
                </h3>
                <p className="text-xs text-[#8C6D58] mt-0.5">
                  Pipeline tracking stages, systemic intake telemetry, and active project evaluation status.
                </p>
              </div>

              {/* Global Telemetry Card */}
              <div className="flex items-center gap-3 bg-white/90 border border-[#D4AF37]/40 px-4 py-2 rounded-2xl shadow-xs">
                <div className="flex flex-col">
                  <span className="text-[0.68rem] font-mono text-[#8C6D58]">Overall System Readiness</span>
                  <span className="font-mono text-sm font-extrabold text-[#400A12]">70% (7/10 Modules Complete)</span>
                </div>
              </div>
            </div>

            {/* Pipeline Stage Tracker Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/80 border border-[#D4AF37]/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] font-bold text-[#B8860B]">STAGE 01</span>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    RECEIVED
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#400A12]">Raw Idea Intake</h4>
                <p className="text-xs text-[#8C6D58]">Reviewing problem statement & founder inputs.</p>
              </div>

              <div className="bg-white/80 border border-[#D4AF37]/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] font-bold text-[#B8860B]">STAGE 02</span>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    REQUIREMENTS
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#400A12]">Market Sizing Audit</h4>
                <p className="text-xs text-[#8C6D58]">Mapping TAM/SAM/SOM whitespace vectors.</p>
              </div>

              <div className="bg-white/80 border border-[#D4AF37]/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] font-bold text-[#B8860B]">STAGE 03</span>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    MAPPING
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#400A12]">Financial Viability</h4>
                <p className="text-xs text-[#8C6D58]">Auditing gross margin & unit payback cycles.</p>
              </div>

              <div className="bg-white/80 border border-[#D4AF37]/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] font-bold text-[#B8860B]">STAGE 04</span>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                    DELIVERED
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#400A12]">Executive Scorecard</h4>
                <p className="text-xs text-[#8C6D58]">Synthesizing final binary verdict matrix.</p>
              </div>
            </div>

            {/* Active Projects Status Table */}
            <div className="bg-white/90 border border-[#D4AF37]/40 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="font-serif text-lg font-bold text-[#4A0A13]">
                Project Evaluation Status Matrix
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#4A0A13]">
                  <thead className="bg-[#F5EAD4] font-mono text-[0.68rem] text-[#B8860B] uppercase">
                    <tr>
                      <th className="p-3 rounded-l-xl">Project Name</th>
                      <th className="p-3">Sector / Industry</th>
                      <th className="p-3">Evaluation Status</th>
                      <th className="p-3">Modules Ready</th>
                      <th className="p-3">Verdict Score</th>
                      <th className="p-3 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4AF37]/20">
                    {projectsList.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF4E8] transition">
                        <td className="p-3 font-bold text-[#400A12]">{p.title}</td>
                        <td className="p-3 text-[#8C6D58] font-mono">{p.industry}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[0.65rem] ${
                              p.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : p.status === "UNDER_REVIEW"
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-gray-100 text-gray-800 border border-gray-300"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold">{p.modulesProcessed}</td>
                        <td className="p-3 font-extrabold text-[#400A12]">{p.verdict}</td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleDownloadReport(p)}
                              title="Download strategy report (.doc)"
                              className="inline-flex items-center gap-1 text-[0.68rem] font-bold text-[#400A12] hover:text-[#B8860B] cursor-pointer"
                            >
                              <Download size={12} />
                              <span>.doc</span>
                            </button>
                            <button
                              onClick={() => setNavbarSection("modules")}
                              className="text-[0.68rem] font-bold text-[#400A12] hover:text-[#B8860B] underline cursor-pointer"
                            >
                              View Modules
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>
        )}

        {/* ---------------- SECTION 4: VERTICAL ENGINES ---------------- */}
        {navbarSection === "engines" && (
          <section className="space-y-6 pt-2">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-extrabold text-[#400A12]">Vertical Engines</h2>
              <p className="text-xs text-[#7A1C29]">
                Standalone TAM/SAM/SOM, unit-economics and feasibility calculators per vertical — run
                what-if numbers instantly, no report required.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                ["startup", "Startups — Market Sizing"],
                ["msme", "MSMEs — Optimization"],
                ["industry", "Industries — Analysis"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setEngineTab(id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    engineTab === id
                      ? "bg-[#400A12] text-[#F5D77F] border border-[#D4AF37]/50"
                      : "bg-[#FAF4E8] text-[#4A0A13] border border-[#D4AF37]/30 hover:bg-[#F5EAD4]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* The engines are the originals from the previous site, verbatim —
                they carry their own executive black & gold styling. */}
            <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#050505] p-4 sm:p-6">
              {engineTab === "startup" && <StartupMarketEngine />}
              {engineTab === "msme" && <MsmeOptimizationEngine />}
              {engineTab === "industry" && <IndustryAnalysisEngine />}
            </div>
          </section>
        )}

      </main>

      {/* ============================================================
         5. MODAL 1: POST BUSINESS QUESTION
         ============================================================ */}
      <AnimatePresence>
        {isQuestionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-[#FAF4E8] border border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#4A0A13]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F5EAD4] text-[#8C6D58] hover:text-[#4A0A13] transition cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="space-y-1 mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] uppercase tracking-wider font-mono">
                  <HelpCircle size={14} />
                  <span>Client Business Intake</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#400A12]">
                  Post Business Question
                </h3>
                <p className="text-xs text-[#7A1C29]">
                  Submit your core venture problem statement to run automated evaluation across 10 intelligence modules.
                </p>
              </div>

              {questionSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <Check size={28} />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#400A12]">
                    Question Submitted Successfully!
                  </h4>
                  <p className="text-xs text-[#8C6D58]">
                    Synthesizing intelligence modules... Directing you to the Query Section.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePostQuestionSubmit} className="space-y-4">
                  {/* Category Selection */}
                  <div className="space-y-1">
                    <label className="font-mono text-[0.68rem] uppercase font-bold text-[#B8860B] tracking-wider">
                      Evaluation Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full rounded-xl border border-[#D4AF37]/60 bg-white px-3.5 py-2.5 text-xs text-[#4A0A13] focus:border-[#400A12] focus:outline-none shadow-xs cursor-pointer font-sans"
                    >
                      <option value="Market Foundation">Market Foundation & TAM Whitespace</option>
                      <option value="Business Viability">Business Viability & Unit Economics</option>
                      <option value="Launch & Execution">Launch, GTM & Tech Architecture</option>
                      <option value="Executive Governance">Full 10-Module Executive Verdict</option>
                    </select>
                  </div>

                  {/* Question / Problem Statement Field */}
                  <div className="space-y-1">
                    <label className="font-mono text-[0.68rem] uppercase font-bold text-[#B8860B] tracking-wider">
                      Business Question / Problem Statement
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="e.g. Can an autonomous drone logistics model for hospital cold-chains achieve positive unit economics in tier-2 cities within 18 months?"
                      className="w-full rounded-2xl border border-[#D4AF37]/60 bg-white p-3.5 text-xs text-[#4A0A13] placeholder-[#8C6D58]/60 focus:border-[#400A12] focus:outline-none shadow-xs resize-none"
                    />
                  </div>

                  {/* Modal Footer Buttons */}
                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsQuestionModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#7A1C29] hover:bg-[#F5EAD4] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingQuestion}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#400A12] hover:bg-[#5C0F1A] text-[#F5D77F] font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingQuestion ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-[#F5D77F] border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>Submit & Run Analysis</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
         6. MODAL 2: VIEW MY PROJECTS
         ============================================================ */}
      <AnimatePresence>
        {isViewProjectsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-[#FAF4E8] border border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#4A0A13] max-h-[85vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsViewProjectsModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F5EAD4] text-[#8C6D58] hover:text-[#4A0A13] transition cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="space-y-1 mb-5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] uppercase tracking-wider font-mono">
                  <Folder size={14} />
                  <span>Client Portfolio</span>
                </div>
                <h3 className="font-serif text-2xl font-extrabold text-[#400A12]">
                  My Projects & Status Directory
                </h3>
                <p className="text-xs text-[#7A1C29]">
                  All projects posted or updated previously by this client account.
                </p>
              </div>

              {/* Projects List Scrollable Area */}
              <div className="overflow-y-auto space-y-3 pr-1 flex-1 [scrollbar-width:thin]">
                {projectsList.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-4 rounded-2xl border border-[#D4AF37]/35 hover:border-[#D4AF37] transition space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.68rem] font-bold text-[#B8860B] uppercase bg-[#F5EAD4] px-2 py-0.5 rounded-md">
                        {p.industry}
                      </span>
                      <span
                        className={`text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full ${
                          p.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : p.status === "UNDER_REVIEW"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-gray-100 text-gray-800 border border-gray-300"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#400A12]">
                      {p.title}
                    </h4>

                    <p className="text-xs text-[#6A4B3A]">
                      {p.description}
                    </p>

                    <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs">
                      <span className="text-[#8C6D58] font-mono text-[0.68rem]">
                        Modules: {p.modulesProcessed}
                      </span>
                      <span className="font-extrabold text-[#400A12]">
                        Verdict: {p.verdict}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDownloadReport(p)}
                      className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D4AF37]/50 text-[0.68rem] font-bold text-[#400A12] hover:bg-[#F5EAD4] transition cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Download Strategy Report (.doc)</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 mt-2 border-t border-[#D4AF37]/30 flex items-center justify-between">
                <span className="text-xs text-[#8C6D58] font-mono">
                  Total: {projectsList.length} ventures registered
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewProjectsModalOpen(false);
                    setIsNewProjectModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#400A12] hover:bg-[#5C0F1A] text-[#F5D77F] text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={14} />
                  <span>New Project</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
         7. MODAL 3: NEW PROJECT DIALOG BOX (WITH "DO ANALYSIS" BUTTON)
         ============================================================ */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-[#FAF4E8] border border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#4A0A13]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsNewProjectModalOpen(false);
                  setWizardStep(0);
                }}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F5EAD4] text-[#8C6D58] hover:text-[#4A0A13] transition cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="space-y-1 mb-5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] uppercase tracking-wider font-mono">
                  <FolderPlus size={14} />
                  <span>Venture Onboarding</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#400A12]">
                  New Project Analysis
                </h3>
                <p className="text-xs text-[#7A1C29]">
                  Answer the requirements below — the 10 intelligence modules score exactly what you enter.
                  Blank fields fall back to standard assumptions.
                </p>
                {!isAnalyzing && (
                  <div className="flex items-center gap-1.5 pt-2">
                    {WIZARD_STEPS.map((title, i) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => newProjectForm.startupName.trim() && setWizardStep(i)}
                        title={title}
                        className={`h-1.5 flex-1 rounded-full transition cursor-pointer ${
                          i <= wizardStep ? "bg-[#400A12]" : "bg-[#D4AF37]/30"
                        }`}
                      />
                    ))}
                  </div>
                )}
                {!isAnalyzing && (
                  <p className="font-mono text-[0.65rem] uppercase tracking-wider text-[#8C6D58] pt-1">
                    Step {wizardStep + 1} of {WIZARD_STEPS.length} — {WIZARD_STEPS[wizardStep]}
                  </p>
                )}
              </div>

              {isAnalyzing ? (
                <div className="py-10 text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/30 border-t-[#400A12] animate-spin" />
                    <Sparkles size={24} className="text-[#B8860B] animate-pulse" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#400A12]">
                    Running Analysis across 10 Modules...
                  </h4>
                  <p className="text-xs font-mono text-[#8C6D58] animate-pulse max-w-md mx-auto">
                    {analysisStatusText}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDoAnalysis} className="space-y-4">
                  {/* STEP 1 — Venture Basics */}
                  {wizardStep === 0 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelCls}>Startup / Project Name *</label>
                        <input
                          type="text"
                          required
                          value={newProjectForm.startupName}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, startupName: e.target.value })}
                          placeholder="e.g. AeroPulse Cold-Chain AI"
                          className={fieldCls}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className={labelCls}>Sector / Industry Vertical</label>
                          <select
                            value={newProjectForm.sector}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, sector: e.target.value })}
                            className={`${fieldCls} cursor-pointer`}
                          >
                            <option value="Healthcare & Logistics">Healthcare & Logistics</option>
                            <option value="HR Tech & Enterprise SaaS">HR Tech & Enterprise SaaS</option>
                            <option value="Fintech & Insurtech">Fintech & Insurtech</option>
                            <option value="AgriTech & Climate">AgriTech & Climate</option>
                            <option value="Retail & E-commerce">Retail & E-commerce</option>
                            <option value="DeepTech & AI">DeepTech & AI Infrastructure</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className={labelCls}>Venture Stage</label>
                          <select
                            value={newProjectForm.stage}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, stage: e.target.value })}
                            className={`${fieldCls} cursor-pointer`}
                          >
                            <option value="Idea & Problem Validation">Idea & Problem Validation</option>
                            <option value="Early Stage / Seed">Early Stage / Seed (Pre-Revenue)</option>
                            <option value="Early Traction / Series A">Early Traction / Series A</option>
                            <option value="Growth & Expansion">Growth & Expansion</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className={labelCls}>Business Model</label>
                        <select
                          value={newProjectForm.businessModel}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, businessModel: e.target.value })}
                          className={`${fieldCls} cursor-pointer`}
                        >
                          <option value="B2B Enterprise">B2B — selling to businesses</option>
                          <option value="B2C Consumer">B2C — selling to consumers</option>
                          <option value="B2B2C">B2B2C — through businesses to consumers</option>
                          <option value="Marketplace">Marketplace / platform</option>
                        </select>
                        <p className="text-[0.65rem] text-[#8C6D58]">
                          Drives sector routing, pricing norms and channel strategy across the modules.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReqText
                          label="Geographic target"
                          value={newProjectForm.geography}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, geography: v })}
                          placeholder="e.g. Chennai, TN"
                        />
                        <ReqText
                          label="Founder contact"
                          value={newProjectForm.contact}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, contact: v })}
                          placeholder="e.g. founder@venture.io"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — Market Problem (report section 2) */}
                  {wizardStep === 1 && (
                    <div className="space-y-4">
                      <ReqText
                        label="Core market problem"
                        value={newProjectForm.description}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, description: v })}
                        placeholder="What problem do you solve, for whom, and what makes your approach different..."
                        rows={3}
                      />
                      <ReqText
                        label="Customer pain point"
                        value={newProjectForm.painPoint}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, painPoint: v })}
                        placeholder="The specific pain the customer feels today"
                        rows={2}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReqText
                          label="Ideal customer profile (ICP)"
                          value={newProjectForm.icp}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, icp: v })}
                          placeholder="Who exactly buys this"
                        />
                        <ReqText
                          label="Willingness to pay (WTP)"
                          value={newProjectForm.wtpText}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, wtpText: v })}
                          placeholder='e.g. "150 rupees per order"'
                          hint="Free text — the number in it seeds pricing if you skip the price step."
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3 — Customer Reach (MOD-01) */}
                  {wizardStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-xl border border-[#D4AF37]/60 bg-white px-3.5 py-3">
                        <div>
                          <p className="text-xs font-bold text-[#4A0A13]">Can you directly reach your customers today?</p>
                          <p className="text-[0.65rem] text-[#8C6D58]">
                            Honest answer — "No" scores customer discovery at 0 and the verdict will say so.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewProjectForm({ ...newProjectForm, consumerCommunication: !newProjectForm.consumerCommunication })}
                          className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
                            newProjectForm.consumerCommunication
                              ? "bg-[#400A12] text-[#F5D77F]"
                              : "bg-[#F5EAD4] text-[#7A1C29]"
                          }`}
                        >
                          {newProjectForm.consumerCommunication ? "YES" : "NO"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReqNumber
                          label="Reachable customers"
                          value={newProjectForm.reachableConsumers}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, reachableConsumers: v })}
                          placeholder="e.g. 2500"
                          hint="How many you can contact through your current channels."
                        />
                        <ReqNumber
                          label="Discovery interviews done"
                          value={newProjectForm.interviewsCompleted}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, interviewsCompleted: v })}
                          placeholder="e.g. 12"
                          hint="Conversations held to validate the problem."
                        />
                      </div>
                      <ReqNumber
                        label="Customer interactions per week"
                        value={newProjectForm.weeklyInteractions}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, weeklyInteractions: v })}
                        placeholder="e.g. 40"
                        hint="Calls, demos, support chats — any direct contact."
                      />
                    </div>
                  )}

                  {/* STEP 4 — Market Size (MOD-03) */}
                  {wizardStep === 3 && (
                    <div className="space-y-4">
                      <ReqNumber
                        label="Total addressable market (TAM, USD)"
                        value={newProjectForm.tam}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, tam: v })}
                        placeholder="e.g. 500000000"
                        hint="Annual value if every possible customer bought."
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReqNumber
                          label="Serviceable share (SAM, %)"
                          value={newProjectForm.samPercent}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, samPercent: v })}
                          placeholder="e.g. 18"
                          hint="% of TAM your model can actually serve."
                        />
                        <ReqNumber
                          label="Lead-to-customer conversion (%)"
                          value={newProjectForm.conversionRate}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, conversionRate: v })}
                          placeholder="e.g. 12"
                          hint="Share of qualified leads that become paying customers."
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 5 — Feasibility self-rating (MOD-04) */}
                  {wizardStep === 4 && (
                    <div className="space-y-4">
                      <p className="text-[0.7rem] text-[#7A1C29]">
                        Rate each dimension 0–100 as honestly as you can — these weight directly into the feasibility score.
                      </p>
                      <ReqSlider label="Technical feasibility" value={newProjectForm.technical}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, technical: v })} />
                      <ReqSlider label="Operational readiness" value={newProjectForm.operational}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, operational: v })} />
                      <ReqSlider label="Financial runway" value={newProjectForm.financial}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, financial: v })} />
                      <ReqSlider label="Regulatory clearance" value={newProjectForm.regulatory}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, regulatory: v })} />
                      <ReqSlider label="Team capability" value={newProjectForm.teamCapability}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, teamCapability: v })} />
                    </div>
                  )}

                  {/* STEP 6 — Pricing & Economics (MOD-05, report section 3) */}
                  {wizardStep === 5 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ReqNumber
                          label="Your monthly price (USD)"
                          value={newProjectForm.ourPrice}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, ourPrice: v })}
                          placeholder="e.g. 2500"
                        />
                        <ReqNumber
                          label="Cheapest competitor"
                          value={newProjectForm.competitorLowPrice}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, competitorLowPrice: v })}
                          placeholder="e.g. 1800"
                        />
                        <ReqNumber
                          label="Priciest competitor"
                          value={newProjectForm.competitorHighPrice}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, competitorHighPrice: v })}
                          placeholder="e.g. 4000"
                        />
                      </div>
                      <ReqText
                        label="Revenue model"
                        value={newProjectForm.revenueModel}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, revenueModel: v })}
                        placeholder="e.g. B2C subscription + per-order commission"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReqText
                          label="Gross margin target"
                          value={newProjectForm.grossMargin}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, grossMargin: v })}
                          placeholder="e.g. 65% by year 2"
                        />
                        <ReqText
                          label="Key cost drivers"
                          value={newProjectForm.costDrivers}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, costDrivers: v })}
                          placeholder="e.g. raw materials, delivery, staff"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 7 — Investment & Launch (MOD-08 / MOD-09, report section 4) */}
                  {wizardStep === 6 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReqNumber
                          label="Capital required (USD)"
                          value={newProjectForm.capitalRequired}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, capitalRequired: v })}
                          placeholder="e.g. 1200000"
                          hint="Total investment you're asking for."
                        />
                        <ReqNumber
                          label="Months to break even"
                          value={newProjectForm.monthsToBreakEven}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, monthsToBreakEven: v })}
                          placeholder="e.g. 18"
                          hint="Over 24 months is flagged as hard to justify."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReqNumber
                          label="Expected annual return (USD)"
                          value={newProjectForm.expectedAnnualReturn}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, expectedAnnualReturn: v })}
                          placeholder="e.g. 480000"
                        />
                        <ReqNumber
                          label="Monthly marketing budget (USD)"
                          value={newProjectForm.monthlyMarketingBudget}
                          onChange={(v) => setNewProjectForm({ ...newProjectForm, monthlyMarketingBudget: v })}
                          placeholder="e.g. 12000"
                          hint="Determines which go-to-market channels are affordable."
                        />
                      </div>
                      <ReqText
                        label="GTM strategy"
                        value={newProjectForm.gtmStrategy}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, gtmStrategy: v })}
                        placeholder="e.g. Performance marketing + creator amplification + PLG"
                        rows={2}
                      />
                      <ReqText
                        label="Growth milestones"
                        value={newProjectForm.milestones}
                        onChange={(v) => setNewProjectForm({ ...newProjectForm, milestones: v })}
                        placeholder="e.g. Launch -> 10 pilot accounts -> scaled expansion"
                        rows={2}
                      />
                    </div>
                  )}

                  {/* Footer: Back / Next / Do Analysis */}
                  <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewProjectModalOpen(false);
                        setWizardStep(0);
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#7A1C29] hover:bg-[#F5EAD4] transition cursor-pointer"
                    >
                      Cancel
                    </button>

                    <div className="flex items-center gap-3">
                      {wizardStep > 0 && (
                        <button
                          type="button"
                          onClick={() => setWizardStep((s) => s - 1)}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#400A12] border border-[#D4AF37]/60 hover:bg-[#F5EAD4] transition cursor-pointer"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#400A12] hover:bg-[#5C0F1A] text-[#F5D77F] font-extrabold text-xs shadow-lg transition cursor-pointer border border-[#D4AF37]/40"
                      >
                        {wizardStep < WIZARD_STEPS.length - 1 ? (
                          <>
                            <span>Next</span>
                            <ChevronRight size={14} />
                          </>
                        ) : (
                          <>
                            <Play size={14} className="fill-[#F5D77F]" />
                            <span>Do Analysis</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
