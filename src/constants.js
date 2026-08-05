import { GraduationCap, Building2, Factory, Rocket } from 'lucide-react';

/* ============================================================
   SHARED DOMAIN CONSTANTS
   Single source of truth — imported by App.jsx and Homepage.jsx.
   ============================================================ */

// `short` is the compact label used on the marketing homepage cards;
// `name` is the full label used inside the dashboard.
export const VERTICALS = [
  { id: 'students',     name: 'Students & Scholars',      short: 'Students & Scholars', icon: GraduationCap, desc: 'Academic counseling, research mentorship & project management' },
  { id: 'institutions', name: 'Educational Institutions', short: 'Institutions',        icon: Building2,     desc: 'Curriculum development, faculty training & org diagnosis' },
  { id: 'msmes',        name: 'MSMEs',                    short: 'MSMEs',               icon: Factory,       desc: 'Small-team operations focused on operational bottlenecks' },
  { id: 'industries',   name: 'Industries',               short: 'Industries',          icon: Building2,     desc: 'Large-scale systemic optimization & multi-stakeholder strategy' },
  { id: 'startups',     name: 'Startups',                 short: 'Startups',            icon: Rocket,        desc: 'Idea-to-execution journeys & market validation' },
];

export const REPORT_STATUSES = ['RECEIVED', 'PENDING', 'PROCESSED', 'PUBLISHED'];
