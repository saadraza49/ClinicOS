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
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Calendar
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
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f3faff] via-[#e6f6ff]/40 to-[#f3faff] relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-12 right-1/4 w-96 h-96 bg-[#00685d]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-12 left-1/4 w-96 h-96 bg-[#2c336b]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* Left Side - Brand Showcase & Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#00685d] via-[#008376] to-[#004f46] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
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
              Join 50,000+ patients getting better care.
            </motion.h2>

            <p className="text-white/85 text-sm leading-relaxed mb-8">
              Create your free LuminaHealth account to book instant appointments, track medical prescriptions, and consult specialists anytime.
            </p>
          </div>

          {/* Highlights List */}
          <div className="relative z-10 space-y-4 my-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>Instant Appointment Confirmation</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <ShieldCheck className="w-5 h-5 text-cyan-300 shrink-0" />
              <span>Private & Secure Health Dashboard</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <span>Direct Doctor Chat & Prescriptions</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="relative z-10 pt-4 border-t border-white/15 text-xs text-white/80 flex items-center justify-between">
            <span>Free Registration</span>
            <span className="font-bold text-white">Takes &lt; 2 Minutes</span>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-5 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001f29] tracking-tight mb-1.5">
                Create Your Account
              </h1>
              <p className="text-xs text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-[#00685d] hover:underline transition-all">
                  Sign In Here
                </Link>
              </p>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex bg-[#f3faff] p-1.5 rounded-2xl border border-[#00685d]/10 mb-5">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
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
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
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
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 my-4"
                >
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900">Account Created Successfully!</h3>
                    <p className="text-xs text-emerald-700 mt-1">
                      Welcome to LuminaHealth, <span className="font-bold">{fullName}</span>! Your registration is complete.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <Link href="/login">
                      <Button variant="primary" className="w-full text-xs py-2.5">
                        Proceed to Login
                      </Button>
                    </Link>
                    <Link href="/book-appointment">
                      <Button variant="outline" className="w-full text-xs py-2.5">
                        Book Your First Appointment
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSignup} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50/80 border rounded-xl outline-none transition-all ${
                          errors.fullName
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-[11px] text-red-500 font-semibold mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50/80 border rounded-xl outline-none transition-all ${
                            errors.email
                              ? "border-red-400 focus:ring-2 focus:ring-red-200"
                              : "border-gray-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-red-500 font-semibold mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50/80 border rounded-xl outline-none transition-all ${
                            errors.phone
                              ? "border-red-400 focus:ring-2 focus:ring-red-200"
                              : "border-gray-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-red-500 font-semibold mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Specialty or Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {role === "doctor" ? "Medical Specialty / License #" : "Date of Birth (Optional)"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {role === "doctor" ? <Stethoscope className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                      </div>
                      <input
                        type={role === "doctor" ? "text" : "date"}
                        value={dobOrSpecialty}
                        onChange={(e) => setDobOrSpecialty(e.target.value)}
                        placeholder={role === "doctor" ? "Cardiology (Lic #12345)" : ""}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Password fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-50/80 border rounded-xl outline-none transition-all ${
                            errors.password
                              ? "border-red-400 focus:ring-2 focus:ring-red-200"
                              : "border-gray-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-[11px] text-red-500 font-semibold mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50/80 border rounded-xl outline-none transition-all ${
                            errors.confirmPassword
                              ? "border-red-400 focus:ring-2 focus:ring-red-200"
                              : "border-gray-200 focus:border-[#00685d] focus:ring-2 focus:ring-[#00685d]/10 focus:bg-white"
                          }`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-[11px] text-red-500 font-semibold mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="pt-0.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1">
                        <span>Password strength:</span>
                        <span className="font-bold text-gray-700">{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 1 ? strength.color : "bg-gray-200"}`} />
                        <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 2 ? strength.color : "bg-gray-200"}`} />
                        <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 3 ? strength.color : "bg-gray-200"}`} />
                      </div>
                    </div>
                  )}

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#00685d] focus:ring-[#00685d] cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-gray-600">
                        I agree to LuminaHealth's{" "}
                        <Link href="/terms-and-conditions" className="font-bold text-[#00685d] hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy-policy" className="font-bold text-[#00685d] hover:underline">
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
                      className={`w-full py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-[#00685d]/20 flex items-center justify-center gap-2 ${
                        isLoading ? "opacity-75 cursor-wait" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Account...</span>
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
    </div>
  );
}
