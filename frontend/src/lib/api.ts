import { doctors as fallbackDoctors } from "@/data/doctors";
import { services as fallbackServices } from "@/data/services";
import { faqs as fallbackFaqs } from "@/data/faqs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface DepartmentData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface DoctorScheduleData {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}

export interface DoctorData {
  id: string;
  slug: string;
  full_name: string;
  photo?: string;
  specialty: string;
  qualifications?: string;
  experience_years: number;
  languages?: string;
  bio?: string;
  gender?: string;
  consultation_fee: number;
  rating: number;
  review_count: number;
  department?: DepartmentData;
  schedules?: DoctorScheduleData[];
}

export interface ServiceData {
  id: string;
  department_id?: string;
  name: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  price: number;
  duration_minutes: number;
  icon?: string;
  is_popular: boolean;
  department?: DepartmentData;
}

export interface TimeSlotData {
  value: string;
  label: string;
  disabled: boolean;
}

export interface FAQData {
  id: string;
  category: string;
  question: string;
  answer: string;
  is_published: boolean;
  display_order: number;
}

export interface BookAppointmentPayload {
  doctor_id: string;
  service_id?: string;
  department_id?: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  patient_age?: number;
  patient_gender?: string;
  appointment_date: string;
  appointment_time: string;
  reason_for_visit?: string;
}

export interface AppointmentData {
  id: string;
  patient_id?: string;
  doctor_id: string;
  service_id?: string;
  department_id?: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  patient_age?: number;
  patient_gender?: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason_for_visit?: string;
  cancellation_reason?: string;
  notes?: string;
  booking_source: string;
  doctor?: DoctorData;
  service?: ServiceData;
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout for DB queries

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
      credentials: "include",
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ detail: "Network request failed" }));
      throw new Error(errorBody.detail || `Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      throw new Error("Cannot connect to backend server. Please make sure FastAPI backend is running on http://127.0.0.1:8000.");
    }
    throw err;
  }
}

// Map static fallback doctor format to DoctorData
function mapFallbackDoctor(doc: any): DoctorData {
  return {
    id: doc.id,
    slug: doc.slug,
    full_name: doc.name,
    photo: doc.photo,
    specialty: doc.specialty,
    qualifications: doc.qualifications,
    experience_years: doc.yearsExperience || 10,
    languages: Array.isArray(doc.languages) ? doc.languages.join(", ") : doc.languages,
    bio: doc.bio,
    consultation_fee: 1500,
    rating: doc.rating || 5.0,
    review_count: doc.reviewCount || 45,
    department: {
      id: doc.specialty.toLowerCase(),
      name: doc.specialty,
      slug: doc.specialty.toLowerCase(),
    },
    schedules: (doc.availableDays || ["Mon", "Wed", "Fri"]).map((day: string, idx: number) => ({
      id: `sched-${idx}`,
      day_of_week: day,
      start_time: "09:00 AM",
      end_time: "05:00 PM",
      slot_duration_minutes: 30,
      is_active: true,
    })),
  };
}

// Map static fallback service format to ServiceData
function mapFallbackService(svc: any): ServiceData {
  const priceNum = typeof svc.price === "number" ? svc.price : parseFloat(String(svc.price).replace(/[^0-9.]/g, "")) || 1500;
  return {
    id: svc.id,
    department_id: svc.category,
    name: svc.name,
    slug: svc.slug,
    short_description: svc.shortDescription || svc.description,
    full_description: svc.fullDescription || svc.description,
    price: priceNum,
    duration_minutes: 30,
    icon: svc.icon || "medical_services",
    is_popular: true,
    department: {
      id: svc.category,
      name: svc.category.charAt(0).toUpperCase() + svc.category.slice(1),
      slug: svc.category,
    },
  };
}

// ==================== DOCTORS ====================
export async function getDoctors(params?: { department?: string; search?: string }): Promise<DoctorData[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.department) queryParams.append("department", params.department);
    if (params?.search) queryParams.append("search", params.search);
    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const data = await fetchAPI<DoctorData[]>(`/doctors${queryStr}`);
    if (Array.isArray(data) && data.length > 0) return data;
    return fallbackDoctors.map(mapFallbackDoctor);
  } catch (err) {
    console.warn("Backend API unavailable or timed out, using fallback doctors dataset:", err);
    return fallbackDoctors.map(mapFallbackDoctor);
  }
}

export async function getDoctorBySlug(slugOrId: string): Promise<DoctorData | null> {
  try {
    return await fetchAPI<DoctorData>(`/doctors/${slugOrId}`);
  } catch (err) {
    console.error(`Failed to fetch doctor ${slugOrId} from backend database:`, err);
    return null;
  }
}

// ==================== SERVICES ====================
export async function getServices(params?: { category?: string; search?: string; popular_only?: boolean }): Promise<ServiceData[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.popular_only) queryParams.append("popular_only", "true");
    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return await fetchAPI<ServiceData[]>(`/services${queryStr}`);
  } catch (err) {
    console.warn("Backend API unavailable, using fallback services dataset:", err);
    return fallbackServices.map(mapFallbackService);
  }
}

export async function getServiceBySlug(slugOrId: string): Promise<ServiceData> {
  try {
    return await fetchAPI<ServiceData>(`/services/${slugOrId}`);
  } catch (err) {
    console.warn(`Backend API unavailable for service ${slugOrId}, using fallback:`, err);
    const found = fallbackServices.find(s => s.slug === slugOrId || s.id === slugOrId) || fallbackServices[0];
    return mapFallbackService(found);
  }
}

// ==================== DEPARTMENTS ====================
export async function getDepartments(): Promise<DepartmentData[]> {
  try {
    return await fetchAPI<DepartmentData[]>("/departments");
  } catch (err) {
    console.warn("Backend API unavailable, using fallback departments:", err);
    return [
      { id: "general", name: "General Care", slug: "general", description: "Routine health checkups.", icon: "health_and_safety" },
      { id: "diagnostics", name: "Diagnostics", slug: "diagnostics", description: "Lab blood tests & imaging.", icon: "biotech" },
      { id: "vaccinations", name: "Vaccinations", slug: "vaccinations", description: "Pediatric & travel vaccines.", icon: "vaccines" },
      { id: "mental-health", name: "Mental Health", slug: "mental-health", description: "Psychiatry & counseling.", icon: "psychology" },
      { id: "wellness", name: "Wellness", slug: "wellness", description: "Dietary & lifestyle assessments.", icon: "monitor_heart" },
    ];
  }
}

// ==================== APPOINTMENTS ====================
export async function getAvailableSlots(doctorId: string, dateStr: string): Promise<TimeSlotData[]> {
  try {
    const queryParams = new URLSearchParams({ appointment_date: dateStr });
    if (doctorId && doctorId !== "any") queryParams.append("doctor_id", doctorId);
    return await fetchAPI<TimeSlotData[]>(`/appointments/slots?${queryParams.toString()}`);
  } catch (err) {
    console.warn("Backend API unavailable, using fallback slots:", err);
    return [
      { value: "09:00", label: "09:00 AM", disabled: false },
      { value: "09:30", label: "09:30 AM", disabled: false },
      { value: "10:00", label: "10:00 AM", disabled: false },
      { value: "11:30", label: "11:30 AM", disabled: false },
      { value: "13:00", label: "01:00 PM", disabled: false },
      { value: "14:30", label: "02:30 PM", disabled: false },
      { value: "15:00", label: "03:00 PM", disabled: true },
      { value: "16:30", label: "04:30 PM", disabled: false },
    ];
  }
}

export async function bookAppointment(payload: BookAppointmentPayload): Promise<AppointmentData> {
  return await fetchAPI<AppointmentData>("/appointments/book", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface PatientProfileData {
  id: string;
  user_id?: string;
  date_of_birth?: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_history?: string;
  allergies?: string;
}

export interface PatientFullData {
  user: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    role: string;
    created_at: string;
  };
  profile: PatientProfileData;
}

export async function getMyAppointments(): Promise<AppointmentData[]> {
  try {
    return await fetchAPI<AppointmentData[]>("/appointments/my-appointments");
  } catch (err) {
    return [];
  }
}

export async function cancelAppointment(appointmentId: string): Promise<AppointmentData> {
  return await fetchAPI<AppointmentData>(`/appointments/${appointmentId}/cancel`, {
    method: "PUT",
  });
}

export async function rescheduleAppointment(appointmentId: string, newDate: string, newTime: string, reason?: string): Promise<AppointmentData> {
  return await fetchAPI<AppointmentData>(`/appointments/${appointmentId}/reschedule`, {
    method: "PUT",
    body: JSON.stringify({
      new_date: newDate,
      new_time: newTime,
      reason: reason || undefined,
    }),
  });
}

// ==================== PATIENT PROFILE ====================
export async function getPatientProfile(): Promise<PatientFullData> {
  return await fetchAPI<PatientFullData>("/patients/me");
}

export async function updatePatientProfile(payload: Partial<PatientProfileData> & { full_name?: string; phone?: string }): Promise<PatientFullData> {
  return await fetchAPI<PatientFullData>("/patients/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ==================== FAQS ====================
export async function getFAQs(params?: { category?: string; search?: string }): Promise<FAQData[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);
    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return await fetchAPI<FAQData[]>(`/faqs${queryStr}`);
  } catch (err) {
    console.warn("Backend API unavailable, using fallback FAQs dataset:", err);
    return fallbackFaqs.map((faq, idx) => ({
      id: faq.id,
      category: faq.category.charAt(0).toUpperCase() + faq.category.slice(1),
      question: faq.question,
      answer: faq.answer,
      is_published: true,
      display_order: idx,
    }));
  }
}

// ==================== REVIEWS & RATINGS ====================
export interface ReviewData {
  id: string;
  appointment_id?: string;
  doctor_id: string;
  patient_id?: string;
  reviewer_name: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

export interface ReviewCreatePayload {
  doctor_id: string;
  appointment_id?: string;
  reviewer_name: string;
  rating: number;
  review_text?: string;
}

export async function getDoctorReviews(slugOrId: string): Promise<ReviewData[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/doctors/${slugOrId}/reviews`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch doctor reviews:", err);
    return [];
  }
}

export async function submitDoctorReview(payload: ReviewCreatePayload): Promise<ReviewData> {
  const res = await fetch(`${API_BASE_URL}/doctors/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit review");
  }
  return await res.json();
}
