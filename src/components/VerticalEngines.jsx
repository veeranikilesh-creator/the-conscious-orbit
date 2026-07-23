import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Factory, Building2,
  Clock, PiggyBank, ChevronRight,
} from 'lucide-react';
import { GlassPanel, Field, Input, Select } from './ui.jsx';

/* ============================================================
   VERTICAL ENGINES — Ultra-Luxury Red & Gold Function Modules
   ============================================================ */

/* ---------------- A. STARTUP — MARKET SIZING ENGINE ---------------- */
export function StartupMarketEngine() {
  const [tam, setTam] = useState(50000000);
  const [samPct, setSamPct] = useState(18);
  const [channels, setChannels] = useState({ direct: 40, partner: 25, online: 35 });
  const [conversion, setConversion] = useState(8);

  const sam = useMemo(() => Math.round(tam * (samPct / 100)), [tam, samPct]);
  const channelWeight = (channels.direct + channels.partner + channels.online) / 100;
  const som = useMemo(
    () => Math.round(sam * channelWeight * (conversion / 100)),
    [sam, channelWeight, conversion]
  );
  const feasibility = Math.min(100, Math.round(40 + (som / Math.max(tam, 1)) * 1000));

  return (
    <div className="space-y-6">
      <EngineHead
        icon={TrendingUp}
        kicker="Startup Vertical · Strategic Market Intelligence"
        title="Market Sizing & Conversion Engine"
        desc="Calculate Total, Serviceable, and Obtainable markets, then model funnel conversion across sales channels."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Inputs */}
        <GlassPanel className="space-y-4 p-6 border-[#D4AF37]/50 bg-[#350310]">
          <Field label="Total Addressable Market (TAM) — USD">
            <Input type="number" value={tam} onChange={(e) => setTam(parseInt(e.target.value) || 0)} />
          </Field>
          <Field label={`Serviceable % of TAM — ${samPct}%`} hint="Share of TAM your model can actually reach">
            <input type="range" min={1} max={100} value={samPct} onChange={(e) => setSamPct(parseInt(e.target.value))} className="w-full accent-[#E6C878]" />
          </Field>

          <div className="space-y-2 pt-2">
            <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-[#E6C878]">Channel Mix Split</span>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Direct">
                <Input type="number" value={channels.direct} onChange={(e) => setChannels({ ...channels, direct: parseInt(e.target.value) || 0 })} />
              </Field>
              <Field label="Partner">
                <Input type="number" value={channels.partner} onChange={(e) => setChannels({ ...channels, partner: parseInt(e.target.value) || 0 })} />
              </Field>
              <Field label="Online">
                <Input type="number" value={channels.online} onChange={(e) => setChannels({ ...channels, online: parseInt(e.target.value) || 0 })} />
              </Field>
            </div>
          </div>

          <Field label={`Conversion Rate — ${conversion}%`} hint="Leads to closed customers">
            <input type="range" min={1} max={30} value={conversion} onChange={(e) => setConversion(parseInt(e.target.value))} className="w-full accent-[#E6C878]" />
          </Field>
        </GlassPanel>

        {/* Output metrics */}
        <GlassPanel className="space-y-5 p-6 border-[#D4AF37]/60 bg-gradient-to-br from-[#4C0519]/90 via-[#3B0413]/90 to-[#2A020D]/95 text-white">
          <h4 className="font-sans text-base font-bold text-[#FFFFFF]">Converted Market Sizing</h4>

          <div className="space-y-3">
            <MetricBar label="TAM (Total Addressable)" val={`$${tam.toLocaleString()}`} pct={100} color="bg-[#E6C878]" />
            <MetricBar label="SAM (Serviceable)" val={`$${sam.toLocaleString()}`} pct={samPct} color="bg-[#D4AF37]" />
            <MetricBar label="SOM (Obtainable)" val={`$${som.toLocaleString()}`} pct={Math.max(3, Math.round((som / Math.max(tam, 1)) * 100))} color="bg-[#10B981]" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="rounded-xl border border-[#D4AF37]/40 bg-[#350310] p-3 text-center">
              <span className="font-mono text-[0.6rem] font-bold uppercase tracking-wider text-[#FECDD3]">Market Feasibility</span>
              <p className="font-sans text-2xl font-bold text-[#E6C878]">{feasibility}<span className="text-xs text-[#FECDD3]">/100</span></p>
            </div>
            <div className="rounded-xl border border-[#D4AF37]/40 bg-[#350310] p-3 text-center">
              <span className="font-mono text-[0.6rem] font-bold uppercase tracking-wider text-[#FECDD3]">Recommendation</span>
              <p className="font-mono text-xs font-bold text-[#34D399] mt-1">{feasibility >= 60 ? '1 · Proceed' : '0 · Pivot'}</p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

/* ---------------- B. MSME — BOTTLENECK OPTIMIZER ---------------- */
export function MsmeOptimizationEngine() {
  const [bottleneck, setBottleneck] = useState('inventory');
  const [delayDays, setDelayDays] = useState(14);
  const [monthlySpend, setMonthlySpend] = useState(25000);

  const potentialSavings = Math.round(monthlySpend * 0.28);
  const paybackMonths = Math.max(2, Math.round(12 - delayDays * 0.4));

  return (
    <div className="space-y-6">
      <EngineHead
        icon={Factory}
        kicker="MSME Vertical · Operational Optimization"
        title="Bottleneck & Cost Diagnostic Engine"
        desc="Isolate operational friction points, calculate downtime costs, and map lean optimization trajectories."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <GlassPanel className="space-y-4 p-6 border-[#D4AF37]/50 bg-[#350310]">
          <Field label="Primary Operational Bottleneck">
            <Select value={bottleneck} onChange={(e) => setBottleneck(e.target.value)}>
              <option value="inventory">Inventory Holding & Stockout Delays</option>
              <option value="logistics">Last-Mile Freight & Logistics Spikes</option>
              <option value="manual">Manual Data Entry & Invoice Reconciliation</option>
              <option value="quality">Quality Rejection Rate in Production</option>
            </Select>
          </Field>
          <Field label={`Average Delay per Cycle — ${delayDays} Days`}>
            <input type="range" min={1} max={60} value={delayDays} onChange={(e) => setDelayDays(parseInt(e.target.value))} className="w-full accent-[#E6C878]" />
          </Field>
          <Field label="Monthly Operational Spend (USD)">
            <Input type="number" value={monthlySpend} onChange={(e) => setMonthlySpend(parseInt(e.target.value) || 0)} />
          </Field>
        </GlassPanel>

        <GlassPanel className="space-y-4 p-6 border-[#D4AF37]/60 bg-gradient-to-br from-[#4C0519]/90 via-[#3B0413]/90 to-[#2A020D]/95 text-white">
          <h4 className="font-sans text-base font-bold text-[#FFFFFF]">Diagnostic Findings</h4>

          <div className="grid grid-cols-2 gap-3">
            <SavingsCard icon={PiggyBank} label="Potential Savings / Mo" value={`$${potentialSavings.toLocaleString()}`} />
            <SavingsCard icon={Clock} label="Estimated Payback" value={`${paybackMonths} Mo`} tone="rose" />
          </div>

          <div className="space-y-2.5 pt-2">
            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-[#E6C878]">Recommended Actions</span>
            <RoadmapPhase phase="Phase 1: Zero-Waste Audit" desc="Audit current inventory hold times to eliminate redundant buffer stock." />
            <RoadmapPhase phase="Phase 2: Digital Dispatch" desc="Automate invoice & order dispatch via lightweight webhook integrations." />
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

/* ---------------- C. INDUSTRY — SOP & DEFECT ENGINE ---------------- */
export function IndustryAnalysisEngine() {
  const [defectRate, setDefectRate] = useState(4.2);
  const [outputVolume, setOutputVolume] = useState(150000);

  const defectUnits = Math.round(outputVolume * (defectRate / 100));
  const sigmaLevel = Math.max(2.1, (6.0 - defectRate * 0.6).toFixed(1));

  return (
    <div className="space-y-6">
      <EngineHead
        icon={Building2}
        kicker="Industry Vertical · Scale Systemic Optimization"
        title="Defect & Quality Audit Engine"
        desc="Systemic analysis for large-scale operations — tracking defect density, Six Sigma compliance, and throughput."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <GlassPanel className="space-y-4 p-6 border-[#D4AF37]/50 bg-[#350310]">
          <Field label="Annual Output Volume (Units)">
            <Input type="number" value={outputVolume} onChange={(e) => setOutputVolume(parseInt(e.target.value) || 0)} />
          </Field>
          <Field label={`Current Defect Rate — ${defectRate}%`}>
            <input type="range" min={0.1} max={15} step={0.1} value={defectRate} onChange={(e) => setDefectRate(parseFloat(e.target.value))} className="w-full accent-[#E6C878]" />
          </Field>
        </GlassPanel>

        <GlassPanel className="space-y-4 p-6 border-[#D4AF37]/60 bg-gradient-to-br from-[#4C0519]/90 via-[#3B0413]/90 to-[#2A020D]/95 text-white">
          <h4 className="font-sans text-base font-bold text-[#FFFFFF]">Systemic Quality Index</h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#D4AF37]/40 bg-[#350310] p-3 text-center">
              <span className="font-mono text-[0.6rem] font-bold uppercase tracking-wider text-[#FECDD3]">Defect Units / Year</span>
              <p className="font-sans text-xl font-bold text-[#E6C878]">{defectUnits.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-[#D4AF37]/40 bg-[#350310] p-3 text-center">
              <span className="font-mono text-[0.6rem] font-bold uppercase tracking-wider text-[#FECDD3]">Estimated Sigma Level</span>
              <p className="font-sans text-xl font-bold text-[#E6C878]">{sigmaLevel} σ</p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

/* ---------- Local Shared Helpers ---------- */
function EngineHead({ icon: Icon, kicker, title, desc }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-[#E6C878]" />
        <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#E6C878]">{kicker}</span>
      </div>
      <h3 className="mt-1 font-sans text-2xl font-bold text-[#FFFFFF]">{title}</h3>
      <p className="mt-1 max-w-2xl text-sm text-[#FECDD3]/80">{desc}</p>
    </div>
  );
}

function MetricBar({ label, val, pct, color = 'bg-[#E6C878]' }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-xs text-[#FECDD3]">
        <span>{label}</span>
        <span className="font-bold text-[#FFFFFF]">{val}</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#2A020D]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(2, pct)}%` }} />
      </div>
    </div>
  );
}

function SavingsCard({ icon: Icon, label, value, tone = 'royal' }) {
  const toneCls = tone === 'rose' ? 'text-[#FFD1DC] border-[#D4AF37]/50 bg-[#7A0018]/80' : 'text-[#E6C878] border-[#D4AF37]/50 bg-[#4C0519]/90';
  return (
    <div className={`rounded-xl border p-3 ${toneCls}`}>
      <Icon size={13} />
      <p className="mt-1 font-sans text-lg font-bold">{value}</p>
      <p className="font-mono text-[0.58rem] uppercase tracking-wider opacity-80">{label}</p>
    </div>
  );
}

function RoadmapPhase({ phase, desc }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#D4AF37] bg-[#7A0018]">
        <ChevronRight size={12} className="text-[#E6C878]" />
      </div>
      <div>
        <p className="text-xs font-bold text-[#FFFFFF]">{phase}</p>
        <p className="text-[0.7rem] text-[#FECDD3]/80">{desc}</p>
      </div>
    </div>
  );
}

