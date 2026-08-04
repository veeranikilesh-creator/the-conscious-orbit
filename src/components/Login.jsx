import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function Login({ onLogin, onBack }) {
  // isChecked = false -> Log in
  // isChecked = true  -> Sign up
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isChecked && !agreedToTerms) {
      alert("Please agree to the Terms & Privacy Policy to proceed.");
      return;
    }
    if (onLogin) onLogin();
  };

  return (
    <div className="relative min-h-screen h-screen w-full bg-[#4A0A13] text-[#FAF4E8] flex flex-col justify-between items-center p-4 sm:p-6 overflow-hidden selection:bg-[#D4AF37] selection:text-[#4A0A13]">
      
      {/* Soft Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.12)_0%,transparent_65%)]" />

      {/* Top Navigation Header */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between">
        <button
          onClick={onBack}
          type="button"
          className="group flex items-center gap-1.5 text-xs font-bold text-[#F5D77F] hover:text-[#FAF4E8] transition cursor-pointer bg-[#38070E] hover:bg-[#38070E]/80 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 shadow-xs"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition" />
          <span>Home</span>
        </button>

        <div className="cursor-pointer" onClick={onBack}>
          <span className="font-mono text-xs font-extrabold uppercase tracking-[0.2em] text-[#F5D77F]">
            Conscious Orbital
          </span>
        </div>
      </header>

      {/* Centered Main Form Container */}
      <main className="relative z-10 w-full max-w-[360px] my-auto flex flex-col items-center justify-center">
        
        {/* Compact Toggle Switcher */}
        <div className="relative mb-5 flex items-center justify-center gap-6 select-none bg-[#38070E]/80 border border-[#D4AF37]/40 px-4 py-1.5 rounded-full shadow-md">
          <span
            onClick={() => setIsChecked(false)}
            className={`text-xs font-bold cursor-pointer transition-colors ${
              !isChecked ? "text-[#F5D77F]" : "text-[#FAF4E8]/60 hover:text-[#FAF4E8]"
            }`}
          >
            Log in
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#4A0A13] border border-[#D4AF37]/60 rounded-full peer transition-colors relative">
              <div
                className={`absolute top-[1px] left-[1px] w-3.5 h-3.5 bg-[#F5D77F] rounded-full transition-transform duration-300 ${
                  isChecked ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
          </label>

          <span
            onClick={() => setIsChecked(true)}
            className={`text-xs font-bold cursor-pointer transition-colors ${
              isChecked ? "text-[#F5D77F]" : "text-[#FAF4E8]/60 hover:text-[#FAF4E8]"
            }`}
          >
            Sign up
          </span>
        </div>

        {/* 3D FLIP CARD */}
        <div className="w-full h-[390px] [perspective:1000px]">
          <div
            className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
              isChecked ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            
            {/* ========================================= */}
            {/* FRONT FACE: LOG IN CARD                    */}
            {/* ========================================= */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#FAF4E8] text-[#4A0A13] rounded-3xl border border-[#D4AF37] p-6 shadow-2xl flex flex-col justify-between items-center text-center">
              
              <div className="space-y-1 w-full">
                <h2 className="font-serif italic text-2xl sm:text-3xl font-extrabold text-[#4A0A13]">
                  Log in
                </h2>
                <p className="text-[0.72rem] text-[#7A1C29] font-medium">
                  Welcome back to Conscious Orbital
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-3.5 my-auto">
                <div className="space-y-1 text-left">
                  <label className="font-mono text-[0.65rem] uppercase font-bold text-[#B8860B] tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-[#D4AF37]/60 bg-[#FAF4E8] px-3.5 py-2.5 text-xs text-[#4A0A13] placeholder-[#7A1C29]/45 focus:border-[#4A0A13] focus:outline-none transition shadow-xs"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[0.65rem] uppercase font-bold text-[#B8860B] tracking-wider">
                      Password
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => e.preventDefault()}
                      className="text-[0.65rem] font-bold text-[#800000] hover:underline"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-[#D4AF37]/60 bg-[#FAF4E8] px-3.5 py-2.5 pr-8 text-xs text-[#4A0A13] placeholder-[#7A1C29]/45 focus:border-[#4A0A13] focus:outline-none transition shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A1C29]/60 hover:text-[#4A0A13] transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full border border-[#D4AF37] bg-[#4A0A13] hover:bg-[#5C0F1A] active:scale-[0.98] py-3 text-xs font-bold text-[#F5D77F] shadow-md transition cursor-pointer mt-2"
                >
                  Let's go!
                </button>
              </form>

              <div className="text-[0.7rem] text-[#7A1C29] font-medium">
                Need an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsChecked(true)}
                  className="font-bold text-[#800000] hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* ========================================= */}
            {/* BACK FACE: SIGN UP CARD                    */}
            {/* ========================================= */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#FAF4E8] text-[#4A0A13] rounded-3xl border border-[#D4AF37] p-6 shadow-2xl flex flex-col justify-between items-center text-center">
              
              <div className="space-y-1 w-full">
                <h2 className="font-serif italic text-2xl sm:text-3xl font-extrabold text-[#4A0A13]">
                  Sign up
                </h2>
                <p className="text-[0.72rem] text-[#7A1C29] font-medium">
                  Start your intelligence journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-2.5 my-auto">
                <div className="space-y-1 text-left">
                  <label className="font-mono text-[0.65rem] uppercase font-bold text-[#B8860B] tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-[#D4AF37]/60 bg-[#FAF4E8] px-3.5 py-2 text-xs text-[#4A0A13] placeholder-[#7A1C29]/45 focus:border-[#4A0A13] focus:outline-none transition shadow-xs"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-mono text-[0.65rem] uppercase font-bold text-[#B8860B] tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-[#D4AF37]/60 bg-[#FAF4E8] px-3.5 py-2 text-xs text-[#4A0A13] placeholder-[#7A1C29]/45 focus:border-[#4A0A13] focus:outline-none transition shadow-xs"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-mono text-[0.65rem] uppercase font-bold text-[#B8860B] tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-[#D4AF37]/60 bg-[#FAF4E8] px-3.5 py-2 pr-8 text-xs text-[#4A0A13] placeholder-[#7A1C29]/45 focus:border-[#4A0A13] focus:outline-none transition shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A1C29]/60 hover:text-[#4A0A13] transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-0.5 text-left">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-3 w-3 rounded border-[#D4AF37] text-[#4A0A13] focus:ring-[#4A0A13] cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[0.68rem] text-[#4A0A13] cursor-pointer font-medium">
                    I agree to the{" "}
                    <a
                      href="#terms"
                      onClick={(e) => e.preventDefault()}
                      className="text-[#800000] underline font-bold"
                    >
                      Terms & Privacy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full border border-[#D4AF37] bg-[#4A0A13] hover:bg-[#5C0F1A] active:scale-[0.98] py-2.5 text-xs font-bold text-[#F5D77F] shadow-md transition cursor-pointer mt-1"
                >
                  Confirm!
                </button>
              </form>

              <div className="text-[0.7rem] text-[#7A1C29] font-medium">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsChecked(false)}
                  className="font-bold text-[#800000] hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-2 text-center text-[0.68rem] font-mono text-[#F5D77F]/75">
        © 2026 Conscious Orbital · Executive Security
      </footer>
    </div>
  );
}
