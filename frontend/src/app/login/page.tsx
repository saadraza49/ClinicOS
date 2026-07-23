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
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  X,
  AlertCircle
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
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f3faff] via-[#e6f6ff]/40 to-[#f3faff] relative overflow-hidden">
      {/* Decorative Background Glow Blurs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#2c336b]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-[#00685d]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Side - Brand Showcase & Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#2c336b] via-[#353d7d] to-[#1e2450] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-[#ffffff]_1px,transparent_1px] [background-size:16px_16px] pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-8">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="4" r="3" fill="currentColor" />
                  <circle cx="4" cy="12" r="3" fill="#a9c7fb" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <circle cx="20" cy="12" r="3" fill="currentColor" />
                  <circle cx="12" cy="20" r="3" fill="currentColor" />
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">WeCare</span>
            </Link>

            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3"
            >
              Welcome back to your health hub.
            </motion.h2>

            <p className="text-white/80 text-sm leading-relaxed mb-8">
              Access your medical records, upcoming appointments, lab results, and connect directly with your healthcare providers.
            </p>
          </div>

          {/* Key Value Badges */}
          <div className="relative z-10 space-y-4 my-6">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">HIPAA & GDPR Compliant</h4>
                <p className="text-[11px] text-white/70">Your health data is encrypted end-to-end</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">24/7 Virtual Consultations</h4>
                <p className="text-[11px] text-white/70">Instantly connect with top medical specialists</p>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial Snippet */}
          <div className="relative z-10 pt-4 border-t border-white/15 text-xs text-white/80 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-cyan-200 border border-white flex items-center justify-center text-[#2c336b] font-bold text-[10px]">DR</div>
              <div className="w-7 h-7 rounded-full bg-emerald-200 border border-white flex items-center justify-center text-[#2c336b] font-bold text-[10px]">MK</div>
              <div className="w-7 h-7 rounded-full bg-amber-200 border border-white flex items-center justify-center text-[#2c336b] font-bold text-[10px]">SA</div>
            </div>
            <span className="font-medium text-white/90">Trusted by 15,000+ patients daily</span>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-6 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001f29] tracking-tight mb-2">
                Sign in to your account
              </h1>
              <p className="text-sm text-gray-500">
                Don't have an account yet?{" "}
                <Link href="/signup" className="font-bold text-[#2c336b] hover:underline transition-all">
                  Create Account
                </Link>
              </p>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex bg-[#f3faff] p-1.5 rounded-2xl border border-[#2c336b]/10 mb-6">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
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
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  role === "doctor"
                    ? "bg-[#00685d] text-white shadow-md"
                    : "text-gray-600 hover:text-[#00685d]"
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor / Staff</span>
              </button>
            </div>

            {/* Success View */}
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 my-6"
                >
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900">Login Successful!</h3>
                    <p className="text-xs text-emerald-700 mt-1">
                      Welcome back, {role === "doctor" ? "Dr. Healthcare Provider" : "Patient"}! Redirecting to your dashboard...
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link href="/">
                      <Button variant="primary" className="w-full">
                        Go to Homepage
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Social Logins */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2.5 py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all cursor-pointer shadow-sm hover:border-gray-300"
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
                      className="flex items-center justify-center gap-2.5 py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all cursor-pointer shadow-sm hover:border-gray-300"
                    >
                      <svg className="w-4 h-4 fill-current text-gray-900" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.15 1.86-1 2.98 1.07.08 2.15-.57 2.81-1.38z" />
                      </svg>
                      <span>Apple</span>
                    </button>
                  </div>

                  {/* Separator Divider */}
                  <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-gray-200 w-full" />
                    <span className="bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Or with email
                    </span>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={role === "doctor" ? "doctor@luminahealth.com" : "patient@example.com"}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/80 border rounded-xl outline-none transition-all ${
                          errors.email
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10 focus:bg-white"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotOpen(true)}
                        className="text-xs font-bold text-[#2c336b] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/80 border rounded-xl outline-none transition-all ${
                          errors.password
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10 focus:bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
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
                        className="w-4 h-4 rounded border-gray-300 text-[#2c336b] focus:ring-[#2c336b] cursor-pointer"
                      />
                      <span className="text-xs text-gray-600 font-medium">Keep me signed in</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      className={`w-full py-3 text-sm font-bold shadow-lg shadow-[#2c336b]/20 flex items-center justify-center gap-2 ${
                        isLoading ? "opacity-75 cursor-wait" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Portal</span>
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

      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative"
            >
              <button
                onClick={() => setIsForgotOpen(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#f3faff] text-[#2c336b] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#2c336b]/10">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your registered email address and we'll send you a password reset link.
                </p>
              </div>

              {resetSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-center text-xs font-semibold">
                  Password reset link sent! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full py-2.5 text-xs font-bold">
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
