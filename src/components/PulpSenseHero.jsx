import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, PhoneCall } from 'lucide-react';

/* ============================================================
   PULPSENSE — Ultra-Luxury Red & Gold Hero Section
   ============================================================ */

export default function PulpSenseHero({ onBookCall, onViewServices }) {
  const avatarImages = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="w-full bg-royal-mesh p-4 sm:p-6 md:p-10 font-sans text-[#111827] min-h-screen flex items-center justify-center">
      {/* Outer Rounded Container with 28px radius & Crimson Radial Glow */}
      <div className="relative w-full max-w-7xl overflow-hidden rounded-[28px] border border-[#D4AF37]/50 bg-[#FFFFFF] shadow-2xl transition-all duration-300">
        
        {/* Crimson Radial Background Glow at the bottom */}
        <div 
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[480px] w-full opacity-50"
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(122, 0, 24, 0.22) 0%, rgba(212, 175, 55, 0.12) 35%, rgba(255, 255, 255, 0) 75%)'
          }}
        />

        {/* Ambient Top Glow Dots */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#7A0018]/10 blur-[90px]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#D4AF37]/15 blur-[90px]" />

        {/* ================= NAVBAR ================= */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10 md:py-6 border-b border-[#E6C878]/40 bg-[#FFFFFF]/90 backdrop-blur-xl">
          {/* Left: Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7A0018] to-[#4C0519] text-white shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform border border-[#D4AF37]">
              <Zap size={20} className="fill-white text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#111827] font-sans">
              Pulp<span className="text-[#7A0018]">Sense</span>
            </span>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden items-center gap-1 rounded-full border border-[#E6C878] bg-[#FFFCF7] px-4 py-1.5 backdrop-blur-md md:flex">
            {['Testimonials', 'Services', 'Case Studies', 'Process', 'Contact'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '')}`}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-[#4B5563] transition-all hover:bg-[#FBF3D5] hover:text-[#7A0018]"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right: Royal Red "Book Your Call" pill button with Gold Glow */}
          <button
            onClick={onBookCall}
            className="btn-royal-red group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(212,175,55,0.35)] cursor-pointer"
          >
            <span>Book Your Call</span>
            <PhoneCall size={14} className="transition-transform group-hover:rotate-12" />
          </button>
        </nav>

        {/* ================= HERO CONTENT (CENTERED) ================= */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 pb-20 pt-10 text-center md:px-12 md:pb-28 md:pt-14">
          
          {/* Small Pill Badge — Follows H6 Font Size with Extra-Bold Gold Border & Champagne Text on Royal Red */}
          <motion.h6
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#D4AF37] bg-[#7A0018] px-5 py-2 text-xs sm:text-sm font-extrabold text-[#E6C878] shadow-[0_0_15px_rgba(212,175,55,0.4)] backdrop-blur-sm"
          >
            <span className="text-amber-500 font-black">⚡</span>
            <span className="font-extrabold uppercase tracking-wider">AI Automation</span>
          </motion.h6>

          {/* Large Minimal & Elegant Headline (2 lines) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-4xl font-sans text-4xl font-normal tracking-tight text-[#111827] sm:text-6xl lg:text-7xl leading-[1.12]"
          >
            Grow your business, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#111827] via-[#7A0018] to-[#D4AF37] bg-clip-text text-transparent font-semibold">
              not your payroll
            </span>
          </motion.h1>

          {/* Subheading Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-5 max-w-2xl text-sm font-medium text-[#4B5563] sm:text-base md:text-lg leading-relaxed"
          >
            Put your client acquisition, operations, and{' '}
            <span className="relative inline-block font-medium text-[#111827]">
              the daily grind on autopilot
              {/* Gold gradient underline */}
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#7A0018] via-[#D4AF37] to-[#10B981]" />
            </span>
          </motion.p>

          {/* Dual Pill Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            {/* Primary Pill Button */}
            <button
              onClick={onBookCall}
              className="btn-royal-red group flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-md cursor-pointer sm:w-auto"
            >
              <span>Book Your Call</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary Pill Button */}
            <button
              onClick={onViewServices}
              className="btn-royal-gold-outline flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium cursor-pointer sm:w-auto"
            >
              <span>View Services</span>
            </button>
          </motion.div>

          {/* Overlapping Profile Avatars & Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-12 flex items-center justify-center gap-3"
          >
            {/* Avatar stack */}
            <div className="flex -space-x-3 overflow-hidden">
              {avatarImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Client avatar ${idx + 1}`}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FFFFFF] object-cover"
                />
              ))}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7A0018] font-mono text-[0.68rem] font-bold text-white ring-2 ring-[#FFFFFF]">
                +499
              </div>
            </div>

            {/* Caption */}
            <div className="text-left text-xs text-[#6B7280]">
              <span className="font-semibold text-[#111827]">Trusted by 100+ businesses</span>
              <br />
              <span>scaling on autopilot</span>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
