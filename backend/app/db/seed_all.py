import json
import uuid
from datetime import date, datetime, timezone
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.models.patient import PatientProfile
from app.models.doctor import Department, DoctorProfile, DoctorSchedule
from app.models.appointment import Service, Appointment, AppointmentReview
from app.models.chat import ChatSession, ChatMessage, FAQ
from app.core.security import get_password_hash

def seed_master_data():
    print("Re-creating and initializing database tables...")
    Base.metadata.create_all(bind=engine)

    # Pre-hash password once for instant seeding speed
    default_hashed_pwd = get_password_hash("password123")

    db = SessionLocal()
    try:

        # ==========================================
        # 1. DEPARTMENTS (10 Records)
        # ==========================================
        departments_data = [
            {"name": "Pediatrics", "slug": "pediatrics", "description": "Healthcare for infants, children, and adolescents.", "icon": "child_care"},
            {"name": "Cardiology", "slug": "cardiology", "description": "Heart care, diagnostic imaging, and preventative cardiology.", "icon": "favorite"},
            {"name": "Dermatology", "slug": "dermatology", "description": "Skin, hair, nail treatments, and cosmetic skincare.", "icon": "sanitizer"},
            {"name": "Primary Care", "slug": "primary-care", "description": "Routine health checkups, preventative care, and wellness.", "icon": "health_and_safety"},
            {"name": "Dentistry", "slug": "dentistry", "description": "Oral health, teeth cleaning, fillings, and dental surgery.", "icon": "medical_services"},
            {"name": "Neurology", "slug": "neurology", "description": "Diagnosis and treatment of nervous system disorders.", "icon": "psychology"},
            {"name": "Orthopedics", "slug": "orthopedics", "description": "Bone, joint, and musculoskeletal care.", "icon": "accessibility_new"},
            {"name": "Ophthalmology", "slug": "ophthalmology", "description": "Eye exams, vision care, and ophthalmic surgeries.", "icon": "visibility"},
            {"name": "ENT (Ear, Nose & Throat)", "slug": "ent", "description": "Care for ear, nose, throat, and head & neck conditions.", "icon": "hearing"},
            {"name": "Psychiatry", "slug": "psychiatry", "description": "Mental health evaluations, counseling, and therapy.", "icon": "self_improvement"}
        ]

        dept_map = {}
        for d in departments_data:
            dept = db.query(Department).filter(Department.slug == d["slug"]).first()
            if not dept:
                dept = Department(**d)
                db.add(dept)
                db.commit()
                db.refresh(dept)
            dept_map[d["slug"]] = dept
        print(f"[SUCCESS] Seeded {len(dept_map)} Departments.")

        # ==========================================
        # 2. PATIENT USERS & PROFILES (10 Records)
        # ==========================================
        patient_seed_data = [
            {"name": "John Doe", "email": "john.doe@example.com", "phone": "+1-555-0101", "dob": date(1988, 3, 14), "gender": "Male", "blood": "O+", "allergies": "Penicillin"},
            {"name": "Jane Smith", "email": "jane.smith@example.com", "phone": "+1-555-0102", "dob": date(1992, 7, 22), "gender": "Female", "blood": "A+", "allergies": "None"},
            {"name": "Michael Johnson", "email": "michael.j@example.com", "phone": "+1-555-0103", "dob": date(1985, 11, 5), "gender": "Male", "blood": "B+", "allergies": "Dust, Latex"},
            {"name": "Sarah Williams", "email": "sarah.w@example.com", "phone": "+1-555-0104", "dob": date(1995, 1, 30), "gender": "Female", "blood": "AB+", "allergies": "Peanuts"},
            {"name": "David Brown", "email": "david.b@example.com", "phone": "+1-555-0105", "dob": date(1978, 9, 18), "gender": "Male", "blood": "O-", "allergies": "Aspirin"},
            {"name": "Emily Davis", "email": "emily.d@example.com", "phone": "+1-555-0106", "dob": date(2000, 4, 12), "gender": "Female", "blood": "A-", "allergies": "None"},
            {"name": "James Taylor", "email": "james.t@example.com", "phone": "+1-555-0107", "dob": date(1982, 6, 25), "gender": "Male", "blood": "B-", "allergies": "Sulfa drugs"},
            {"name": "Jessica Anderson", "email": "jessica.a@example.com", "phone": "+1-555-0108", "dob": date(1991, 12, 8), "gender": "Female", "blood": "O+", "allergies": "None"},
            {"name": "Robert Martinez", "email": "robert.m@example.com", "phone": "+1-555-0109", "dob": date(1974, 2, 19), "gender": "Male", "blood": "AB-", "allergies": "Ibuprofen"},
            {"name": "Amanda White", "email": "amanda.w@example.com", "phone": "+1-555-0110", "dob": date(1998, 8, 14), "gender": "Female", "blood": "A+", "allergies": "Pollen"}
        ]

        patients_list = []
        for p in patient_seed_data:
            user = db.query(User).filter(User.email == p["email"]).first()
            if not user:
                user = User(
                    full_name=p["name"],
                    email=p["email"],
                    phone=p["phone"],
                    role="patient",
                    hashed_password=default_hashed_pwd
                )
                db.add(user)
                db.commit()
                db.refresh(user)

            profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
            if not profile:
                profile = PatientProfile(
                    user_id=user.id,
                    date_of_birth=p["dob"],
                    age=2026 - p["dob"].year,
                    gender=p["gender"],
                    blood_group=p["blood"],
                    emergency_contact_name=f"Emergency {p['name'].split()[0]}",
                    emergency_contact_phone=p["phone"][:-2] + "99",
                    medical_history=f"Regular medical profile for {p['name']}.",
                    allergies=p["allergies"]
                )
                db.add(profile)
                db.commit()
                db.refresh(profile)
            patients_list.append(user)
        print(f"[SUCCESS] Seeded {len(patients_list)} Patients & Profiles.")

        # ==========================================
        # 3. DOCTORS & SCHEDULES (10 Records)
        # ==========================================
        doctors_seed_data = [
            {"name": "Dr. Elena Rodriguez", "email": "elena.r@luminahealth.com", "slug": "elena-rodriguez", "specialty": "Pediatrics", "dept": "pediatrics", "gender": "Female", "fee": 150.0, "qual": "MD, FAAP", "exp": 12},
            {"name": "Dr. Robert Miller", "email": "robert.m@luminahealth.com", "slug": "robert-miller", "specialty": "Pediatrics", "dept": "pediatrics", "gender": "Male", "fee": 150.0, "qual": "MD, Pediatric Specialist", "exp": 14},
            {"name": "Dr. Marcus Vance", "email": "marcus.v@luminahealth.com", "slug": "marcus-vance", "specialty": "Cardiology", "dept": "cardiology", "gender": "Male", "fee": 250.0, "qual": "MD, FACC", "exp": 22},
            {"name": "Dr. Sarah Jenkins", "email": "sarah.j@luminahealth.com", "slug": "sarah-jenkins", "specialty": "Cardiology", "dept": "cardiology", "gender": "Female", "fee": 250.0, "qual": "MD, FACC, FSCAI", "exp": 16},
            {"name": "Dr. Omar Al-Fayed", "email": "omar.a@luminahealth.com", "slug": "omar-al-fayed", "specialty": "Dermatology", "dept": "dermatology", "gender": "Male", "fee": 180.0, "qual": "MD, FAAD", "exp": 10},
            {"name": "Dr. Sophia Carter", "email": "sophia.c@luminahealth.com", "slug": "sophia-carter", "specialty": "Dermatology", "dept": "dermatology", "gender": "Female", "fee": 180.0, "qual": "MD, Skincare Specialist", "exp": 8},
            {"name": "Dr. James Wilson", "email": "james.w@luminahealth.com", "slug": "james-wilson", "specialty": "Primary Care", "dept": "primary-care", "gender": "Male", "fee": 120.0, "qual": "MD, ABFM", "exp": 15},
            {"name": "Dr. Fatima Ali", "email": "fatima.a@luminahealth.com", "slug": "fatima-ali", "specialty": "Primary Care", "dept": "primary-care", "gender": "Female", "fee": 120.0, "qual": "MD, Family Medicine", "exp": 11},
            {"name": "Dr. Bilal Ahmed", "email": "bilal.a@luminahealth.com", "slug": "bilal-ahmed", "specialty": "Dentistry", "dept": "dentistry", "gender": "Male", "fee": 140.0, "qual": "DDS, Cosmetic Dentist", "exp": 9},
            {"name": "Dr. Priya Patel", "email": "priya.p@luminahealth.com", "slug": "priya-patel", "specialty": "Neurology", "dept": "neurology", "gender": "Female", "fee": 200.0, "qual": "MD, PhD", "exp": 9}
        ]

        doctors_list = []
        for doc in doctors_seed_data:
            user = db.query(User).filter(User.email == doc["email"]).first()
            if not user:
                user = User(
                    full_name=doc["name"],
                    email=doc["email"],
                    role="doctor",
                    hashed_password=default_hashed_pwd
                )
                db.add(user)
                db.commit()
                db.refresh(user)

            profile = db.query(DoctorProfile).filter(DoctorProfile.slug == doc["slug"]).first()
            if not profile:
                dept = dept_map.get(doc["dept"])
                profile = DoctorProfile(
                    user_id=user.id,
                    department_id=dept.id if dept else None,
                    slug=doc["slug"],
                    full_name=doc["name"],
                    photo=f"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300",
                    specialty=doc["specialty"],
                    qualifications=doc["qual"],
                    experience_years=doc["exp"],
                    languages="English, Spanish" if doc["gender"] == "Female" else "English",
                    bio=f"{doc['name']} is a board-certified {doc['specialty']} specialist with {doc['exp']} years of experience.",
                    gender=doc["gender"],
                    consultation_fee=doc["fee"],
                    rating=4.9,
                    review_count=45
                )
                db.add(profile)
                db.commit()
                db.refresh(profile)

                # Add 2 Schedules per doctor
                s1 = DoctorSchedule(doctor_id=profile.id, day_of_week="Mon", start_time="09:00 AM", end_time="05:00 PM")
                s2 = DoctorSchedule(doctor_id=profile.id, day_of_week="Wed", start_time="09:00 AM", end_time="05:00 PM")
                db.add_all([s1, s2])
                db.commit()

            doctors_list.append(profile)
        print(f"[SUCCESS] Seeded {len(doctors_list)} Doctors & Profiles.")

        # ==========================================
        # 4. SERVICES (10 Records)
        # ==========================================
        services_seed_data = [
            {"name": "General Pediatric Checkup", "slug": "pediatric-checkup", "dept": "pediatrics", "price": 150.0, "icon": "child_care"},
            {"name": "Child Vaccination & Immunization", "slug": "child-vaccination", "dept": "pediatrics", "price": 90.0, "icon": "vaccines"},
            {"name": "Cardiovascular Health Assessment", "slug": "cardio-assessment", "dept": "cardiology", "price": 250.0, "icon": "favorite"},
            {"name": "ECG & Heart Function Exam", "slug": "ecg-exam", "dept": "cardiology", "price": 180.0, "icon": "monitor_heart"},
            {"name": "Acne & Skin Consultation", "slug": "skin-consultation", "dept": "dermatology", "price": 180.0, "icon": "sanitizer"},
            {"name": "Dental Cleaning & Polishing", "slug": "dental-cleaning", "dept": "dentistry", "price": 140.0, "icon": "clean_hands"},
            {"name": "Neurological Headaches & Sleep Exam", "slug": "neuro-exam", "dept": "neurology", "price": 200.0, "icon": "psychology"},
            {"name": "Primary Care Annual Wellness Exam", "slug": "annual-wellness", "dept": "primary-care", "price": 120.0, "icon": "health_and_safety"},
            {"name": "Comprehensive Vision & Eye Exam", "slug": "eye-exam", "dept": "ophthalmology", "price": 130.0, "icon": "visibility"},
            {"name": "Orthopedic Joint & Bone Exam", "slug": "ortho-joint-exam", "dept": "orthopedics", "price": 210.0, "icon": "accessibility_new"}
        ]

        services_list = []
        for s in services_seed_data:
            srv = db.query(Service).filter(Service.slug == s["slug"]).first()
            if not srv:
                dept = dept_map.get(s["dept"])
                srv = Service(
                    name=s["name"],
                    slug=s["slug"],
                    department_id=dept.id if dept else None,
                    short_description=f"Professional {s['name']} service.",
                    full_description=f"Complete consultation and evaluation for {s['name']}.",
                    price=s["price"],
                    duration_minutes=30,
                    icon=s["icon"],
                    is_popular=True
                )
                db.add(srv)
                db.commit()
                db.refresh(srv)
            services_list.append(srv)
        print(f"[SUCCESS] Seeded {len(services_list)} Services.")

        # ==========================================
        # 5. APPOINTMENTS (10 Records)
        # ==========================================
        appointments_list = []
        for i in range(10):
            patient = patients_list[i % len(patients_list)]
            doctor = doctors_list[i % len(doctors_list)]
            service = services_list[i % len(services_list)]

            appt_id = f"demo-appointment-{i+1}"
            appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
            if not appt:
                appt = Appointment(
                    id=appt_id,
                    patient_id=patient.id,
                    doctor_id=doctor.id,
                    service_id=service.id,
                    department_id=doctor.department_id,
                    patient_name=patient.full_name,
                    patient_phone=patient.phone or "+1-555-0100",
                    patient_email=patient.email,
                    patient_age=30 + i,
                    patient_gender="Female" if i % 2 == 0 else "Male",
                    appointment_date=date(2026, 8, 1 + i),
                    appointment_time=f"{9 + i % 6}:00 AM",
                    status="confirmed" if i % 2 == 0 else "completed",
                    reason_for_visit=f"Routine consultation for {service.name}",
                    booking_source="chatbot" if i % 2 == 0 else "web"
                )
                db.add(appt)
                db.commit()
                db.refresh(appt)
            appointments_list.append(appt)
        print(f"[SUCCESS] Seeded {len(appointments_list)} Appointments.")

        # ==========================================
        # 6. APPOINTMENT REVIEWS (10 Records)
        # ==========================================
        reviews_list = []
        for i in range(10):
            appt = appointments_list[i]
            rev_id = f"demo-review-{i+1}"
            rev = db.query(AppointmentReview).filter(AppointmentReview.id == rev_id).first()
            if not rev:
                rev = AppointmentReview(
                    id=rev_id,
                    appointment_id=appt.id,
                    doctor_id=appt.doctor_id,
                    patient_id=appt.patient_id,
                    reviewer_name=appt.patient_name,
                    rating=5 if i % 3 != 0 else 4,
                    review_text=f"Wonderful experience! {appt.patient_name} highly recommends this doctor.",
                    is_verified=True
                )
                db.add(rev)
                db.commit()
                db.refresh(rev)
            reviews_list.append(rev)
        print(f"[SUCCESS] Seeded {len(reviews_list)} Appointment Reviews.")

        # ==========================================
        # 7. CHAT SESSIONS & MESSAGES (10 Sessions + Messages)
        # ==========================================
        sessions_list = []
        for i in range(10):
            token = f"chat-session-token-{i+1}"
            sess = db.query(ChatSession).filter(ChatSession.session_token == token).first()
            if not sess:
                patient = patients_list[i % len(patients_list)]
                sess = ChatSession(
                    user_id=patient.id,
                    session_token=token,
                    title=f"Chat Inquiry #{i+1} - {patient.full_name}",
                    status="active" if i % 2 == 0 else "completed",
                    booking_state=json.dumps({"step": "completed", "patient": patient.full_name})
                )
                db.add(sess)
                db.commit()
                db.refresh(sess)

                # Add User and Assistant Messages
                m1 = ChatMessage(session_id=sess.id, sender="user", content=f"Hello, I'd like to ask about consultation fees for {doctors_list[i].specialty}.")
                m2 = ChatMessage(session_id=sess.id, sender="assistant", content=f"Hello {patient.full_name}! Consultation with {doctors_list[i].full_name} is ${doctors_list[i].consultation_fee:.2f}.")
                db.add_all([m1, m2])
                db.commit()
            sessions_list.append(sess)
        print(f"[SUCCESS] Seeded {len(sessions_list)} Chat Sessions & Messages.")

        # ==========================================
        # 8. FAQS (10 Records)
        # ==========================================
        faqs_seed_data = [
            {"cat": "Hours & Location", "q": "What are your opening hours?", "a": "We are open Monday through Saturday from 8:00 AM to 9:00 PM."},
            {"cat": "Appointments", "q": "How can I book an appointment?", "a": "You can book directly via our online website or by talking to our 24/7 AI Assistant."},
            {"cat": "Billing & Insurance", "q": "Which insurance providers do you accept?", "a": "We accept major insurance plans including Aetna, Blue Cross, Cigna, and UnitedHealth."},
            {"cat": "Emergency Care", "q": "What should I do in an emergency?", "a": "Call our emergency helpline at +92 300 1234567 or visit the nearest ER immediately."},
            {"cat": "Virtual Consultations", "q": "Do you offer online telehealth appointments?", "a": "Yes! Video consultations are available for Primary Care and Dermatology."},
            {"cat": "Medical Records", "q": "How do I request my medical records?", "a": "Log in to your patient portal account to view and download your health history."},
            {"cat": "Prescription Refills", "q": "How do I request a prescription refill?", "a": "Send a request via your patient portal or ask your pharmacy to submit a refill authorization."},
            {"cat": "Pediatrics", "q": "At what age should my child see a pediatrician?", "a": "We care for newborn babies up to 18-year-old adolescents."},
            {"cat": "COVID-19 & Vaccines", "q": "Are walk-in vaccinations available?", "a": "Yes, walk-in vaccinations are available Monday to Friday from 10:00 AM to 4:00 PM."},
            {"cat": "Parking & Accessibility", "q": "Is free parking available at the clinic?", "a": "Yes, free visitor parking is provided in the front garage with wheelchair access."}
        ]

        faqs_list = []
        for idx, f in enumerate(faqs_seed_data):
            faq = db.query(FAQ).filter(FAQ.question == f["q"]).first()
            if not faq:
                faq = FAQ(
                    category=f["cat"],
                    question=f["q"],
                    answer=f["a"],
                    is_published=True,
                    display_order=idx + 1
                )
                db.add(faq)
                db.commit()
                db.refresh(faq)
            faqs_list.append(faq)
        print(f"[SUCCESS] Seeded {len(faqs_list)} FAQs.")

        print("\n==========================================")
        print("[SUCCESS] ALL 11 TABLES SEEDED SUCCESSFULLY (10+ RECORDS EACH)!")
        print("==========================================")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Master seed failed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_master_data()
