from datetime import date
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.appointment import Service, Appointment, AppointmentReview
from app.models.doctor import Department, DoctorProfile
from app.models.patient import PatientProfile
from app.models.user import User

def seed_module3():
    print("Creating Module 3 tables in database...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Get existing department & doctor
        peds_dept = db.query(Department).filter(Department.slug == "pediatrics").first()
        cardio_dept = db.query(Department).filter(Department.slug == "cardiology").first()
        dr_elena = db.query(DoctorProfile).filter(DoctorProfile.slug == "elena-rodriguez").first()
        dr_marcus = db.query(DoctorProfile).filter(DoctorProfile.slug == "marcus-vance").first()
        patient_user = db.query(User).filter(User.email == "john.doe@example.com").first()
        patient_profile = db.query(PatientProfile).filter(PatientProfile.user_id == patient_user.id).first() if patient_user else None
        patient_profile_id = patient_profile.id if patient_profile else None

        # Seed Services
        services_data = [
            {
                "name": "General Pediatric Checkup",
                "slug": "pediatric-checkup",
                "department_id": peds_dept.id if peds_dept else None,
                "short_description": "Comprehensive physical exam and developmental assessment for children.",
                "full_description": "Includes growth tracking, vaccinations, developmental milestones review, and parental guidance.",
                "price": 150.0,
                "duration_minutes": 30,
                "icon": "child_care",
                "is_popular": True
            },
            {
                "name": "Cardiovascular Health Evaluation",
                "slug": "cardio-evaluation",
                "department_id": cardio_dept.id if cardio_dept else None,
                "short_description": "In-depth heart health evaluation and diagnostic consultation.",
                "full_description": "Includes ECG review, blood pressure management, cholesterol screening, and risk factor assessment.",
                "price": 250.0,
                "duration_minutes": 45,
                "icon": "favorite",
                "is_popular": True
            }
        ]

        services_map = {}
        for s_data in services_data:
            srv = db.query(Service).filter(Service.slug == s_data["slug"]).first()
            if not srv:
                srv = Service(**s_data)
                db.add(srv)
                db.commit()
                db.refresh(srv)
                print(f"[CREATED] Service: {srv.name}")
            services_map[srv.slug] = srv

        # Seed Appointments
        if dr_elena:
            appt = db.query(Appointment).filter(Appointment.patient_name == "John Doe", Appointment.doctor_id == dr_elena.id).first()
            if not appt:
                appt = Appointment(
                    patient_id=patient_profile_id,
                    doctor_id=dr_elena.id,
                    service_id=services_map["pediatric-checkup"].id if "pediatric-checkup" in services_map else None,
                    department_id=peds_dept.id if peds_dept else None,
                    patient_name="John Doe",
                    patient_phone="+1-555-0192",
                    patient_email="john.doe@example.com",
                    patient_age=36,
                    patient_gender="Male",
                    appointment_date=date(2026, 8, 10),
                    appointment_time="10:00 AM",
                    status="confirmed",
                    reason_for_visit="Annual wellness checkup for son",
                    booking_source="chatbot"
                )
                db.add(appt)
                db.commit()
                db.refresh(appt)
                print(f"[CREATED] Appointment: {appt.id} for {appt.patient_name} with {dr_elena.full_name}")

                # Seed Review
                rev = db.query(AppointmentReview).filter(AppointmentReview.appointment_id == appt.id).first()
                if not rev:
                    rev = AppointmentReview(
                        appointment_id=appt.id,
                        doctor_id=dr_elena.id,
                        patient_id=patient_profile_id,
                        reviewer_name="John Doe",
                        rating=5,
                        review_text="Dr. Elena was remarkably kind and thorough during our appointment!",
                        is_verified=True
                    )
                    db.add(rev)
                    db.commit()
                    print(f"[CREATED] AppointmentReview for Dr. Elena")

        print("[SUCCESS] Module 3 seed data inserted successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding Module 3 data: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_module3()
