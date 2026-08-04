import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Layers,
  UserCheck,
  Folder,
  Activity,
  MessageSquare,
  Search,
  Bell,
  LogOut,
  Home,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Download,
  Eye,
  FileText,
  Edit,
  Trash2,
  Send,
  Building2,
  GraduationCap,
  School,
  Factory,
  Rocket,
  Target,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Cpu,
  PieChart,
  BarChart3,
  Check,
  X,
  RefreshCw,
  Mail,
  User
} from "lucide-react";
import { OrbitBrand } from "./ui.jsx";

/* ============================================================
   ELEGANT & SIMPLE ADMIN DATA SEEDS
   ============================================================ */

const INITIAL_10_MODULES = [
  {
    id: "mod-01",
    code: "MOD-01",
    name: "Market Sizing & Whitespace",
    category: "Market Foundation",
    icon: Target,
    status: "COMPLETED",
    score: 88,
    desc: "TAM/SAM/SOM structural estimation, whitespace analysis, and market potential.",
    leadAuditor: "Dr. Aris Thorne",
    activeProjects: 4
  },
  {
    id: "mod-02",
    code: "MOD-02",
    name: "Competitor Intelligence",
    category: "Market Foundation",
    icon: Layers,
    status: "COMPLETED",
    score: 92,
    desc: "Feature teardowns, pricing models, positioning matrices, and defensibility moats.",
    leadAuditor: "Sophia Vance",
    activeProjects: 5
  },
  {
    id: "mod-03",
    code: "MOD-03",
    name: "Financial Viability & Unit Economics",
    category: "Business Viability",
    icon: DollarSign,
    status: "IN_PROGRESS",
    score: 76,
    desc: "CAC, LTV, payback period, gross margin modeling, and break-even trajectory.",
    leadAuditor: "Admin Governance",
    activeProjects: 3
  },
  {
    id: "mod-04",
    code: "MOD-04",
    name: "Go-To-Market Strategy",
    category: "Launch & Execution",
    icon: TrendingUp,
    status: "COMPLETED",
    score: 85,
    desc: "Channel selection, sales cycle optimization, partner ecosystems, and GTM engines.",
    leadAuditor: "Marcus Sterling",
    activeProjects: 4
  },
  {
    id: "mod-05",
    code: "MOD-05",
    name: "Risk & Vulnerability Audit",
    category: "Business Viability",
    icon: ShieldAlert,
    status: "IN_PROGRESS",
    score: 64,
    desc: "Single points of failure, supply chain exposure, and regulatory compliance risks.",
    leadAuditor: "Elena Rostova",
    activeProjects: 2
  },
  {
    id: "mod-06",
    code: "MOD-06",
    name: "Customer Persona & Demand Signal",
    category: "Market Foundation",
    icon: Activity,
    status: "COMPLETED",
    score: 90,
    desc: "Problem severity validation, willingness-to-pay signals, and journey friction.",
    leadAuditor: "David Chen",
    activeProjects: 6
  },
  {
    id: "mod-07",
    code: "MOD-07",
    name: "Regulatory & Compliance Framework",
    category: "Business Viability",
    icon: Building2,
    status: "PENDING",
    score: 45,
    desc: "ISO, GDPR, HIPAA, and industry-specific regulatory standards audit.",
    leadAuditor: "Admin Governance",
    activeProjects: 2
  },
  {
    id: "mod-08",
    code: "MOD-08",
    name: "Technology Architecture Audit",
    category: "Launch & Execution",
    icon: Cpu,
    status: "COMPLETED",
    score: 95,
    desc: "System scalability, tech stack vulnerability, maintenance debt, and IP integrity.",
    leadAuditor: "Sophia Vance",
    activeProjects: 5
  },
  {
    id: "mod-09",
    code: "MOD-09",
    name: "Operations & Supply Bottlenecks",
    category: "Launch & Execution",
    icon: PieChart,
    status: "IN_PROGRESS",
    score: 82,
    desc: "Process latency, fulfillment overheads, vendor SLA analysis, and operational yield.",
    leadAuditor: "David Chen",
    activeProjects: 3
  },
  {
    id: "mod-10",
    code: "MOD-10",
    name: "Executive Verdict & Scorecard",
    category: "Executive Governance",
    icon: Sparkles,
    status: "COMPLETED",
    score: 89,
    desc: "Synthesized binary GO/NO-GO recommendation, capital deployment verdict, and scorecard.",
    leadAuditor: "Admin Master",
    activeProjects: 6
  }
];

const INITIAL_CLIENT_PROFILES = [
  {
    id: "cli-1",
    fullName: "Dr. Aris Thorne",
    email: "aris.thorne@ecoflydrones.io",
    company: "EcoFly Medical Drones",
    domain: "Startups",
    status: "VERIFIED",
    accountType: "Executive",
    phone: "+1 (555) 234-8901",
    location: "Boston, MA"
  },
  {
    id: "cli-2",
    fullName: "Sophia Vance",
    email: "s.vance@apexrecruiter.ai",
    company: "Apex AI Recruiter",
    domain: "Startups",
    status: "VERIFIED",
    accountType: "Executive",
    phone: "+1 (555) 890-1234",
    location: "San Francisco, CA"
  },
  {
    id: "cli-3",
    fullName: "Marcus Sterling",
    email: "m.sterling@greenpack.co",
    company: "GreenPack Bio-Materials",
    domain: "MSMEs",
    status: "ACTIVE",
    accountType: "Client",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX"
  },
  {
    id: "cli-4",
    fullName: "Elena Rostova",
    email: "elena@nimbuscloud.net",
    company: "Nimbus Audit Corp",
    domain: "Industries",
    status: "PENDING",
    accountType: "Executive",
    phone: "+1 (555) 678-9012",
    location: "New York, NY"
  },
  {
    id: "cli-5",
    fullName: "Prof. Jonathan Vance",
    email: "j.vance@stanford.edu",
    company: "Stanford Robotics Lab",
    domain: "Educational Institutions",
    status: "VERIFIED",
    accountType: "Partner",
    phone: "+1 (555) 901-2345",
    location: "Palo Alto, CA"
  }
];

const INITIAL_PROJECT_REGISTRATIONS = [
  {
    id: "reg-101",
    projectName: "EcoFly Medical Drone Logistics",
    domain: "Startups",
    domainIcon: Rocket,
    clientName: "Dr. Aris Thorne",
    clientEmail: "aris.thorne@ecoflydrones.io",
    regDate: "2026-08-01",
    status: "APPROVED",
    priority: "HIGH",
    capabilitiesRequested: ["Customer Discovery", "TAM / SAM Sizing", "Orbital Index Score"],
    notes: "Validation for tier-2 city hospital cold chain delivery."
  },
  {
    id: "reg-102",
    projectName: "University Curriculum Modernization",
    domain: "Educational Institutions",
    domainIcon: School,
    clientName: "Prof. Jonathan Vance",
    clientEmail: "j.vance@stanford.edu",
    regDate: "2026-08-02",
    status: "APPROVED",
    priority: "MEDIUM",
    capabilitiesRequested: ["Curriculum Diagnosis", "Accreditation Pipelines", "Faculty Workflow"],
    notes: "AI integration benchmarking across engineering departments."
  },
  {
    id: "reg-103",
    projectName: "Bio-Polymer Yield Optimization",
    domain: "MSMEs",
    domainIcon: Factory,
    clientName: "Marcus Sterling",
    clientEmail: "m.sterling@greenpack.co",
    regDate: "2026-07-28",
    status: "UNDER_AUDIT",
    priority: "HIGH",
    capabilitiesRequested: ["Operational Bottleneck Audit", "Gross Margin Sizing", "Regional Scaling"],
    notes: "Factory yield optimization and raw material cost reduction."
  },
  {
    id: "reg-104",
    projectName: "Global Enterprise Risk Architecture",
    domain: "Industries",
    domainIcon: Building2,
    clientName: "Elena Rostova",
    clientEmail: "elena@nimbuscloud.net",
    regDate: "2026-08-03",
    status: "PENDING_REVIEW",
    priority: "URGENT",
    capabilitiesRequested: ["Systemic Optimization", "Cross-Sector Architecture", "Regulatory Risk Matrix"],
    notes: "Multi-stakeholder risk analysis for cloud deployment."
  },
  {
    id: "reg-105",
    projectName: "Scholar Research Capstone Network",
    domain: "Students & Scholars",
    domainIcon: GraduationCap,
    clientName: "Kavya Patel",
    clientEmail: "kavya@scholarexcel.org",
    regDate: "2026-07-31",
    status: "APPROVED",
    priority: "MEDIUM",
    capabilitiesRequested: ["Academic Counseling", "Research Mentorship", "Capstone Strategy"],
    notes: "Mentorship framework for 150 graduate scholars."
  }
];

const INITIAL_REPORTS = [
  {
    id: "rep-001",
    reportName: "EcoFly Medical Drone Market Valuation Report",
    domain: "Startups",
    tags: ["Logistics", "Healthcare"],
    status: "COMPLETED",
    progressPct: 100,
    score: 89,
    auditor: "Dr. Aris Thorne"
  },
  {
    id: "rep-002",
    reportName: "Apex AI Recruiter Tech Vulnerability Teardown",
    domain: "Startups",
    tags: ["HR Tech", "AI Arch"],
    status: "PROCESSED",
    progressPct: 85,
    score: 86,
    auditor: "Sophia Vance"
  },
  {
    id: "rep-003",
    reportName: "GreenPack Gross Margin & Payback Model",
    domain: "MSMEs",
    tags: ["Eco", "Unit Economics"],
    status: "IN_PROGRESS",
    progressPct: 60,
    score: 72,
    auditor: "Marcus Sterling"
  },
  {
    id: "rep-004",
    reportName: "Nimbus Cloud Real-Time GDPR & ISO Audit",
    domain: "Industries",
    tags: ["Cloud", "Compliance"],
    status: "PENDING",
    progressPct: 20,
    score: 54,
    auditor: "Admin Governance"
  }
];

const INITIAL_TICKETS = [
  {
    id: "tkt-01",
    type: "BUSINESS_QUERY",
    title: "Drone Logistics Unit Payback in Tier-2 Hubs",
    clientName: "Dr. Aris Thorne",
    email: "aris.thorne@ecoflydrones.io",
    category: "Financial Viability",
    status: "RESOLVED",
    message: "Can an autonomous drone logistics model for hospital cold-chains achieve positive unit economics in tier-2 cities within 18 months?",
    investigationNote: "Audited against MOD-03 model. Payback period calculated at 18.4 months. GO (89%) verdict issued."
  },
  {
    id: "tkt-02",
    type: "CONTACT_FORM",
    title: "Institutional Partnership Demo & Integration",
    clientName: "Prof. Jonathan Vance",
    email: "j.vance@stanford.edu",
    category: "Institutional Support",
    status: "IN_INVESTIGATION",
    message: "Requesting an executive walkthrough of the Conscious Orbital platform for engineering department leads.",
    investigationNote: "Scheduled initial briefing call with Admin Governance lead."
  },
  {
    id: "tkt-03",
    type: "BUSINESS_QUERY",
    title: "Bio-Polymer EU Directive Compliance",
    clientName: "Marcus Sterling",
    email: "m.sterling@greenpack.co",
    category: "Regulatory & Compliance",
    status: "PENDING",
    message: "What are the primary regulatory compliance barriers for bio-polymer packaging in EU export markets?",
    investigationNote: "Awaiting compliance audit report from MOD-07."
  }
];

export default function AdminDashboard({ onLogout, onGoHome }) {
  // Navigation State
  const [activeNav, setActiveNav] = useState("all-modules");

  // Search & Global state
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Data States
  const [modules, setModules] = useState(INITIAL_10_MODULES);
  const [clientProfiles, setClientProfiles] = useState(INITIAL_CLIENT_PROFILES);
  const [registrations, setRegistrations] = useState(INITIAL_PROJECT_REGISTRATIONS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  // Filters
  const [moduleCategoryFilter, setModuleCategoryFilter] = useState("ALL");
  const [profileStatusFilter, setProfileStatusFilter] = useState("ALL");
  const [domainFilter, setDomainFilter] = useState("ALL");
  const [reportStatusFilter, setReportStatusFilter] = useState("ALL");
  const [ticketFilter, setTicketFilter] = useState("ALL");

  // Modals
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [isAddRegistrationModalOpen, setIsAddRegistrationModalOpen] = useState(false);

  // New Profile Form
  const [newProfile, setNewProfile] = useState({ fullName: "", email: "", company: "", domain: "Startups" });
  // New Registration Form
  const [newReg, setNewReg] = useState({ projectName: "", domain: "Startups", clientName: "", clientEmail: "", notes: "" });

  const handleUpdateModuleStatus = (id, newStatus) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
  };

  const handleUpdateRegistrationStatus = (id, newStatus) => {
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const handleUpdateReportProgress = (id, delta) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== id) return rep;
        const newPct = Math.min(100, Math.max(0, rep.progressPct + delta));
        let newStatus = rep.status;
        if (newPct === 100) newStatus = "COMPLETED";
        else if (newPct > 50) newStatus = "PROCESSED";
        else if (newPct > 0) newStatus = "IN_PROGRESS";
        return { ...rep, progressPct: newPct, status: newStatus };
      })
    );
  };

  const handleUpdateTicketStatus = (id, newStatus, note) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus, investigationNote: note || t.investigationNote } : t))
    );
  };

  const handleCreateProfileSubmit = (e) => {
    e.preventDefault();
    const item = {
      id: `cli-${Date.now()}`,
      fullName: newProfile.fullName,
      email: newProfile.email,
      company: newProfile.company,
      domain: newProfile.domain,
      status: "VERIFIED",
      accountType: "Client",
      phone: "+1 (555) 000-0000",
      location: "Global"
    };
    setClientProfiles([item, ...clientProfiles]);
    setIsAddProfileModalOpen(false);
    setNewProfile({ fullName: "", email: "", company: "", domain: "Startups" });
  };

  const handleCreateRegistrationSubmit = (e) => {
    e.preventDefault();
    const domainIcons = {
      "Students & Scholars": GraduationCap,
      "Educational Institutions": School,
      "MSMEs": Factory,
      "Industries": Building2,
      "Startups": Rocket
    };
    const item = {
      id: `reg-${Date.now()}`,
      projectName: newReg.projectName,
      domain: newReg.domain,
      domainIcon: domainIcons[newReg.domain] || Rocket,
      clientName: newReg.clientName,
      clientEmail: newReg.clientEmail,
      regDate: new Date().toISOString().split("T")[0],
      status: "PENDING_REVIEW",
      priority: "MEDIUM",
      capabilitiesRequested: ["Domain Diagnostic", "Executive Scorecard"],
      notes: newReg.notes
    };
    setRegistrations([item, ...registrations]);
    setIsAddRegistrationModalOpen(false);
    setNewReg({ projectName: "", domain: "Startups", clientName: "", clientEmail: "", notes: "" });
  };

  // Filtered lists
  const filteredModules = modules.filter((m) => {
    const matchesCat = moduleCategoryFilter === "ALL" || m.category === moduleCategoryFilter;
    const matchesQ = searchQuery === "" || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  const filteredProfiles = clientProfiles.filter((p) => {
    const matchesSt = profileStatusFilter === "ALL" || p.status === profileStatusFilter;
    const matchesQ = searchQuery === "" || p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || p.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSt && matchesQ;
  });

  const filteredRegistrations = registrations.filter((r) => {
    const matchesDom = domainFilter === "ALL" || r.domain === domainFilter;
    const matchesQ = searchQuery === "" || r.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || r.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDom && matchesQ;
  });

  const filteredReports = reports.filter((rep) => {
    const matchesSt = reportStatusFilter === "ALL" || rep.status === reportStatusFilter;
    const matchesQ = searchQuery === "" || rep.reportName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSt && matchesQ;
  });

  const filteredTickets = tickets.filter((t) => {
    const matchesType = ticketFilter === "ALL" || (ticketFilter === "QUERY" && t.type === "BUSINESS_QUERY") || (ticketFilter === "CONTACT" && t.type === "CONTACT_FORM") || t.status === ticketFilter;
    const matchesQ = searchQuery === "" || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQ;
  });

  return (
    <div className="min-h-screen bg-[#FAF4E8] text-[#4A0A13] font-sans selection:bg-[#D4AF37] selection:text-[#4A0A13] flex flex-col relative">
      
      {/* Soft Subtle Ambient Background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.06)_0%,transparent_70%)]" />

      {/* ============================================================ */}
      {/* ELEGANT UNIFIED HEADER & NAVBAR                              */}
      {/* ============================================================ */}
      <header className="relative z-30 w-full border-b border-[#D4AF37]/30 bg-[#FAF4E8] px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Admin Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
            <OrbitBrand size={30} />
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-semibold tracking-wider text-[#4A0A13]">
                CONSCIOUS ORBIT
              </span>
              <span className="h-4 w-px bg-[#D4AF37]/50" />
              <span className="text-xs font-medium text-[#7A1C29] bg-[#4A0A13]/5 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                Admin Workspace
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-[#D4AF37]/40 bg-[#FAF4E8] pl-9 pr-4 py-1.5 text-xs text-[#4A0A13] placeholder-[#7A1C29]/40 focus:border-[#4A0A13] focus:outline-none transition"
            />
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="text-xs font-medium text-[#4A0A13] hover:text-[#B8860B] transition cursor-pointer px-3 py-1.5"
            >
              Home
            </button>
            <button
              onClick={onLogout}
              className="rounded-full border border-[#D4AF37] bg-[#4A0A13] hover:bg-[#5C0F1A] px-4 py-1.5 text-xs font-medium text-[#F5D77F] transition cursor-pointer shadow-xs"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navbar Tabs */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-start overflow-x-auto gap-2 no-scrollbar">
          {[
            { id: "all-modules", label: "1. All 10 Modules", count: 10, icon: Layers },
            { id: "client-forms", label: "2. Client Forms & Profiles", count: clientProfiles.length, icon: UserCheck },
            { id: "registrations", label: "3. Registrations (5 Domains)", count: registrations.length, icon: Folder },
            { id: "report-tracking", label: "4. Report Tracking", count: reports.length, icon: Activity },
            { id: "queries-investigation", label: "5. Queries & Investigation", count: tickets.length, icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeNav === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveNav(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#4A0A13] text-[#FAF4E8] border border-[#D4AF37] shadow-xs font-semibold"
                    : "bg-[#FAF4E8] text-[#4A0A13] border border-[#D4AF37]/30 hover:bg-[#F5EAD4]"
                }`}
              >
                <Icon size={14} className={isActive ? "text-[#F5D77F]" : "text-[#D4AF37]"} />
                <span>{tab.label}</span>
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[0.65rem] ${
                  isActive ? "bg-[#FAF4E8]/20 text-[#FAF4E8]" : "bg-[#4A0A13]/10 text-[#4A0A13]"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN ELEGANT WORKSPACE CONTENT                               */}
      {/* ============================================================ */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">

        {/* ============================================================ */}
        {/* WELCOME ADMIN CARD BANNER (LIKE CLIENT WORKSPACE)            */}
        {/* ============================================================ */}
        <div className="relative w-full bg-[#4A0A13] border border-[#D4AF37]/40 rounded-2xl p-6 md:p-7 text-[#FAF4E8] shadow-md overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.18)_0%,transparent_70%)]" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_80%_20%,rgba(245,215,127,0.1)_0%,transparent_60%)]" />
          </div>

          <div className="relative z-10 space-y-3">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 bg-[#FAF4E8] text-[#4A0A13] text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
              <ShieldCheck size={13} className="text-[#800000]" />
              <span>Admin Workspace Governance</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#FAF4E8] tracking-tight leading-tight flex items-center gap-2">
              <span>Welcome back, System Admin!</span>
              <span className="animate-bounce inline-block">👋</span>
            </h2>

            {/* Subtitle */}
            <p className="text-xs md:text-sm text-[#FAF4E8]/85 font-normal max-w-3xl leading-relaxed">
              Master control portal to audit all 10 intelligence modules, manage client profiles, monitor project registrations across 5 core domains, track report progress, and resolve client queries.
            </p>

            {/* Welcome Card Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveNav("all-modules")}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                  activeNav === "all-modules"
                    ? "bg-[#FAF4E8] text-[#4A0A13]"
                    : "bg-[#C89B3C] hover:bg-[#D4AF37] text-[#4A0A13]"
                }`}
              >
                <Layers size={14} />
                <span>10 Intelligence Modules</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddProfileModalOpen(true)}
                className="px-4 py-2 rounded-full border border-[#D4AF37] bg-white/10 hover:bg-white/20 text-[#FAF4E8] font-medium text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} className="text-[#F5D77F]" />
                <span>Create Client Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddRegistrationModalOpen(true)}
                className="px-4 py-2 rounded-full border border-[#D4AF37] bg-white/10 hover:bg-white/20 text-[#FAF4E8] font-medium text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Folder size={14} className="text-[#F5D77F]" />
                <span>Register Project (5 Domains)</span>
              </button>

              {/* Quick Summary Badges */}
              <div className="ml-auto hidden xl:flex items-center gap-4 border-l border-[#D4AF37]/30 pl-4 text-xs">
                <div>
                  <span className="text-[#F5D77F] font-semibold block">10 / 10</span>
                  <span className="text-[#FAF4E8]/70 text-[0.65rem]">Modules Active</span>
                </div>
                <div className="h-6 w-px bg-[#D4AF37]/30" />
                <div>
                  <span className="text-[#F5D77F] font-semibold block">5 Domains</span>
                  <span className="text-[#FAF4E8]/70 text-[0.65rem]">Homepage Tracked</span>
                </div>
                <div className="h-6 w-px bg-[#D4AF37]/30" />
                <div>
                  <span className="text-[#F5D77F] font-semibold block">Operational</span>
                  <span className="text-[#FAF4E8]/70 text-[0.65rem]">System Governance</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* SECTION 1: ALL 10 MODULES                                    */}
        {/* ------------------------------------------------------------ */}
        {activeNav === "all-modules" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h1 className="text-xl font-semibold text-[#4A0A13]">All 10 Intelligence Modules</h1>
                <p className="text-xs text-[#7A1C29]">System intelligence scoring and module governance.</p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {["ALL", "Market Foundation", "Business Viability", "Launch & Execution", "Executive Governance"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setModuleCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                      moduleCategoryFilter === cat
                        ? "bg-[#4A0A13] text-[#F5D77F] border border-[#D4AF37]"
                        : "bg-[#FAF4E8] text-[#4A0A13] border border-[#D4AF37]/30 hover:bg-[#F5EAD4]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredModules.map((mod) => {
                const IconComp = mod.icon;
                return (
                  <div
                    key={mod.id}
                    className="rounded-2xl border border-[#D4AF37]/40 bg-[#FAF4E8] p-5 shadow-xs hover:border-[#D4AF37] transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-[#4A0A13] text-[#F5D77F] flex items-center justify-center">
                            <IconComp size={18} />
                          </div>
                          <div>
                            <span className="text-[0.68rem] text-[#D4AF37] font-medium uppercase tracking-wide">
                              {mod.code}
                            </span>
                            <h3 className="font-semibold text-sm text-[#4A0A13]">{mod.name}</h3>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[0.65rem] font-medium border ${
                            mod.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : mod.status === "IN_PROGRESS"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {mod.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#7A1C29] leading-relaxed">{mod.desc}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#D4AF37]/20 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#7A1C29]">Score</span>
                        <span className="font-medium text-[#4A0A13]">{mod.score} / 100</span>
                      </div>

                      <div className="w-full bg-[#4A0A13]/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#4A0A13] h-1.5 rounded-full"
                          style={{ width: `${mod.score}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => setSelectedModule(mod)}
                          className="flex-1 rounded-full border border-[#D4AF37]/50 bg-[#FAF4E8] hover:bg-[#F5EAD4] py-1 text-xs text-[#4A0A13] font-medium transition cursor-pointer"
                        >
                          View Details
                        </button>
                        <select
                          value={mod.status}
                          onChange={(e) => handleUpdateModuleStatus(mod.id, e.target.value)}
                          className="rounded-full border border-[#D4AF37]/40 bg-[#FAF4E8] px-2 py-1 text-xs text-[#4A0A13] cursor-pointer"
                        >
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="PENDING">PENDING</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 2: CLIENT FORMS & PROFILES                            */}
        {/* ------------------------------------------------------------ */}
        {activeNav === "client-forms" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h1 className="text-xl font-semibold text-[#4A0A13]">Client Profiles &amp; Forms</h1>
                <p className="text-xs text-[#7A1C29]">Manage verified profiles and intake records.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full border border-[#D4AF37]/30 bg-[#FAF4E8] p-1">
                  {["ALL", "VERIFIED", "ACTIVE", "PENDING"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setProfileStatusFilter(st)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                        profileStatusFilter === st
                          ? "bg-[#4A0A13] text-[#FAF4E8]"
                          : "text-[#4A0A13] hover:bg-[#F5EAD4]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsAddProfileModalOpen(true)}
                  className="rounded-full border border-[#D4AF37] bg-[#4A0A13] hover:bg-[#5C0F1A] px-4 py-1.5 text-xs font-medium text-[#F5D77F] transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Add Profile</span>
                </button>
              </div>
            </div>

            {/* Profiles Table */}
            <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#FAF4E8] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#4A0A13] text-[#FAF4E8] font-medium text-[0.7rem] uppercase">
                  <tr>
                    <th className="p-3.5">Client</th>
                    <th className="p-3.5">Company</th>
                    <th className="p-3.5">Domain</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/20 text-[#4A0A13]">
                  {filteredProfiles.map((prof) => (
                    <tr key={prof.id} className="hover:bg-[#F5EAD4]/40 transition">
                      <td className="p-3.5">
                        <div className="font-semibold text-sm text-[#4A0A13]">{prof.fullName}</div>
                        <div className="text-[0.68rem] text-[#7A1C29]">{prof.email}</div>
                      </td>
                      <td className="p-3.5 font-medium">{prof.company}</td>
                      <td className="p-3.5 text-[#7A1C29]">{prof.domain}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] border border-[#D4AF37]/40 bg-[#4A0A13]/5 text-[#4A0A13] font-medium">
                          {prof.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedProfile(prof)}
                          className="rounded-full border border-[#D4AF37] px-3 py-1 text-xs text-[#4A0A13] hover:bg-[#4A0A13] hover:text-[#FAF4E8] transition cursor-pointer"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 3: REGISTRATIONS (5 DOMAINS)                          */}
        {/* ------------------------------------------------------------ */}
        {activeNav === "registrations" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h1 className="text-xl font-semibold text-[#4A0A13]">Project Registrations</h1>
                <p className="text-xs text-[#7A1C29]">Domain project registrations across 5 core verticals.</p>
              </div>

              <button
                onClick={() => setIsAddRegistrationModalOpen(true)}
                className="rounded-full border border-[#D4AF37] bg-[#4A0A13] hover:bg-[#5C0F1A] px-4 py-1.5 text-xs font-medium text-[#F5D77F] transition cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
              >
                <Plus size={14} />
                <span>New Registration</span>
              </button>
            </div>

            {/* 5 Domain Selector */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {[
                "ALL",
                "Students & Scholars",
                "Educational Institutions",
                "MSMEs",
                "Industries",
                "Startups"
              ].map((dom) => (
                <button
                  key={dom}
                  onClick={() => setDomainFilter(dom)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    domainFilter === dom
                      ? "bg-[#4A0A13] text-[#FAF4E8] border border-[#D4AF37]"
                      : "bg-[#FAF4E8] text-[#4A0A13] border border-[#D4AF37]/30 hover:bg-[#F5EAD4]"
                  }`}
                >
                  {dom === "ALL" ? "All 5 Domains" : dom}
                </button>
              ))}
            </div>

            {/* Registrations List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRegistrations.map((reg) => {
                const DomIcon = reg.domainIcon || Building2;
                return (
                  <div
                    key={reg.id}
                    className="rounded-2xl border border-[#D4AF37]/40 bg-[#FAF4E8] p-5 shadow-xs hover:border-[#D4AF37] transition space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-[#4A0A13] text-[#F5D77F] flex items-center justify-center">
                          <DomIcon size={18} />
                        </div>
                        <div>
                          <span className="text-[0.65rem] text-[#D4AF37] font-medium uppercase">{reg.domain}</span>
                          <h3 className="font-semibold text-sm text-[#4A0A13]">{reg.projectName}</h3>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] border border-[#D4AF37]/40 bg-[#4A0A13]/5 text-[#4A0A13] font-medium">
                        {reg.status}
                      </span>
                    </div>

                    <div className="text-xs text-[#7A1C29] space-y-1">
                      <p>Lead: <strong className="text-[#4A0A13]">{reg.clientName}</strong> ({reg.clientEmail})</p>
                      <p className="italic">"{reg.notes}"</p>
                    </div>

                    <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleUpdateRegistrationStatus(reg.id, "APPROVED")}
                        className="rounded-full bg-emerald-700 text-white px-3 py-1 text-xs font-medium transition cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateRegistrationStatus(reg.id, "UNDER_AUDIT")}
                        className="rounded-full border border-[#D4AF37] bg-[#4A0A13] text-[#F5D77F] px-3 py-1 text-xs font-medium transition cursor-pointer"
                      >
                        Audit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 4: REPORT TRACKING                                    */}
        {/* ------------------------------------------------------------ */}
        {activeNav === "report-tracking" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h1 className="text-xl font-semibold text-[#4A0A13]">Report Progress Tracking</h1>
                <p className="text-xs text-[#7A1C29]">Monitor report generation status and scores.</p>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {["ALL", "PENDING", "IN_PROGRESS", "PROCESSED", "COMPLETED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setReportStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                      reportStatusFilter === st
                        ? "bg-[#4A0A13] text-[#FAF4E8]"
                        : "bg-[#FAF4E8] text-[#4A0A13] border border-[#D4AF37]/30 hover:bg-[#F5EAD4]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredReports.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-2xl border border-[#D4AF37]/40 bg-[#FAF4E8] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[0.65rem] text-[#D4AF37] font-medium uppercase">{rep.domain} · {rep.status}</span>
                    <h3 className="font-semibold text-sm text-[#4A0A13]">{rep.reportName}</h3>
                    <p className="text-xs text-[#7A1C29]">Auditor: {rep.auditor}</p>
                  </div>

                  <div className="w-full md:w-64 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#7A1C29]">Progress</span>
                      <span className="font-medium text-[#4A0A13]">{rep.progressPct}%</span>
                    </div>
                    <div className="w-full bg-[#4A0A13]/10 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#4A0A13] h-1.5 rounded-full" style={{ width: `${rep.progressPct}%` }} />
                    </div>

                    <div className="flex justify-end gap-1 pt-1">
                      <button
                        onClick={() => handleUpdateReportProgress(rep.id, -20)}
                        className="h-6 w-6 rounded-full border border-[#D4AF37]/40 text-xs font-bold flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleUpdateReportProgress(rep.id, 20)}
                        className="h-6 w-6 rounded-full bg-[#4A0A13] text-[#FAF4E8] text-xs font-bold flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 5: QUERIES AND INVESTIGATION                          */}
        {/* ------------------------------------------------------------ */}
        {activeNav === "queries-investigation" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h1 className="text-xl font-semibold text-[#4A0A13]">Queries &amp; Investigation</h1>
                <p className="text-xs text-[#7A1C29]">Manage client business questions and contact form inquiries.</p>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: "ALL", label: "All" },
                  { id: "QUERY", label: "Business Queries" },
                  { id: "CONTACT", label: "Get In Touch Forms" },
                  { id: "RESOLVED", label: "Resolved" }
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => setTicketFilter(flt.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                      ticketFilter === flt.id
                        ? "bg-[#4A0A13] text-[#FAF4E8]"
                        : "bg-[#FAF4E8] text-[#4A0A13] border border-[#D4AF37]/30 hover:bg-[#F5EAD4]"
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredTickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="rounded-2xl border border-[#D4AF37]/40 bg-[#FAF4E8] p-5 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[0.65rem] text-[#D4AF37] font-medium uppercase">
                        {tkt.type === "BUSINESS_QUERY" ? "Business Query" : "Get In Touch Form"}
                      </span>
                      <h3 className="font-semibold text-sm text-[#4A0A13]">{tkt.title}</h3>
                      <p className="text-xs text-[#7A1C29]">{tkt.clientName} ({tkt.email})</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] border border-[#D4AF37]/40 bg-[#4A0A13]/5 text-[#4A0A13]">
                      {tkt.status}
                    </span>
                  </div>

                  <div className="bg-[#4A0A13]/5 p-3 rounded-xl text-xs text-[#4A0A13]">
                    {tkt.message}
                  </div>

                  <div className="text-xs text-[#7A1C29] bg-[#FAF4E8] border border-[#D4AF37]/30 p-3 rounded-xl italic">
                    Findings: {tkt.investigationNote}
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setSelectedTicket(tkt)}
                      className="rounded-full border border-[#D4AF37] bg-[#4A0A13] text-[#F5D77F] px-4 py-1 text-xs font-medium transition cursor-pointer"
                    >
                      Respond &amp; Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </main>

      {/* Simple Modals */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#D4AF37] bg-[#FAF4E8] p-5 shadow-xl space-y-3">
            <h2 className="text-lg font-semibold text-[#4A0A13]">{selectedModule.name}</h2>
            <p className="text-xs text-[#7A1C29]">{selectedModule.desc}</p>
            <div className="text-right pt-2">
              <button onClick={() => setSelectedModule(null)} className="rounded-full bg-[#4A0A13] text-[#FAF4E8] px-4 py-1 text-xs font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#D4AF37] bg-[#FAF4E8] p-5 shadow-xl space-y-3 text-xs text-[#4A0A13]">
            <h2 className="text-lg font-semibold">{selectedProfile.fullName}</h2>
            <p><strong>Company:</strong> {selectedProfile.company}</p>
            <p><strong>Email:</strong> {selectedProfile.email}</p>
            <p><strong>Domain:</strong> {selectedProfile.domain}</p>
            <div className="text-right pt-2">
              <button onClick={() => setSelectedProfile(null)} className="rounded-full bg-[#4A0A13] text-[#FAF4E8] px-4 py-1 text-xs font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#D4AF37] bg-[#FAF4E8] p-5 shadow-xl space-y-3 text-xs">
            <h2 className="text-base font-semibold text-[#4A0A13]">{selectedTicket.title}</h2>
            <textarea
              id="simpleNoteInput"
              rows={3}
              defaultValue={selectedTicket.investigationNote}
              className="w-full rounded-xl border border-[#D4AF37]/50 p-2.5 bg-[#FAF4E8] text-xs text-[#4A0A13]"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setSelectedTicket(null)} className="px-3 py-1 text-xs">Cancel</button>
              <button
                onClick={() => {
                  const val = document.getElementById("simpleNoteInput").value;
                  handleUpdateTicketStatus(selectedTicket.id, "RESOLVED", val);
                  setSelectedTicket(null);
                }}
                className="rounded-full bg-[#4A0A13] text-[#F5D77F] px-4 py-1 text-xs font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <form onSubmit={handleCreateProfileSubmit} className="w-full max-w-md rounded-2xl border border-[#D4AF37] bg-[#FAF4E8] p-5 shadow-xl space-y-3 text-xs">
            <h2 className="text-base font-semibold text-[#4A0A13]">Add Client Profile</h2>
            <input required type="text" placeholder="Full Name" value={newProfile.fullName} onChange={(e) => setNewProfile({ ...newProfile, fullName: e.target.value })} className="w-full rounded-xl border border-[#D4AF37]/40 p-2 bg-[#FAF4E8]" />
            <input required type="email" placeholder="Email" value={newProfile.email} onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })} className="w-full rounded-xl border border-[#D4AF37]/40 p-2 bg-[#FAF4E8]" />
            <input required type="text" placeholder="Company" value={newProfile.company} onChange={(e) => setNewProfile({ ...newProfile, company: e.target.value })} className="w-full rounded-xl border border-[#D4AF37]/40 p-2 bg-[#FAF4E8]" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsAddProfileModalOpen(false)} className="px-3 py-1">Cancel</button>
              <button type="submit" className="rounded-full bg-[#4A0A13] text-[#F5D77F] px-4 py-1 font-medium">Save</button>
            </div>
          </form>
        </div>
      )}

      {isAddRegistrationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <form onSubmit={handleCreateRegistrationSubmit} className="w-full max-w-md rounded-2xl border border-[#D4AF37] bg-[#FAF4E8] p-5 shadow-xl space-y-3 text-xs">
            <h2 className="text-base font-semibold text-[#4A0A13]">New Project Registration</h2>
            <input required type="text" placeholder="Project Name" value={newReg.projectName} onChange={(e) => setNewReg({ ...newReg, projectName: e.target.value })} className="w-full rounded-xl border border-[#D4AF37]/40 p-2 bg-[#FAF4E8]" />
            <select value={newReg.domain} onChange={(e) => setNewReg({ ...newReg, domain: e.target.value })} className="w-full rounded-xl border border-[#D4AF37]/40 p-2 bg-[#FAF4E8]">
              <option value="Startups">Startups</option>
              <option value="MSMEs">MSMEs</option>
              <option value="Industries">Industries</option>
              <option value="Educational Institutions">Educational Institutions</option>
              <option value="Students & Scholars">Students & Scholars</option>
            </select>
            <input required type="text" placeholder="Client Name" value={newReg.clientName} onChange={(e) => setNewReg({ ...newReg, clientName: e.target.value })} className="w-full rounded-xl border border-[#D4AF37]/40 p-2 bg-[#FAF4E8]" />
            <input required type="email" placeholder="Client Email" value={newReg.clientEmail} onChange={(e) => setNewReg({ ...newReg, clientEmail: e.target.value })} className="w-full rounded-xl border border-[#D4AF37]/40 p-2 bg-[#FAF4E8]" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsAddRegistrationModalOpen(false)} className="px-3 py-1">Cancel</button>
              <button type="submit" className="rounded-full bg-[#4A0A13] text-[#F5D77F] px-4 py-1 font-medium">Save</button>
            </div>
          </form>
        </div>
      )}

      <footer className="py-4 text-center text-[0.7rem] text-[#7A1C29] font-medium border-t border-[#D4AF37]/20">
        © 2026 Conscious Orbit · Admin Workspace
      </footer>

    </div>
  );
}
