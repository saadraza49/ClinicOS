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
  PatientFullData, 
  AppointmentData 
} from "@/lib/api";
import Button from "@/components/button";

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
                        {isUpcoming && (
                          cannotCancel ? (
                            <div className="text-right">
                              <button
                                disabled
                                className="text-xs py-2 px-4 bg-gray-100 text-gray-400 border border-gray-200 rounded-xl font-medium cursor-not-allowed"
                                title="Cancellation locked within 2 hours of appointment time"
                              >
                                Cancellation Locked (&lt;2h)
                              </button>
                              <p className="text-[11px] text-gray-500 mt-1">
                                Call support: +92 300 1234567
                              </p>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => handleCancelAppointment(appt.id)}
                              isLoading={cancellingId === appt.id}
                              className="text-xs py-2 px-4 text-error border-error/30 hover:bg-error/10"
                            >
                              Cancel Visit
                            </Button>
                          )
                        )}
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

      </div>
    </div>
  );
}
