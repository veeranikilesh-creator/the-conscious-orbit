import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Cpu } from 'lucide-react';
import DarkVeil from './DarkVeil.jsx';

/* ============================================================
   ULTRA-LUXURY RED & GOLD DESIGN SYSTEM PRIMITIVES
   Deep Royal Red (#7A0018) · Metallic Gold (#D4AF37) · Champagne Gold (#E6C878)
   ============================================================ */

// Royal Mesh Layered Background with Golden Orbs
export function RoyalBackground({ hueShift = 0, speed = 0.25, opacity = 0.22, className = '' }) {
  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-royal-mesh ${className}`}>
      {/* Blurred Golden Radial Orbs */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#D4AF37]/15 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#8E1538]/20 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#E6C878]/15 blur-[120px]" />

      {/* WebGL Shader Ambient Layer */}
      <div className="absolute inset-0" style={{ opacity }}>
        <DarkVeil hueShift={hueShift} speed={speed} resolutionScale={0.75} />
      </div>
      {/* Warm Ivory Overlay */}
      <div className="absolute inset-0 bg-[#FFFCF7]/80 backdrop-blur-[2px]" />
    </div>
  );
}

// Orbital Brand Mark — Royal Red Core & Metallic Gold Rings
export function OrbitBrand({ size = 42, className = '' }) {
  const dim = { width: size, height: size };
  return (
    <div className={`relative ${className}`} style={dim}>
      {/* Outer dashed ring — Metallic Gold */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]"
      />
      {/* Middle solid ring — Royal Red */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full border border-[#7A0018]/45"
        style={{ inset: `${size * 0.14}px` }}
      />
      {/* Orbiting Champagne Gold dot */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        <span
          className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#E6C878] shadow-[0_0_10px_rgba(212,175,55,1)]"
        />
      </motion.div>
      {/* Center Crown */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Crown style={{ width: size * 0.44, height: size * 0.44 }} className="text-[#7A0018]" />
      </div>
    </div>
  );
}

// AI Pulse Badge with Emerald live telemetry dot & Gold border
export function AiPulseBadge({ label = 'AI Engine: Active', className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#FFFCF7] px-4 py-1.5 font-mono text-[0.68rem] font-medium text-[#7A0018] shadow-[0_0_12px_rgba(212,175,55,0.2)] ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
      </span>
      <Sparkles size={12} className="text-[#D4AF37]" />
      <span>{label}</span>
    </div>
  );
}

// AI Intelligence Side Widget
export function AiInsightWidget({ verticalName = 'Venture' }) {
  return (
    <GlassPanel className="p-6 space-y-4 border-[#D4AF37]/50 bg-gradient-to-br from-[#FFFFFF] via-[#FFFCF7] to-[#FBF3D5]/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-[#7A0018]" />
          <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-[#7A0018]">
            AI Telemetry
          </span>
        </div>
        <span className="rounded-full border border-[#10B981]/40 bg-[#ECFDF5] px-2.5 py-0.5 font-mono text-[0.58rem] font-bold text-[#059669]">
          99.4% Precision
        </span>
      </div>

      <div>
        <h4 className="font-sans text-base font-bold text-[#111827]">{verticalName} Neural Read</h4>
        <p className="mt-1 text-xs text-[#4B5563]">
          Real-time pattern analysis across TAM conversion, unit economics, and competitive whitespace.
        </p>
      </div>

      <div className="space-y-2.5 pt-1">
        {[
          { label: 'Neural Confidence', val: '96%', color: 'bg-[#7A0018]' },
          { label: 'Data Processing Speed', val: '14ms', color: 'bg-[#D4AF37]' },
          { label: 'Risk Factor Detection', val: 'Low (1.2%)', color: 'bg-[#059669]' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-[#E6C878]/60 bg-[#FFFCF7] p-2.5">
            <div className="flex items-center justify-between text-[0.68rem]">
              <span className="font-mono text-[#6B7280]">{item.label}</span>
              <span className="font-mono font-bold text-[#111827]">{item.val}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
              <div className={`h-full rounded-full ${item.color}`} style={{ width: item.val.includes('%') ? item.val : '85%' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#E6C878] bg-[#FBF3D5] p-3 text-center">
        <p className="font-mono text-[0.65rem] font-semibold text-[#78350F]">
          AI Co-Pilot is actively optimizing your strategy pipeline.
        </p>
      </div>
    </GlassPanel>
  );
}

// Glass Panel Wrapper — 18px rounded Luxury Floating Card
export function GlassPanel({ className = '', children, ...rest }) {
  return (
    <div
      className={`card-royal-luxury ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

// Headings
export function RoyalHeading({ children, level = 2, shimmer = false, className = '' }) {
  const Tag = `h${level}`;
  const sizes = {
    1: 'text-3xl md:text-4xl',
    2: 'text-2xl md:text-3xl',
    3: 'text-xl md:text-2xl',
    4: 'text-lg',
  };
  return (
    <Tag
      className={`font-sans font-bold tracking-tight ${sizes[level]} ${
        shimmer ? 'text-shimmer-champagne' : 'text-[#111827]'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

// Form field label
export function Field({ label, hint, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-[#78350F]">
          {label}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-[0.68rem] text-[#6B7280]">{hint}</span>}
    </label>
  );
}

// Base input / textarea / select styling with Champagne Gold focus border
export const fieldBase =
  'field-luxury-gold w-full rounded-xl bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111827] ' +
  'placeholder:text-[#9CA3AF] border border-[#E6C878]/70 shadow-xs transition-all duration-200';

export function Input(props) {
  return <input {...props} className={`${fieldBase} ${props.className || ''}`} />;
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`${fieldBase} resize-y ${props.className || ''}`}
    />
  );
}

export function Select(props) {
  return (
    <select
      {...props}
      className={`${fieldBase} appearance-none cursor-pointer ${props.className || ''}`}
    >
      {props.children}
    </select>
  );
}

// Primary Royal Red Action Button with Golden Glow
export function RoyalButton({ children, className = '', ...rest }) {
  return (
    <button
      className={`btn-royal-red inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

// Secondary White/Ivory Button with Gold Border & Royal Red Text
export function GhostButton({ children, className = '', ...rest }) {
  return (
    <button
      className={`btn-royal-gold-outline inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

// Status badge
const STATUS_STYLES = {
  RECEIVED: 'bg-[#FFF1F2] text-[#7A0018] border-[#FECDD3]',
  PENDING: 'bg-[#FBF3D5] text-[#78350F] border-[#E6C878]',
  PROCESSED: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
  PUBLISHED: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
};

export function StatusBadge({ status, className = '' }) {
  const style = STATUS_STYLES[status] || 'bg-[#FFFCF7] text-[#111827] border-[#E6C878]';
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider ${style} ${className}`}
    >
      {status}
    </span>
  );
}

// Status dot
export function StatusDot({ status }) {
  const colors = {
    RECEIVED: 'bg-[#7A0018]',
    PENDING: 'bg-[#D4AF37]',
    PROCESSED: 'bg-[#7C3AED]',
    PUBLISHED: 'bg-[#059669]',
  };
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${colors[status] || 'bg-[#7A0018]'}`}
      />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${colors[status] || 'bg-[#7A0018]'}`} />
    </span>
  );
}
