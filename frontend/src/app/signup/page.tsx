"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Stethoscope, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Calendar,
  Activity,
  HeartPulse,
  LockKeyhole
} from "lucide-react";
import Button from "@/components/button";

export default function SignupPage() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dobOrSpecialty, setDobOrSpecialty] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength logic
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "", color: "bg-gray-200" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-400" };
    if (score === 2 || score === 3) return { score: 2, label: "Medium", color: "bg-amber-400" };
    return { score: 3, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-()]{7,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!agreedTerms) {
      newErrors.terms = "You must agree to the Terms of Service & Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate registration API call delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1400);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-slate-50/50 overflow-y-auto lg:overflow-hidden">
      
      {/* Left Side: Brand Visual Showcase (42% width on desktop) */}
      <div className="lg:w-[42%] lg:h-full bg-gradient-to-br from-[#004f46] via-[#00685d] to-[#121636] relative flex flex-col justify-between p-8 md:p-12 lg:p-16 text-white overflow-hidden shrink-0 min-h-[360px] lg:min-h-0">
        
        {/* Modern Medical Background Pattern & Overlay */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-25 pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#004f46]/90 via-[#00685d]/40 to-transparent pointer-events-none" />

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
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-bold mb-6 tracking-wide uppercase">
            <Activity className="w-3.5 h-3.5" /> Instant Access Setup
          </span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-extrabold text-white leading-tight mb-4 tracking-tight"
          >
            A simpler path to modern care.
          </motion.h2>
          <p className="text-white/80 text-sm xl:text-base leading-relaxed font-normal">
            Create your account in under two minutes to immediately book priority clinic appointments, request automatic prescription refills, and review diagnostic lab results instantly online.
          </p>

          {/* Highlights List */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Real-time appointment approvals</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-sm">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
              <span>Secure 256-bit patient file encryption</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-sm">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Virtual chat & consults with family doctors</span>
            </div>
          </div>
        </div>

        {/* Bottom Compliance & Security Info */}
        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-white/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">Fully Accredited Healthcare Security</span>
          </div>
          <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider text-emerald-300">
            <LockKeyhole className="w-3 h-3 text-emerald-300" /> HIPAA CERTIFIED
          </div>
        </div>

      </div>

      {/* Right Side: Signup Form (58% width on desktop) */}
      <div className="flex-grow lg:h-full lg:overflow-y-auto flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 xl:px-28 bg-white">
        <div className="max-w-md w-full mx-auto my-auto">
          
          {/* Header */}
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001f29] tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className={`font-bold transition-all hover:underline ${role === "doctor" ? "text-[#2c336b]" : "text-[#00685d]"}`}>
                Sign In Here
              </Link>
            </p>
          </div>

          {/* Role Switcher Pill */}
          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                role === "patient"
                  ? "bg-[#00685d] text-white shadow-md"
                  : "text-gray-600 hover:text-[#00685d]"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Patient Account</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("doctor")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                role === "doctor"
                  ? "bg-[#2c336b] text-white shadow-md"
                  : "text-gray-600 hover:text-[#2c336b]"
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
                className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4 my-4 shadow-sm"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">Registration Complete</h3>
                  <p className="text-sm text-emerald-700 mt-1">
                    Welcome to LuminaHealth, <span className="font-bold">{fullName}</span>! Your profile coordinates have been secure-saved.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <Link href="/login">
                    <Button variant="primary" className={`w-full py-3 shadow-md ${role === "doctor" ? "bg-[#2c336b] hover:bg-[#1e2450]" : "bg-[#00685d] hover:bg-[#005249]"}`}>
                      Proceed to Login
                    </Button>
                  </Link>
                  <Link href="/book-appointment">
                    <Button variant="outline" className="w-full py-3">
                      Book First Appointment
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl outline-none transition-all ${
                        errors.fullName
                          ? "border-red-400 focus:ring-2 focus:ring-red-200"
                          : role === "doctor"
                          ? "border-slate-200 focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10 focus:bg-white"
                          : "border-slate-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email & Phone grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                        placeholder="john@example.com"
                        className={`w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border rounded-xl outline-none transition-all ${
                          errors.email
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : role === "doctor"
                            ? "border-slate-200 focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10 focus:bg-white"
                            : "border-slate-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border rounded-xl outline-none transition-all ${
                          errors.phone
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : role === "doctor"
                            ? "border-slate-200 focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10 focus:bg-white"
                            : "border-slate-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Specialty or Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {role === "doctor" ? "Medical Specialty / License #" : "Date of Birth"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      {role === "doctor" ? <Stethoscope className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    </div>
                    <input
                      type={role === "doctor" ? "text" : "date"}
                      value={dobOrSpecialty}
                      onChange={(e) => setDobOrSpecialty(e.target.value)}
                      placeholder={role === "doctor" ? "Pediatrics (Lic #98765)" : ""}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all ${
                        role === "doctor"
                          ? "focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10 focus:bg-white"
                          : "focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                {/* Password fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-8 py-2.5 text-sm bg-slate-50 border rounded-xl outline-none transition-all ${
                          errors.password
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : role === "doctor"
                            ? "border-slate-200 focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10 focus:bg-white"
                            : "border-slate-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border rounded-xl outline-none transition-all ${
                          errors.confirmPassword
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : role === "doctor"
                            ? "border-slate-200 focus:border-[#2c336b] focus:ring-2 focus:ring-[#2c336b]/10 focus:bg-white"
                            : "border-slate-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="pt-0.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>Password complexity:</span>
                      <span className="font-bold text-slate-700">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 1 ? strength.color : "bg-slate-200"}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 2 ? strength.color : "bg-gray-200"}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 3 ? strength.color : "bg-gray-200"}`} />
                    </div>
                  </div>
                )}

                {/* Terms Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className={`w-4 h-4 mt-0.5 rounded border-slate-300 cursor-pointer shrink-0 ${
                        role === "doctor" ? "text-[#2c336b] focus:ring-[#2c336b]" : "text-[#00685d] focus:ring-[#00685d]"
                      }`}
                    />
                    <span className="text-xs text-slate-600">
                      I agree to LuminaHealth's{" "}
                      <Link href="/terms-and-conditions" className={`font-bold hover:underline ${role === "doctor" ? "text-[#2c336b]" : "text-[#00685d]"}`}>
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy-policy" className={`font-bold hover:underline ${role === "doctor" ? "text-[#2c336b]" : "text-[#00685d]"}`}>
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.terms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className={`w-full py-3.5 text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                      role === "doctor"
                        ? "bg-[#2c336b] hover:bg-[#1e2450] shadow-[#2c336b]/20"
                        : "bg-[#00685d] hover:bg-[#005249] shadow-[#00685d]/20"
                    } ${isLoading ? "opacity-75 cursor-wait" : ""}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Registering credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
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
  );
}
