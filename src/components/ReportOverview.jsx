import React from "react";
import { motion } from "framer-motion";
import { X, Download, FileText, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { downloadReportDoc } from "../reportDoc.js";

/* ============================================================
   REPORT OVERVIEW — on-site preview of the generated strategy
   report. Mirrors the .doc's sections so the user can read the
   verdict first and download the Word document only if they
   want it, from the download box at the top.
   ============================================================ */

const MODULE_LABELS = {
  customerDiscovery: "MOD-01 Customer Discovery",
  profiling: "MOD-02 Profiling",
  marketSize: "MOD-03 Market Size",
  feasibility: "MOD-04 Feasibility",
  pricing: "MOD-05 Pricing",
  marketResearch: "MOD-06 Market Research",
  industryReport: "MOD-07 Industry Report",
  businessModelValidation: "MOD-08 Business Model",
  gtm: "MOD-09 Go-To-Market",
  okr: "MOD-10 OKR",
};

function Row({ label, value }) {
  if (!value || (typeof value === "string" && !value.trim())) return null;
  return (
    <div className="flex gap-3 text-xs">
      <span className="w-40 shrink-0 font-bold text-[#8C6D58]">{label}</span>
      <span className="text-[#4A0A13]">{value}</span>
    </div>
  );
}

function Section({ title, children }) {
  const rows = React.Children.toArray(children).filter(Boolean);
  if (!rows.length) return null;
  return (
    <div className="space-y-2">
      <h3 className="font-mono text-[0.68rem] uppercase font-bold text-[#B8860B] tracking-wider border-b border-[#D4AF37]/30 pb-1">
        {title}
      </h3>
      <div className="space-y-1.5">{rows}</div>
    </div>
  );
}

export default function ReportOverview({ report, moduleResults = {}, onClose }) {
  if (!report) return null;

  const clusters = report.clusters || {};
  const market = clusters.market || {};
  const viability = clusters.viability || {};
  const launch = clusters.launch || {};
  const client = typeof report.client === "object" && report.client ? report.client : {};
  const verdict = moduleResults.industryReport?.output?.decision || null;

  /* Reports awaiting admin approval hide the verdict, scores and download —
     the admin reviews and publishes before the client sees the result. */
  const pending = Boolean(report.status) && report.status !== "PUBLISHED";

  const score = report.score ?? 0;
  const decisionLabel =
    report.decision === 1 ? "GO / PROCEED" : report.decision === 0 ? "PIVOT" : "PENDING";
  const decisionTone =
    report.decision === 1
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : report.decision === 0
      ? "bg-red-100 text-red-800 border-red-300"
      : "bg-amber-100 text-amber-800 border-amber-300";

  const scoredModules = Object.entries(MODULE_LABELS).filter(([key]) => moduleResults[key]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl border border-[#D4AF37] bg-[#FAF4E8] p-6 sm:p-8 shadow-2xl space-y-6 text-[#4A0A13]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] uppercase tracking-wider font-mono">
              <FileText size={14} />
              <span>Executive Strategy Report</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#400A12]">{report.name}</h2>
            <p className="text-xs text-[#7A1C29] font-mono">
              {String(report.vertical || "startups").toUpperCase()} · {report.status || "PUBLISHED"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F5EAD4] text-[#8C6D58] hover:text-[#4A0A13] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Awaiting-approval banner replaces the result until an admin publishes */}
        {pending && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
            <p className="font-bold mb-1">⏳ Awaiting admin approval</p>
            <p>
              Your intake has been analysed across all ten intelligence modules. An administrator is
              reviewing the result — the Orbital Score, verdict and downloadable report unlock here as
              soon as it is approved.
            </p>
          </div>
        )}

        {/* Score + verdict strip */}
        {!pending && (
        <div className="rounded-2xl border-2 border-[#D4AF37] bg-white p-5 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="text-center">
            <p className="font-mono text-[0.65rem] uppercase font-bold text-[#B8860B] tracking-wider">Conscious Orbital Score</p>
            <p className="font-serif text-4xl font-extrabold text-[#B8860B]">{score}<span className="text-lg text-[#8C6D58]"> / 100</span></p>
          </div>
          <span className={`px-3 py-1 rounded-full border text-xs font-extrabold ${decisionTone}`}>
            {decisionLabel}
          </span>
          {verdict?.headline && (
            <p className="text-xs italic text-[#7A1C29] flex-1 min-w-52">"{verdict.headline}"</p>
          )}
        </div>
        )}

        {/* Download box */}
        {!pending && (
        <div className="rounded-2xl border border-[#D4AF37]/60 bg-[#F5EAD4]/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <FileText size={26} className="text-[#B8860B] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#400A12]">Full report as Word document</p>
              <p className="text-[0.7rem] text-[#7A1C29]">
                Everything below plus module findings and history, formatted for sharing — opens in MS Word.
              </p>
            </div>
          </div>
          <button
            onClick={() => downloadReportDoc(report, moduleResults)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#400A12] hover:bg-[#5C0F1A] text-[#F5D77F] font-extrabold text-xs shadow-lg transition cursor-pointer border border-[#D4AF37]/40 shrink-0"
          >
            <Download size={14} />
            <span>Download .doc</span>
          </button>
        </div>
        )}

        {/* Executive verdict */}
        {!pending && verdict && (
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-white p-5 space-y-3">
            <h3 className="font-mono text-[0.68rem] uppercase font-bold text-[#B8860B] tracking-wider">Executive Verdict</h3>
            {verdict.rationale && <p className="text-xs text-[#4A0A13]">{verdict.rationale}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {(verdict.strengths || []).length > 0 && (
                <div className="space-y-1.5">
                  <p className="font-bold text-emerald-700 flex items-center gap-1"><CheckCircle2 size={12} /> Strengths</p>
                  {verdict.strengths.map((s, i) => <p key={i} className="text-[#4A0A13]">• {s}</p>)}
                </div>
              )}
              {(verdict.risks || []).length > 0 && (
                <div className="space-y-1.5">
                  <p className="font-bold text-red-700 flex items-center gap-1"><AlertTriangle size={12} /> Risks</p>
                  {verdict.risks.map((s, i) => <p key={i} className="text-[#4A0A13]">• {s}</p>)}
                </div>
              )}
              {(verdict.nextActions || []).length > 0 && (
                <div className="space-y-1.5">
                  <p className="font-bold text-[#B8860B] flex items-center gap-1"><ArrowRight size={12} /> Next Actions</p>
                  {verdict.nextActions.map((s, i) => <p key={i} className="text-[#4A0A13]">• {s}</p>)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Module scores */}
        {!pending && scoredModules.length > 0 && (
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-white p-5 space-y-3">
            <h3 className="font-mono text-[0.68rem] uppercase font-bold text-[#B8860B] tracking-wider">
              Intelligence Module Scores ({scoredModules.length}/10)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scoredModules.map(([key, label]) => {
                const s = moduleResults[key]?.score;
                return (
                  <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-[#D4AF37]/30 bg-[#FAF4E8] px-3 py-2">
                    <span className="text-xs font-medium text-[#4A0A13]">{label}</span>
                    <div className="flex items-center gap-2 w-28 shrink-0">
                      <div className="flex-1 bg-[#4A0A13]/10 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#B8860B] h-1.5 rounded-full" style={{ width: `${s ?? 0}%` }} />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#400A12]">{s ?? "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* How the score was composed — weights and contributions */}
        {!pending && (moduleResults.industryReport?.output?.contributions || []).length > 0 && (
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-white p-5 space-y-3">
            <h3 className="font-mono text-[0.68rem] uppercase font-bold text-[#B8860B] tracking-wider">
              Score Composition — how the Orbital Score is weighted
            </h3>
            <div className="space-y-1.5">
              {moduleResults.industryReport.output.contributions.map((c) => (
                <div key={c.module} className="flex items-center gap-3 text-xs">
                  <span className="w-44 shrink-0 text-[#4A0A13]">{MODULE_LABELS[c.module] || c.module}</span>
                  <span className="font-mono text-[#8C6D58] w-20">{Math.round(c.weight * 100)}% weight</span>
                  <div className="flex-1 bg-[#4A0A13]/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#B8860B] h-1.5 rounded-full" style={{ width: `${c.score}%` }} />
                  </div>
                  <span className="font-mono font-bold text-[#400A12] w-16 text-right">+{c.weightedContribution} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What was compared — competitors and external data sources */}
        {!pending && (moduleResults.pricing || moduleResults.marketResearch) && (
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-white p-5 space-y-4">
            <h3 className="font-mono text-[0.68rem] uppercase font-bold text-[#B8860B] tracking-wider">
              Data Sources & Comparisons used in this report
            </h3>

            {moduleResults.pricing?.output && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#4A0A13]">
                  Pricing benchmark — your price {moduleResults.pricing.output.currency} {moduleResults.pricing.output.ourPrice}{" "}
                  vs a market median of {moduleResults.pricing.output.currency} {moduleResults.pricing.output.market?.median}{" "}
                  ({moduleResults.pricing.output.position?.replace(/_/g, " ")},{" "}
                  {moduleResults.pricing.output.deltaFromMedianPercent}% from median)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-[#8C6D58] font-mono text-[0.65rem] uppercase">
                        <th className="py-1 pr-3">Compared against</th>
                        <th className="py-1 pr-3">Monthly price</th>
                        <th className="py-1">Vs us</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(moduleResults.pricing.output.competitors || []).map((c) => (
                        <tr key={c.name} className="border-t border-[#D4AF37]/20 text-[#4A0A13]">
                          <td className="py-1.5 pr-3 font-medium">{c.name}</td>
                          <td className="py-1.5 pr-3 font-mono">{moduleResults.pricing.output.currency} {c.monthlyPrice}</td>
                          <td className="py-1.5">{c.cheaperThanUs ? "cheaper" : "pricier"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {moduleResults.marketResearch?.output && (() => {
              const mr = moduleResults.marketResearch.output;
              return (
                <div className="space-y-1.5 text-xs text-[#4A0A13]">
                  <p className="font-bold">
                    Competitive landscape — {mr.competition?.total ?? 0} competitor(s), market {mr.competition?.intensity?.toLowerCase()}
                  </p>
                  {(mr.competition?.known || []).length > 0 && (
                    <p><span className="text-[#8C6D58]">Declared by you:</span> {mr.competition.known.join(", ")}</p>
                  )}
                  {(mr.competition?.discovered || []).length > 0 && (
                    <p><span className="text-[#8C6D58]">Discovered via domain intelligence:</span> {mr.competition.discovered.join(", ")}</p>
                  )}
                  {(mr.keywords?.targeted || []).length > 0 && (
                    <p>
                      <span className="text-[#8C6D58]">Keywords compared:</span> {mr.keywords.targeted.join(", ")}
                      {(mr.keywords?.unclaimed || []).length > 0 && ` — ${mr.keywords.unclaimed.length} show whitespace`}
                    </p>
                  )}
                  <p className="text-[0.68rem] text-[#8C6D58] italic">
                    Source: {mr.spyfu?.live ? "Live SpyFu competitor intelligence." : "SpyFu integration (placeholder data — no credentials configured)."}
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Intake sections — mirrors the .doc */}
        <div className="rounded-2xl border border-[#D4AF37]/40 bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <Section title="1. Executive & Venture Profile">
            <Row label="Company" value={client.company || report.name} />
            <Row label="Industry" value={client.industry || (report.tags || [])[0]} />
            <Row label="Stage" value={client.stage} />
            <Row label="Business Model" value={client.businessModel} />
            <Row label="Geography" value={client.geography || launch.geography} />
            <Row label="Contact" value={client.contact} />
            <Row label="Capital Ask" value={launch.ask} />
          </Section>
          <Section title="2. Market Opportunity">
            <Row label="Core Problem" value={market.problem} />
            <Row label="Pain Point" value={market.pain} />
            <Row label="ICP" value={market.icp} />
            <Row label="Willingness To Pay" value={market.wtp} />
          </Section>
          <Section title="3. Business Economics">
            <Row label="Revenue Model" value={viability.revenue} />
            <Row label="Gross Margin" value={viability.margin} />
            <Row label="Cost Drivers" value={viability.costs} />
            <Row label="Breakeven" value={viability.breakeven} />
          </Section>
          <Section title="4. Launch & GTM">
            <Row label="GTM Strategy" value={launch.gtm} />
            <Row label="Milestones" value={launch.milestones} />
          </Section>
        </div>
      </motion.div>
    </div>
  );
}
