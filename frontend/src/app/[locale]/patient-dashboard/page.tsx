"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
  getPatientProfile, 
  updatePatientProfile, 
  getMyAppointments, 
  cancelAppointment, 
  rescheduleAppointment,
  getAvailableSlots,
  PatientFullData, 
  AppointmentData,
  TimeSlotData
} from "@/lib/api";
import Button from "@/components/button";
import DateSelector from "@/components/date-selector";
import { useLocale } from "next-intl";
import { downloadAppointmentPDF } from "@/lib/pdf-generator";
import ReviewModal from "@/components/review-modal";

export default function PatientDashboardPage() {
  const router = useRouter();
  const locale = useLocale();
  const { user, isLoading: authLoading, logout } = useAuth();

  const placeholderAge = locale === "fr" ? "ex. 28" : locale === "zh" ? "例如 28" : "e.g. 28";
  const placeholderKinName = locale === "fr" ? "ex. Jean Martin" : locale === "zh" ? "例如 张伟" : "e.g. John Doe";
  const placeholderKinPhone = locale === "fr" ? "ex. 01 23 45 67 89" : locale === "zh" ? "例如 138 0000 0000" : "e.g. +92 300 0000000";
  const placeholderHistory = locale === "fr" ? "ex. Hypertension, Asthme, Diabète" : locale === "zh" ? "例如 高血压、哮喘、2型糖尿病" : "e.g. Hypertension, Asthma, Type 2 Diabetes";
  const placeholderAllergies = locale === "fr" ? "ex. Pénicilline, Latex, Cacahuètes" : locale === "zh" ? "例如 青霉素、乳胶、花生" : "e.g. Penicillin, Latex, Peanuts";

  const [activeTab, setActiveTab] = useState<"profile" | "appointments" | "actions">("profile");

  // Profile Form State
  const [profileData, setProfileData] = useState<PatientFullData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Profile Inputs
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [allergies, setAllergies] = useState("");

  // Appointments State
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [apptSuccessMsg, setApptSuccessMsg] = useState<string | null>(null);

  // Review Modal State
  const [reviewModalData, setReviewModalData] = useState<{
    isOpen: boolean;
    doctorId: string;
    doctorName: string;
    appointmentId?: string;
  }>({
    isOpen: false,
    doctorId: "",
    doctorName: "",
  });

  // Reschedule Modal State
  const [reschedulingAppt, setReschedulingAppt] = useState<AppointmentData | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
  const [rescheduleTime, setRescheduleTime] = useState<string>("");
  const [rescheduleSlots, setRescheduleSlots] = useState<TimeSlotData[]>([]);
  const [loadingRescheduleSlots, setLoadingRescheduleSlots] = useState<boolean>(false);
  const [submittingReschedule, setSubmittingReschedule] = useState<boolean>(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [todayMinDate, setTodayMinDate] = useState<string>("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTodayMinDate(today);
  }, []);

  useEffect(() => {
    if (!reschedulingAppt || !rescheduleDate) return;
    const targetDoctorId = reschedulingAppt.doctor_id || "any";
    async function fetchSlots() {
      setLoadingRescheduleSlots(true);
      setRescheduleError(null);
      try {
        const slots = await getAvailableSlots(targetDoctorId, rescheduleDate);
        setRescheduleSlots(slots);
        if (rescheduleTime && !slots.some((s) => s.value === rescheduleTime && !s.disabled)) {
          setRescheduleTime("");
        }
      } catch (err) {
        console.error("Error loading reschedule slots:", err);
      } finally {
        setLoadingRescheduleSlots(false);
      }
    }
    fetchSlots();
  }, [reschedulingAppt, rescheduleDate]);

  const handleOpenRescheduleModal = (appt: AppointmentData) => {
    const today = new Date().toISOString().split("T")[0];
    const initialDate = String(appt.appointment_date) >= today ? String(appt.appointment_date) : today;
    setReschedulingAppt(appt);
    setRescheduleDate(initialDate);
    setRescheduleTime(appt.appointment_time || "");
    setRescheduleError(null);
  };

  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppt || !rescheduleDate || !rescheduleTime) {
      setRescheduleError("Please select both a date and an available time slot.");
      return;
    }

    setSubmittingReschedule(true);
    setRescheduleError(null);
    try {
      const updated = await rescheduleAppointment(
        reschedulingAppt.id,
        rescheduleDate,
        rescheduleTime
      );

      setAppointments((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      setApptSuccessMsg(
        `Appointment successfully rescheduled to ${updated.appointment_date} at ${updated.appointment_time}!`
      );
      setReschedulingAppt(null);

      setTimeout(() => {
        setApptSuccessMsg(null);
      }, 6000);
    } catch (err: any) {
      setRescheduleError(err.message || "Failed to reschedule appointment. Please try another slot.");
    } finally {
      setSubmittingReschedule(false);
    }
  };

  // Load Patient Profile & Appointments
  const loadData = async () => {
    try {
      setLoadingProfile(true);
      setLoadingAppts(true);
      const [fullProfile, apptsList] = await Promise.all([
        getPatientProfile().catch(() => null),
        getMyAppointments().catch(() => []),
      ]);

      if (fullProfile) {
        setProfileData(fullProfile);
        if (fullProfile.user.full_name) setFullName(fullProfile.user.full_name);
        if (fullProfile.user.phone) setPhone(fullProfile.user.phone);
        if (fullProfile.profile) {
          if (fullProfile.profile.age !== undefined && fullProfile.profile.age !== null) {
            setAge(String(fullProfile.profile.age));
          }
          if (fullProfile.profile.gender) setGender(fullProfile.profile.gender);
          if (fullProfile.profile.blood_group) setBloodGroup(fullProfile.profile.blood_group);
          if (fullProfile.profile.emergency_contact_name) setEmergencyName(fullProfile.profile.emergency_contact_name);
          if (fullProfile.profile.emergency_contact_phone) setEmergencyPhone(fullProfile.profile.emergency_contact_phone);
          if (fullProfile.profile.medical_history) setMedicalHistory(fullProfile.profile.medical_history);
          if (fullProfile.profile.allergies) setAllergies(fullProfile.profile.allergies);
        }
      }

      setAppointments(apptsList);
    } catch (err) {
      console.error("Error loading patient dashboard data:", err);
    } finally {
      setLoadingProfile(false);
      setLoadingAppts(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
        return;
      }
      loadData();
    }
  }, [user, authLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setUpdatingProfile(true);

    try {
      const updated = await updatePatientProfile({
        full_name: fullName,
        phone: phone,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        blood_group: bloodGroup || undefined,
        emergency_contact_name: emergencyName || undefined,
        emergency_contact_phone: emergencyPhone || undefined,
        medical_history: medicalHistory || undefined,
        allergies: allergies || undefined,
      });

      setProfileData(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      if (err.message && (err.message.includes("credentials") || err.message.includes("401"))) {
        setProfileError("Your login session expired or account data was re-seeded. Please log out and sign in again.");
      } else {
        setProfileError(err.message || "Failed to update profile. Please try again.");
      }
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCancelAppointment = async (apptId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(apptId);
    try {
      await cancelAppointment(apptId);
      setAppointments((prev) =>
        prev.map((a) => (a.id === apptId ? { ...a, status: "cancelled" } : a))
      );
      setApptSuccessMsg("Appointment successfully cancelled.");
      setTimeout(() => setApptSuccessMsg(null), 3500);
    } catch (err: any) {
      alert(err.message || "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  const isCancellationBlocked = (appDateStr: string, appTimeStr: string) => {
    try {
      const [year, month, day] = appDateStr.split("-").map(Number);
      let hours = 9;
      let minutes = 0;
      const match = appTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        const period = match[3]?.toUpperCase();
        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
      }
      const apptDate = new Date(year, month - 1, day, hours, minutes);
      const now = new Date();
      const diffMs = apptDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours <= 2; // Block if 2 hours or less remain
    } catch {
      return false;
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-on-surface-variant font-medium text-body-lg">Loading your patient profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const confirmedAppts = appointments.filter((a) => a.status === "confirmed" || a.status === "pending" || a.status === "in_consultation").length;
  const completedAppts = appointments.filter((a) => a.status === "completed").length;

  return (
    <div className="min-h-screen bg-surface-container-low/30 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#2c336b] to-[#4c549b] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md border-2 border-white">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "P"}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                Patient Portal
              </span>
              <h1 className="text-display-sm md:text-display-md font-bold text-on-surface mt-2">
                Welcome back, {user.full_name}!
              </h1>
              <p className="text-body-md text-on-surface-variant">
                Manage your personal medical details and view upcoming clinical appointments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-end">
            <Button
              variant="outline"
              onClick={logout}
              className="text-xs font-bold py-2.5 px-4 text-error border-error/20 hover:bg-error/10"
            >
              Sign Out
            </Button>
            <Link href="/book-appointment">
              <Button variant="primary" className="text-xs font-bold py-2.5 px-4 shadow-sm">
                Book Visit
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-outline-variant/15 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-variant">Upcoming Visits</p>
              <p className="text-headline-md font-bold text-on-surface">{confirmedAppts}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-outline-variant/15 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">task_alt</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-variant">Completed Consultations</p>
              <p className="text-headline-md font-bold text-on-surface">{completedAppts}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-outline-variant/15 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">medical_information</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-variant">Medical Records</p>
              <p className="text-headline-md font-bold text-on-surface">Active</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant/20 gap-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === "profile" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            My Profile & Health Info
            {activeTab === "profile" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === "appointments" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Appointments & History ({appointments.length})
            {activeTab === "appointments" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("actions")}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === "actions" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Quick Actions
            {activeTab === "actions" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Global Notifications */}
        {apptSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-2xs">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 select-none">check_circle</span>
              {apptSuccessMsg}
            </span>
            <button onClick={() => setApptSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-950">✕</button>
          </div>
        )}

        {/* TAB 1: Profile & Medical History Form */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/15 space-y-6"
          >
            <div className="border-b border-surface-container-high pb-4">
              <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">badge</span>
                Personal & Medical Information
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Keep your profile updated for faster OPD check-in and accurate medical records.
              </p>
            </div>

            {profileSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                Profile details saved successfully!
              </div>
            )}

            {profileError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">error</span>
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Basic Personal Info */}
              <div className="space-y-4">
                <h3 className="text-label-lg font-bold text-on-surface uppercase tracking-wider text-xs border-b border-outline-variant/10 pb-2">
                  Basic Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Age</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder={placeholderAge}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact & Health Indicators */}
              <div className="space-y-4 pt-2">
                <h3 className="text-label-lg font-bold text-on-surface uppercase tracking-wider text-xs border-b border-outline-variant/10 pb-2">
                  Emergency Contact &amp; Blood Type
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer"
                    >
                      <option value="">Select Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder={placeholderKinName}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder={placeholderKinPhone}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Medical History & Allergies */}
              <div className="space-y-4 pt-2">
                <h3 className="text-label-lg font-bold text-on-surface uppercase tracking-wider text-xs border-b border-outline-variant/10 pb-2">
                  Clinical History &amp; Allergies
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Pre-existing Conditions / Medical History</label>
                    <textarea
                      rows={3}
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      placeholder={placeholderHistory}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Known Allergies</label>
                    <textarea
                      rows={3}
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder={placeholderAllergies}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-container-high flex justify-end">
                <Button variant="primary" type="submit" isLoading={updatingProfile} className="text-xs font-bold py-3 px-6 shadow-md">
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* TAB 2: Appointments & History List */}
        {activeTab === "appointments" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant/15 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">event_available</span>
                  Your Appointments History
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  View appointment status, download PDF passes, reschedule slots, or leave doctor reviews.
                </p>
              </div>

              <Link href="/book-appointment">
                <Button variant="primary" className="text-xs font-bold py-2.5 px-4 shadow-sm">
                  + New Appointment
                </Button>
              </Link>
            </div>

            {loadingAppts ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-outline-variant/15 space-y-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-semibold text-on-surface-variant">Fetching your clinical appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-outline-variant/15 flex flex-col items-center">
                <span className="material-symbols-outlined text-primary text-5xl mb-3 select-none">calendar_today</span>
                <h3 className="text-headline-sm font-bold text-on-surface mb-2">No Appointments Found</h3>
                <p className="text-body-md text-on-surface-variant max-w-md mb-6">
                  You haven't scheduled any medical consultations yet. Book a visit with one of our specialized doctors today!
                </p>
                <Link href="/book-appointment">
                  <Button variant="primary">Schedule Appointment</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {appointments.map((appt) => {
                  const isUpcoming = appt.status === "confirmed" || appt.status === "pending" || appt.status === "in_consultation";
                  const cannotCancel = isCancellationBlocked(String(appt.appointment_date), appt.appointment_time);
                  
                  return (
                    <div
                      key={appt.id}
                      className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-headline-sm text-on-surface">
                            {appt.service?.name || "Medical Consultation"}
                          </span>

                          {appt.status === "confirmed" && (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-0.5 rounded-full text-xs font-bold">
                              Confirmed
                            </span>
                          )}
                          {appt.status === "pending" && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-0.5 rounded-full text-xs font-bold">
                              Pending Confirmation
                            </span>
                          )}
                          {appt.status === "in_consultation" && (
                            <span className="bg-purple-100 text-purple-800 border border-purple-300 px-3 py-0.5 rounded-full text-xs font-bold animate-pulse">
                              In Consultation
                            </span>
                          )}
                          {appt.status === "completed" && (
                            <span className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-0.5 rounded-full text-xs font-bold">
                              Completed
                            </span>
                          )}
                          {appt.status === "cancelled" && (
                            <span className="bg-red-100 text-red-800 border border-red-300 px-3 py-0.5 rounded-full text-xs font-bold">
                              Cancelled
                            </span>
                          )}
                          {appt.status === "no_show" && (
                            <span className="bg-gray-100 text-gray-800 border border-gray-300 px-3 py-0.5 rounded-full text-xs font-bold">
                              No Show
                            </span>
                          )}
                          {appt.status === "rescheduled" && (
                            <span className="bg-orange-100 text-orange-800 border border-orange-300 px-3 py-0.5 rounded-full text-xs font-bold">
                              Rescheduled
                            </span>
                          )}
                        </div>

                        <div className="text-body-md text-on-surface-variant flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1 font-semibold text-primary">
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            {String(appt.appointment_date)}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-on-surface">
                            <span className="material-symbols-outlined text-lg">schedule</span>
                            {appt.appointment_time}
                          </span>
                          {appt.doctor && (
                            <span className="flex items-center gap-1 font-medium">
                              <span className="material-symbols-outlined text-lg">stethoscope</span>
                              {appt.doctor.full_name} ({appt.doctor.specialty})
                            </span>
                          )}
                        </div>

                        {appt.reason_for_visit && (
                          <p className="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/10">
                            <strong>Reason:</strong> {appt.reason_for_visit}
                          </p>
                        )}
                        {appt.cancellation_reason && (
                          <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
                            <strong>Cancellation Reason:</strong> {appt.cancellation_reason}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <Button
                            variant="outline"
                            onClick={() => {
                              downloadAppointmentPDF({
                                id: appt.id,
                                patient_name: appt.patient_name || user?.full_name || "Patient",
                                patient_phone: appt.patient_phone || user?.phone || "+92 300 0000000",
                                patient_email: appt.patient_email || user?.email || undefined,
                                doctor_name: appt.doctor?.full_name || "Assigned Specialist",
                                doctor_specialty: appt.doctor?.specialty,
                                service_name: appt.service?.name || "Medical Consultation",
                                appointment_date: String(appt.appointment_date),
                                appointment_time: appt.appointment_time,
                                consultation_fee: appt.service?.price || appt.doctor?.consultation_fee,
                                status: appt.status.toUpperCase(),
                              });
                            }}
                            className="text-xs py-2 px-3 text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high flex items-center gap-1"
                            title="Download PDF Appointment Slip"
                          >
                            <span className="material-symbols-outlined text-base select-none">picture_as_pdf</span>
                            PDF Slip
                          </Button>

                          {!isUpcoming && appt.doctor_id && (
                            <Button
                              variant="primary"
                              onClick={() => {
                                setReviewModalData({
                                  isOpen: true,
                                  doctorId: appt.doctor_id,
                                  doctorName: appt.doctor?.full_name || "Doctor",
                                  appointmentId: appt.id,
                                });
                              }}
                              className="text-xs py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 border-none shadow-2xs"
                            >
                              <span className="material-symbols-outlined text-base select-none">star</span>
                              Rate Doctor
                            </Button>
                          )}

                          {isUpcoming && (
                            cannotCancel ? (
                              <span className="text-[11px] py-1.5 px-3 bg-gray-100 text-gray-500 rounded-xl font-medium border border-gray-200">
                                Locked (&lt;2h)
                              </span>
                            ) : (
                              <>
                                <Button
                                  variant="secondary"
                                  onClick={() => handleOpenRescheduleModal(appt)}
                                  className="text-xs py-2 px-3 text-primary border border-primary/30 hover:bg-primary/10 flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-base select-none">edit_calendar</span>
                                  Reschedule
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleCancelAppointment(appt.id)}
                                  isLoading={cancellingId === appt.id}
                                  className="text-xs py-2 px-3 text-error border-error/30 hover:bg-error/10"
                                >
                                  Cancel
                                </Button>
                              </>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: Quick Actions */}
        {activeTab === "actions" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/15 flex flex-col justify-between items-start">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-3">calendar_month</span>
                <h3 className="text-headline-sm font-bold text-on-surface mb-2">Book a New Consultation</h3>
                <p className="text-body-md text-on-surface-variant mb-6">
                  Schedule an in-person or virtual consultation with our board-certified medical specialists.
                </p>
              </div>
              <Link href="/book-appointment" className="w-full">
                <Button variant="primary" className="w-full justify-center">Book Now</Button>
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/15 flex flex-col justify-between items-start">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-3">medical_services</span>
                <h3 className="text-headline-sm font-bold text-on-surface mb-2">Explore Medical Services</h3>
                <p className="text-body-md text-on-surface-variant mb-6">
                  Browse our full directory of clinical diagnostic, preventive, and specialized care offerings.
                </p>
              </div>
              <Link href="/services" className="w-full">
                <Button variant="outline" className="w-full justify-center">View Services</Button>
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/15 flex flex-col justify-between items-start">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-3">stethoscope</span>
                <h3 className="text-headline-sm font-bold text-on-surface mb-2">Find a Specialist</h3>
                <p className="text-body-md text-on-surface-variant mb-6">
                  View doctor qualifications, years of experience, patient ratings, and consultation fees.
                </p>
              </div>
              <Link href="/doctors" className="w-full">
                <Button variant="outline" className="w-full justify-center">View Doctors</Button>
              </Link>
            </div>
          </motion.div>
        )}

      {/* Reschedule Appointment Modal */}
      <AnimatePresence>
        {reschedulingAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-surface-container-high pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl select-none">edit_calendar</span>
                  <h3 className="text-headline-sm font-bold text-on-surface">Reschedule Appointment</h3>
                </div>
                <button
                  onClick={() => setReschedulingAppt(null)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-2xl select-none">close</span>
                </button>
              </div>

              {rescheduleError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500">error</span>
                  <span>{rescheduleError}</span>
                </div>
              )}

              <form onSubmit={handleConfirmReschedule} className="space-y-5">
                {/* Appointment Summary Card */}
                <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20 text-xs space-y-1.5">
                  <p className="font-bold text-on-surface text-sm">
                    {reschedulingAppt.service?.name || "Medical Visit"}
                  </p>
                  {reschedulingAppt.doctor && (
                    <p className="text-on-surface-variant font-medium">
                      Doctor: <span className="text-primary font-semibold">{reschedulingAppt.doctor.full_name}</span> ({reschedulingAppt.doctor.specialty})
                    </p>
                  )}
                  <p className="text-on-surface-variant">
                    Current Date: <span className="font-semibold text-on-surface">{String(reschedulingAppt.appointment_date)} at {reschedulingAppt.appointment_time}</span>
                  </p>
                </div>

                {/* Date Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    Select New Date <span className="text-error">*</span>
                  </label>
                  <DateSelector
                    value={rescheduleDate}
                    minDate={todayMinDate}
                    onChange={(newD) => setRescheduleDate(newD)}
                  />
                </div>

                {/* Available Time Slots */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface flex justify-between items-center">
                    <span>Select New Time Slot <span className="text-error">*</span></span>
                    {loadingRescheduleSlots && (
                      <span className="text-xs text-primary font-medium animate-pulse">Checking doctor schedule...</span>
                    )}
                  </label>

                  {loadingRescheduleSlots ? (
                    <div className="p-4 bg-surface-container rounded-xl text-center text-xs font-medium text-primary animate-pulse">
                      Checking available time slots for {rescheduleDate}...
                    </div>
                  ) : rescheduleSlots.length === 0 || rescheduleSlots.every((s) => s.disabled) ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-600 select-none">event_busy</span>
                      <span>No available slots on this date. Please pick another day.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                      {rescheduleSlots.map((slot) => (
                        <button
                          key={slot.value}
                          type="button"
                          disabled={slot.disabled}
                          onClick={() => setRescheduleTime(slot.value)}
                          className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            slot.disabled
                              ? "opacity-40 cursor-not-allowed bg-surface-container-low text-on-surface-variant/50 border-outline-variant/30"
                              : rescheduleTime === slot.value
                              ? "bg-primary text-on-primary border-primary shadow-xs scale-102"
                              : "border-outline-variant text-on-surface-variant hover:border-primary hover:bg-primary/5"
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-high">
                  <button
                    type="button"
                    onClick={() => setReschedulingAppt(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={submittingReschedule}
                    disabled={!rescheduleDate || !rescheduleTime || submittingReschedule}
                    className="text-xs px-5 py-2.5"
                  >
                    Confirm Reschedule
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real-time Review Modal */}
      <ReviewModal
        isOpen={reviewModalData.isOpen}
        onClose={() => setReviewModalData((prev) => ({ ...prev, isOpen: false }))}
        doctorId={reviewModalData.doctorId}
        doctorName={reviewModalData.doctorName}
        appointmentId={reviewModalData.appointmentId}
        defaultReviewerName={user?.full_name || ""}
        onReviewSubmitted={() => {
          loadData();
        }}
      />

      </div>
    </div>
  );
}
