import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Crown,
  ShieldCheck, Loader2, CheckCircle2,
} from 'lucide-react';
import { OrbitBrand, RoyalBackground } from './ui.jsx';
import { fieldBase } from './ui.jsx';

/* ============================================================
   ULTRA-LUXURY RED & GOLD SPLIT AUTHENTICATION SCREEN
   ============================================================ */

export default function Login({ onLogin, onBack }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth then enter dashboard
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1400);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-royal-mesh text-[#111827]">
      {/* WebGL Background */}
      <RoyalBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center justify-center px-5 py-8 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid w-full overflow-hidden rounded-3xl border border-[#D4AF37] bg-[#FFFFFF] shadow-2xl lg:grid-cols-2"
        >
          {/* ===== LEFT — DEEP BURGUNDY & ROYAL RED BRAND HERO PANEL ===== */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-b from-[#4C0519] via-[#7A0018] to-[#2A020D] p-10 text-[#FFFFFF] lg:flex">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute right-0 top-1/4 h-64 w-64 rounded-full bg-[#D4AF37]/25 blur-3xl" />
              <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-[#E6C878]/20 blur-3xl" />
            </div>

            {/* Top: back + brand */}
            <div className="relative flex items-center justify-between">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#FECDD3] transition hover:text-[#FFFFFF] cursor-pointer"
              >
                <ArrowLeft size={15} /> Home
              </button>
              <div className="flex items-center gap-2">
                <OrbitBrand size={28} />
                <span className="font-sans text-sm font-bold text-[#FFFFFF]">Conscious Orbit</span>
              </div>
            </div>

            {/* Center: showcase */}
            <div className="relative my-8 flex flex-col items-center text-center">
              <OrbitBrand size={84} />
              <h2 className="mt-8 font-sans text-3xl font-extrabold leading-tight text-[#FFFFFF]">
                Strategy with <span className="text-[#E6C878]">Sovereignty</span>
              </h2>
              <p className="mt-3 max-w-xs text-sm text-[#FECDD3] leading-relaxed">
                Sign in to run ventures through the four-stage intelligence pipeline and your decision engine.
              </p>

              {/* Feature ticks */}
              <div className="mt-8 w-full max-w-xs space-y-3 text-left">
                {[
                  'Five-vertical intelligence suite',
                  'TAM / SAM / SOM market sizing',
                  'Conscious Orbital Score & 1/0 decision',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="shrink-0 text-[#E6C878]" />
                    <span className="text-sm text-[#FFFFFF]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: trust badge */}
            <div className="relative flex items-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-[#8E1538]/50 px-4 py-3">
              <ShieldCheck size={15} className="shrink-0 text-[#E6C878]" />
              <span className="font-mono text-[0.7rem] text-[#FECDD3]">
                Enterprise-grade encryption · Sovereign security
              </span>
            </div>
          </div>

          {/* ===== RIGHT — PRISTINE IVORY AUTH FORM CARD ===== */}
          <div className="relative bg-[#FFFCF7] p-8 md:p-10">
            {/* Mobile brand header */}
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2">
                <OrbitBrand size={32} />
                <span className="font-sans text-sm font-bold text-[#111827]">Conscious Orbit</span>
              </div>
              <button onClick={onBack} className="text-[#6B7280] transition hover:text-[#111827]">
                <ArrowLeft size={18} />
              </button>
            </div>

            {/* Mode toggle */}
            <div className="inline-flex rounded-xl border border-[#E6C878] bg-[#FFFFFF] p-1">
              {[
                { id: 'signin', label: 'Sign In' },
                { id: 'signup', label: 'Create Account' },
              ].map((opt) => {
                const active = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setMode(opt.id)}
                    className={`relative rounded-lg px-5 py-2 text-sm font-medium transition cursor-pointer ${
                      active ? 'text-[#FFFFFF]' : 'text-[#6B7280] hover:text-[#111827]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="auth-tab"
                        className="absolute inset-0 rounded-lg bg-[#7A0018] border border-[#D4AF37] shadow-xs"
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Heading */}
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <Crown size={16} className="text-[#7A0018]" />
                <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#7A0018]">
                  {mode === 'signin' ? 'Welcome Back' : 'Join the Orbit'}
                </span>
              </div>
              <h1 className="mt-2 font-sans text-3xl font-bold text-[#111827]">
                {mode === 'signin' ? 'Sign in to your suite' : 'Create your account'}
              </h1>
              <p className="mt-2 text-sm text-[#6B7280]">
                {mode === 'signin'
                  ? 'Enter your credentials to access the executive dashboard.'
                  : 'Begin your venture intelligence journey in seconds.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <FormField label="Full Name" icon={Crown}>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      className={`${fieldBase} pl-11`}
                    />
                  </FormField>
                </motion.div>
              )}

              <FormField label="Email Address" icon={Mail}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@venture.io"
                  className={`${fieldBase} pl-11`}
                />
              </FormField>

              <FormField label="Password" icon={Lock}>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`${fieldBase} pl-11 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] transition hover:text-[#111827] cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>

              {mode === 'signin' && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-[#6B7280] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded border-[#E6C878] bg-[#FFFFFF] text-[#7A0018] focus:ring-[#7A0018]"
                    />
                    Remember me
                  </label>
                  <a href="#forgot" className="font-semibold text-[#7A0018] hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-royal-red flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold disabled:opacity-70 cursor-pointer mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Authenticating…
                  </>
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In to Executive Suite' : 'Create Sovereign Account'}
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FormField({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-[#78350F]">
        {label}
      </label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A0018]" />
        {children}
      </div>
    </div>
  );
}
