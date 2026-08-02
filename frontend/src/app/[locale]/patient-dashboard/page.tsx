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
<<<<<<< HEAD
  PatientFullData, 
  AppointmentData 
} from "@/lib/api";
import Button from "@/components/button";
=======
  rescheduleAppointment,
  getAvailableSlots,
  PatientFullData, 
  AppointmentData,
  TimeSlotData
} from "@/lib/api";
import Button from "@/components/button";
import DateSelector from "@/components/date-selector";
import { downloadAppointmentPDF } from "@/lib/pdf-generator";
import ReviewModal from "@/components/review-modal";
>>>>>>> origin/business-logic

export default function PatientDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();

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

<<<<<<< HEAD
  // Load Patient Profile & Appointments
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");

      async function loadData() {
        try {
          setLoadingProfile(true);
          setLoadingAppts(true);

          const [fullProfile, apptsList] = await Promise.all([
            getPatientProfile().catch(() => null),
            getMyAppointments().catch(() => [])
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
      }
=======
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
>>>>>>> origin/business-logic
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

<<<<<<< HEAD
=======
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

>>>>>>> origin/business-logic
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

<<<<<<< HEAD
  const confirmedAppts = appointments.filter((a) => a.status === "confirmed" || a.status === "pending").length;
=======
  const confirmedAppts = appointments.filter((a) => a.status === "confirmed" || a.status === "pending" || a.status === "in_consultation").length;
>>>>>>> origin/business-logic
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
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-headline-md md:text-display-md text-on-surface font-extrabold">
                  {user.full_name}
                </h1>
                <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Patient
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant flex items-center gap-3 flex-wrap">
                <span>📧 {user.email}</span>
                {user.phone && <span>📞 {user.phone}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end relative z-10 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
            <div className="text-center px-4 py-2 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <span className="block text-headline-sm font-bold text-primary">{appointments.length}</span>
              <span className="text-xs text-on-surface-variant font-semibold">Total Visits</span>
            </div>
            <div className="text-center px-4 py-2 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <span className="block text-headline-sm font-bold text-emerald-600">{confirmedAppts}</span>
              <span className="text-xs text-on-surface-variant font-semibold">Upcoming</span>
            </div>
            <div className="text-center px-4 py-2 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <span className="block text-headline-sm font-bold text-blue-600">{completedAppts}</span>
              <span className="text-xs text-on-surface-variant font-semibold">Completed</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-outline-variant/15 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-[#2c336b] text-white shadow-sm"
                : "text-on-surface-variant hover:bg-white hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            My Profile &amp; Medical Info
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "appointments"
                ? "bg-[#2c336b] text-white shadow-sm"
                : "text-on-surface-variant hover:bg-white hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            My Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab("actions")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "actions"
                ? "bg-[#2c336b] text-white shadow-sm"
                : "text-on-surface-variant hover:bg-white hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Quick Actions
          </button>
        </div>

        {/* TAB 1: Profile & Medical Info */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/15"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-6">
              <div>
                <h2 className="text-headline-sm font-bold text-on-surface">Personal &amp; Medical Profile</h2>
                <p className="text-body-md text-on-surface-variant">Keep your contact information and health details up to date.</p>
              </div>
            </div>

            {profileSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                <span>Profile details successfully saved and updated!</span>
              </div>
            )}

            {profileError && (
              <div className="mb-6 p-4 bg-error/10 border border-error/30 text-error rounded-2xl text-sm font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">error_outline</span>
                  <span>{profileError}</span>
                </div>
                {profileError.includes("expired") || profileError.includes("credentials") ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      router.push("/login");
                    }}
                    className="px-4 py-2 bg-[#2c336b] text-white text-xs font-bold rounded-full hover:bg-[#3b4486] transition-all shrink-0 cursor-pointer shadow-sm"
                  >
                    Sign Out &amp; Re-login
                  </button>
                ) : null}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-label-md font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">badge</span>
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1" htmlFor="age">
                      Age
                    </label>
                    <input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1" htmlFor="gender">
                      Gender
                    </label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-outline-variant/10" />

              {/* Medical & Emergency Contact */}
              <div>
                <h3 className="text-label-md font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">medical_information</span>
                  Medical &amp; Emergency Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1" htmlFor="bloodGroup">
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1" htmlFor="emergencyName">
                      Emergency Contact Name
                    </label>
                    <input
                      id="emergencyName"
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="e.g. Jane Doe (Spouse)"
                      className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1" htmlFor="emergencyPhone">
                      Emergency Contact Phone
                    </label>
                    <input
                      id="emergencyPhone"
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="e.g. +1 555-0192"
                      className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1" htmlFor="allergies">
                      Allergies &amp; Sensitivities
                    </label>
                    <textarea
                      id="allergies"
                      rows={3}
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="List any known allergies (e.g. Penicillin, Latex, Peanuts)..."
                      className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1" htmlFor="medicalHistory">
                      Medical History / Past Conditions
                    </label>
                    <textarea
                      id="medicalHistory"
                      rows={3}
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      placeholder="List any pre-existing medical conditions, past surgeries, or ongoing care..."
                      className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" type="submit" isLoading={updatingProfile} className="px-8 py-3">
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* TAB 2: My Appointments */}
        {activeTab === "appointments" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/15 flex justify-between items-center">
              <div>
                <h2 className="text-headline-sm font-bold text-on-surface">My Appointments History</h2>
                <p className="text-body-md text-on-surface-variant">View and manage your upcoming consultations and past medical visits.</p>
              </div>
              <Link href="/book-appointment">
                <Button variant="primary" className="text-xs py-2.5 px-4">
                  + Book New Visit
                </Button>
              </Link>
            </div>

            {apptSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                <span>{apptSuccessMsg}</span>
              </div>
            )}

            {loadingAppts ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-outline-variant/15">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-on-surface-variant font-medium">Fetching your appointments...</p>
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
<<<<<<< HEAD
                  const isUpcoming = appt.status === "confirmed" || appt.status === "pending";
                  const isCancelled = appt.status === "cancelled";
=======
                  const isUpcoming = appt.status === "confirmed" || appt.status === "pending" || appt.status === "in_consultation";
                  const cannotCancel = isCancellationBlocked(String(appt.appointment_date), appt.appointment_time);
>>>>>>> origin/business-logic
                  
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
<<<<<<< HEAD
=======
                          {appt.status === "in_consultation" && (
                            <span className="bg-purple-100 text-purple-800 border border-purple-300 px-3 py-0.5 rounded-full text-xs font-bold animate-pulse">
                              In Consultation
                            </span>
                          )}
>>>>>>> origin/business-logic
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
<<<<<<< HEAD
=======
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
>>>>>>> origin/business-logic
                        </div>

                        <div className="text-body-md text-on-surface-variant flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1 font-semibold text-primary">
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
<<<<<<< HEAD
                            {appt.appointment_date}
=======
                            {String(appt.appointment_date)}
>>>>>>> origin/business-logic
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
<<<<<<< HEAD
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        {isUpcoming && (
                          <Button
                            variant="outline"
                            onClick={() => handleCancelAppointment(appt.id)}
                            isLoading={cancellingId === appt.id}
                            className="text-xs py-2 px-4 text-error border-error/30 hover:bg-error/10"
                          >
                            Cancel Visit
                          </Button>
                        )}
=======
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
>>>>>>> origin/business-logic
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

<<<<<<< HEAD
=======
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

>>>>>>> origin/business-logic
      </div>
    </div>
  );
}
