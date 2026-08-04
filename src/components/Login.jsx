import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Crown,
  ShieldCheck, Loader2, CheckCircle2, User,
} from 'lucide-react';
import { OrbitBrand, RoyalBackground } from './ui.jsx';
import { fieldBase } from './ui.jsx';

/* ============================================================
   BLACK & GOLD EXECUTIVE AUTHENTICATION SCREEN
   ============================================================ */

const REMEMBER_KEY = 'orbit.rememberedEmail';

export default function Login({ onLogin, onBack }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [portalRole, setPortalRole] = useState('user'); // 'user' (User Client Portal) | 'admin' (Executive Admin)
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBER_KEY) || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem(REMEMBER_KEY)));
  const [resetSent, setResetSent] = useState(false);

  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (remember) localStorage.setItem(REMEMBER_KEY, email);
    else localStorage.removeItem(REMEMBER_KEY);

    // Enter selected portal (User Client Portal or Admin Portal)
    timer.current = setTimeout(() => {
      setLoading(false);
      onLogin(portalRole);
    }, 1200);
  };

  const handleForgotPassword = () => {
    if (!email.trim()) return;
    setResetSent(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-[#FFFFFF]">
      {/* WebGL Background */}
      <RoyalBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-8 sm:px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid w-full overflow-hidden rounded-3xl border border-[rgba(212,175,55,0.25)] bg-[#0E0E0E] shadow-2xl lg:grid-cols-2"
        >
          {/* ===== LEFT — BLACK & GOLD BRAND HERO PANEL ===== */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-b from-[#111111] via-[#0E0E0E] to-[#050505] p-10 text-[#FFFFFF] lg:flex border-r border-[rgba(212,175,55,0.18)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute right-0 top-1/4 h-64 w-64 rounded-full bg-[#D4AF37]/15 blur-3xl" />
              <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-[#F4D67A]/10 blur-3xl" />
            </div>

            {/* Top: back + brand */}
            <div className="relative flex items-center justify-between">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#CFCFCF] transition hover:text-[#D4AF37] cursor-pointer"
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
                Strategy with <span className="text-[#F4D67A]">Sovereignty</span>
              </h2>
              <p className="mt-3 max-w-xs text-sm text-[#CFCFCF] leading-relaxed">
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
                    <CheckCircle2 size={15} className="shrink-0 text-[#D4AF37]" />
                    <span className="text-sm text-[#FFFFFF]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: trust badge */}
            <div className="relative flex items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[#050505] px-4 py-3">
              <ShieldCheck size={15} className="shrink-0 text-[#D4AF37]" />
              <span className="font-mono text-[0.7rem] text-[#CFCFCF]">
                Enterprise-grade encryption · Sovereign security
              </span>
            </div>
          </div>

          {/* ===== RIGHT — DARK FORM CARD ===== */}
          <div className="relative bg-[#0E0E0E] p-6 sm:p-8 md:p-10 text-white">
            {/* Mobile brand header */}
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2">
                <OrbitBrand size={32} />
                <span className="font-sans text-sm font-bold text-[#FFFFFF]">Conscious Orbit</span>
              </div>
              <button onClick={onBack} className="text-[#CFCFCF] transition hover:text-[#D4AF37]">
                <ArrowLeft size={18} />
              </button>
            </div>

            {/* Mode toggle */}
            <div className="flex w-full max-w-full rounded-xl border border-[rgba(212,175,55,0.25)] bg-[#050505] p-1 sm:inline-flex sm:w-auto">
              {[
                { id: 'signin', label: 'Sign In' },
                { id: 'signup', label: 'Create Account' },
              ].map((opt) => {
                const active = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setMode(opt.id)}
                    className={`relative flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition cursor-pointer sm:flex-none sm:px-5 ${
                      active ? 'text-[#050505] font-bold' : 'text-[#CFCFCF] hover:text-[#FFFFFF]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="auth-tab"
                        className="absolute inset-0 rounded-lg bg-[#D4AF37] border border-[#F4D67A] shadow-xs"
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Portal Selection Toggle */}
            <div className="mt-5 space-y-1.5">
              <label className="block font-mono text-[0.65rem] font-bold uppercase tracking-wider text-[#F4D67A]">
                Select Destination Portal
              </label>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-[rgba(212,175,55,0.25)] bg-[#050505] p-1">
                <button
                  type="button"
                  onClick={() => setPortalRole('user')}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2.5 font-mono text-xs font-bold transition cursor-pointer ${
                    portalRole === 'user'
                      ? 'bg-[#10B981] text-[#050505] shadow-xs'
                      : 'text-[#CFCFCF] hover:text-[#FFFFFF]'
                  }`}
                >
                  <User size={14} /> User Client Portal
                </button>
                <button
                  type="button"
                  onClick={() => setPortalRole('admin')}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2.5 font-mono text-xs font-bold transition cursor-pointer ${
                    portalRole === 'admin'
                      ? 'bg-[#D4AF37] text-[#050505] shadow-xs'
                      : 'text-[#CFCFCF] hover:text-[#FFFFFF]'
                  }`}
                >
                  <Crown size={14} /> Executive Admin
                </button>
              </div>
            </div>

            {/* Heading */}
            <div className="mt-6">
              <div className="flex items-center gap-2">
                {portalRole === 'admin' ? (
                  <Crown size={16} className="text-[#D4AF37]" />
                ) : (
                  <User size={16} className="text-[#10B981]" />
                )}
                <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#F4D67A]">
                  {portalRole === 'admin' ? 'Executive Admin Portal' : 'User Client Portal'}
                </span>
              </div>
              <h1 className="mt-2 font-sans text-3xl font-bold text-[#FFFFFF]">
                {mode === 'signin'
                  ? portalRole === 'admin'
                    ? 'Sign in to Admin Control Center'
                    : 'Sign in to User Client Portal'
                  : 'Create Client Account'}
              </h1>
              <p className="mt-2 text-sm text-[#CFCFCF]">
                {portalRole === 'admin'
                  ? 'Access operational pipeline, score management, and system telemetry.'
                  : 'Submit venture intake details, track application status, and view strategy reports.'}
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
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A9A9A] transition hover:text-[#D4AF37] cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>

              {mode === 'signin' && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-[#CFCFCF] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded border-[#D4AF37] bg-[#050505] text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={!email.trim()}
                    className="font-semibold text-[#F4D67A] hover:underline disabled:opacity-40 disabled:hover:no-underline cursor-pointer disabled:cursor-not-allowed"
                    title={email.trim() ? 'Send a reset link' : 'Enter your email address first'}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {mode === 'signin' && resetSent && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-[#10B981]/40 bg-[#065F46]/25 px-3.5 py-2.5"
                >
                  <CheckCircle2 size={14} className="shrink-0 text-[#10B981]" />
                  <span className="text-xs text-[#A7F3D0]">
                    Reset link sent to <strong className="text-[#FFFFFF]">{email}</strong>
                  </span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-royal-red flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold disabled:opacity-70 cursor-pointer mt-4 sm:px-6 sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="shrink-0 animate-spin" /> Authenticating…
                  </>
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In to Executive Suite' : 'Create Account'}
                    <ArrowRight size={17} className="shrink-0" />
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
      <label className="mb-1.5 block font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-[#F4D67A]">
        {label}
      </label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
        {children}
      </div>
    </div>
  );
}

