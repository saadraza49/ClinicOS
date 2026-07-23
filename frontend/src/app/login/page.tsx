"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Stethoscope, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  X,
  AlertCircle,
  Activity,
  HeartPulse,
  LockKeyhole
} from "lucide-react";
import Button from "@/components/button";

export default function LoginPage() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  // Forgot password modal
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate login API authentication delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !/\S+@\S+\.\S+/.test(resetEmail)) return;

    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setIsForgotOpen(false);
      setResetEmail("");
    }, 2500);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-slate-50/50 overflow-y-auto lg:overflow-hidden">
      
      {/* Left Side: Brand Visual Showcase (42% width on desktop) */}
      <div className="lg:w-[42%] lg:h-full bg-gradient-to-br from-[#121636] via-[#2c336b] to-[#004f46] relative flex flex-col justify-between p-8 md:p-12 lg:p-16 text-white overflow-hidden shrink-0 min-h-[360px] lg:min-h-0">
        
        {/* Modern Medical Background Pattern & Overlay */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-25 pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121636]/90 via-[#2c336b]/40 to-transparent pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform duration-300">
              <HeartPulse className="w-6 h-6 text-emerald-400 group-hover:animate-pulse" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white font-display">LuminaHealth</span>
          </Link>

          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 py-2 px-4 rounded-full backdrop-blur-sm border border-white/10 shadow-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Homepage</span>
          </Link>
        </div>

        {/* Core Showcase Text */}
        <div className="relative z-10 my-auto py-8 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold mb-6 tracking-wide uppercase">
            <Activity className="w-3.5 h-3.5" /> Secure Medical Portal
          </span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-extrabold text-white leading-tight mb-4 tracking-tight"
          >
            Your health is always our priority.
          </motion.h2>
          <p className="text-white/80 text-sm xl:text-base leading-relaxed font-normal">
            Access secure telemedicine consultations, track digital prescriptions, schedule on-site lab work, and consult your professional care provider in one unified hub.
          </p>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-2xl xl:text-3xl font-extrabold text-emerald-400">99.8%</p>
              <p className="text-xs text-white/70 mt-1 font-semibold">Satisfaction Rate</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-2xl xl:text-3xl font-extrabold text-sky-400">15k+</p>
              <p className="text-xs text-white/70 mt-1 font-semibold">Active Patients</p>
            </div>
          </div>
        </div>

        {/* Bottom Compliance & Security Info */}
        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-white/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">HIPAA & GDPR Compliant Security</span>
          </div>
          <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider text-emerald-300">
            <LockKeyhole className="w-3 h-3 text-emerald-300" /> AES-256
          </div>
        </div>

      </div>

      {/* Right Side: Login Form (58% width on desktop) */}
      <div className="flex-grow lg:h-full lg:overflow-y-auto flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 xl:px-28 bg-white">
        <div className="max-w-md w-full mx-auto my-auto">
          
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001f29] tracking-tight mb-2">
              Sign In to Portal
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              New to LuminaHealth?{" "}
              <Link href="/signup" className={`font-bold transition-all hover:underline ${role === "doctor" ? "text-[#00685d]" : "text-[#2c336b]"}`}>
                Create Patient Account
              </Link>
            </p>
          </div>

          {/* Role Switcher Pill */}
          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 mb-8">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                role === "patient"
                  ? "bg-[#2c336b] text-white shadow-md"
                  : "text-gray-600 hover:text-[#2c336b]"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Patient Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("doctor")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                role === "doctor"
                  ? "bg-[#00685d] text-white shadow-md"
                  : "text-gray-600 hover:text-[#00685d]"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor / Provider</span>
            </button>
          </div>

          {/* Success View */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4 my-6 shadow-sm"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">Secure Access Granted</h3>
                  <p className="text-sm text-emerald-700 mt-1">
                    Welcome back, {role === "doctor" ? "Dr. Healthcare Provider" : "Valued Patient"}! Accessing your clinical files...
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/">
                    <Button variant="primary" className={`w-full py-3 shadow-md ${role === "doctor" ? "bg-[#00685d] hover:bg-[#005249]" : "bg-[#2c336b] hover:bg-[#1e2450]"}`}>
                      Go to Homepage
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-3.5 mb-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2.5 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-sm hover:border-slate-300"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2.5 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-sm hover:border-slate-300"
                  >
                    <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.15 1.86-1 2.98 1.07.08 2.15-.57 2.81-1.38z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>

                {/* Separator Divider */}
                <div className="relative flex items-center justify-center my-5">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Or secure credentials
                  </span>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === "doctor" ? "doctor@luminahealth.com" : "patient@example.com"}
                      className={`w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border rounded-xl outline-none transition-all ${
                        errors.email
                          ? "border-red-400 focus:ring-2 focus:ring-red-200"
                          : role === "doctor"
                          ? "border-slate-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                          : "border-slate-200 focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10 focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(true)}
                      className={`text-xs font-bold hover:underline cursor-pointer ${role === "doctor" ? "text-[#00685d]" : "text-[#2c336b]"}`}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border rounded-xl outline-none transition-all ${
                        errors.password
                          ? "border-red-400 focus:ring-2 focus:ring-red-200"
                          : role === "doctor"
                          ? "border-slate-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                          : "border-slate-200 focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10 focus:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={`w-4 h-4 rounded border-slate-300 focus:ring-opacity-50 cursor-pointer ${
                        role === "doctor" ? "text-[#00685d] focus:ring-[#00685d]" : "text-[#2c336b] focus:ring-[#2c336b]"
                      }`}
                    />
                    <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className={`w-full py-3.5 text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                      role === "doctor"
                        ? "bg-[#00685d] hover:bg-[#005249] shadow-[#00685d]/20"
                        : "bg-[#2c336b] hover:bg-[#1e2450] shadow-[#2c336b]/20"
                    } ${isLoading ? "opacity-75 cursor-wait" : ""}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying medical records...</span>
                      </>
                    ) : (
                      <>
                        <span>Access Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative"
            >
              <button
                onClick={() => setIsForgotOpen(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#001f29]">Reset Portal Password</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your clinical registered email address and we'll send you reset coordinates.
                </p>
              </div>

              {resetSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-center text-xs font-semibold">
                  Password reset link sent! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3.5 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full py-3 text-xs font-bold">
                    Send Reset Link
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
