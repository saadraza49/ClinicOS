from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.doctor import Department, DoctorProfile, DoctorSchedule
from app.models.user import User
from app.core.security import get_password_hash

def seed_module2():
    print("Creating Module 2 tables in database...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Seed Departments
        dept_data = [
            {"name": "Pediatrics", "slug": "pediatrics", "description": "Comprehensive medical care for infants, children, and adolescents.", "icon": "child_care"},
            {"name": "Cardiology", "slug": "cardiology", "description": "Expert heart care, preventative cardiology, and diagnostic imaging.", "icon": "favorite"},
            {"name": "Neurology", "slug": "neurology", "description": "Specialized diagnosis and treatment of brain and nervous system disorders.", "icon": "psychology"},
            {"name": "Dermatology", "slug": "dermatology", "description": "Skin, hair, and nail treatments and cosmetic skincare.", "icon": "sanitizer"},
        ]

        departments_map = {}
        for d in dept_data:
            dept = db.query(Department).filter(Department.slug == d["slug"]).first()
            if not dept:
                dept = Department(
                    name=d["name"],
                    slug=d["slug"],
                    description=d["description"],
                    icon=d["icon"]
                )
                db.add(dept)
                db.commit()
                db.refresh(dept)
                print(f"[CREATED] Department: {dept.name}")
            departments_map[dept.slug] = dept

        # Seed Doctor Profiles & Schedules
        doctors_seed = [
            {
                "email": "dr.elena@luminahealth.com",
                "full_name": "Dr. Elena Rodriguez",
                "slug": "elena-rodriguez",
                "specialty": "Pediatrics",
                "department_slug": "pediatrics",
                "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
                "qualifications": "MD, FAAP",
                "experience_years": 12,
                "languages": "English, Spanish",
                "bio": "Dedicated to providing compassionate pediatric care.",
                "gender": "Female",
                "consultation_fee": 150.0,
                "rating": 4.9,
                "review_count": 124,
                "schedules": [
                    {"day_of_week": "Mon", "start_time": "08:00 AM", "end_time": "04:00 PM"},
                    {"day_of_week": "Wed", "start_time": "08:00 AM", "end_time": "04:00 PM"},
                    {"day_of_week": "Fri", "start_time": "08:00 AM", "end_time": "04:00 PM"},
                ]
            },
            {
                "email": "dr.marcus@luminahealth.com",
                "full_name": "Dr. Marcus Vance",
                "slug": "marcus-vance",
                "specialty": "Cardiology",
                "department_slug": "cardiology",
                "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
                "qualifications": "MD, FACC",
                "experience_years": 22,
                "languages": "English",
                "bio": "Board-certified cardiologist with over two decades of experience.",
                "gender": "Male",
                "consultation_fee": 250.0,
                "rating": 4.8,
                "review_count": 98,
                "schedules": [
                    {"day_of_week": "Tue", "start_time": "09:00 AM", "end_time": "05:00 PM"},
                    {"day_of_week": "Thu", "start_time": "09:00 AM", "end_time": "05:00 PM"},
                ]
            },
            {
                "email": "dr.priya@luminahealth.com",
                "full_name": "Dr. Priya Patel",
                "slug": "priya-patel",
                "specialty": "Neurology",
                "department_slug": "neurology",
                "photo": "https://images.unsplash.com/photo-1594824813566-88824278c1a6?auto=format&fit=crop&q=80&w=300",
                "qualifications": "MD, PhD",
                "experience_years": 9,
                "languages": "English, Hindi, Gujarati",
                "bio": "Specializes in neuromuscular disorders and sleep medicine.",
                "gender": "Female",
                "consultation_fee": 200.0,
                "rating": 4.9,
                "review_count": 76,
                "schedules": [
                    {"day_of_week": "Mon", "start_time": "08:30 AM", "end_time": "04:30 PM"},
                    {"day_of_week": "Tue", "start_time": "08:30 AM", "end_time": "04:30 PM"},
                    {"day_of_week": "Thu", "start_time": "08:30 AM", "end_time": "04:30 PM"},
                ]
            }
        ]

        for doc_info in doctors_seed:
            # Check or create doctor User account
            user = db.query(User).filter(User.email == doc_info["email"]).first()
            if not user:
                user = User(
                    full_name=doc_info["full_name"],
                    email=doc_info["email"],
                    role="doctor",
                    hashed_password=get_password_hash("doctor123")
                )
                db.add(user)
                db.commit()
                db.refresh(user)

            # Check or create DoctorProfile
            profile = db.query(DoctorProfile).filter(DoctorProfile.slug == doc_info["slug"]).first()
            if not profile:
                dept = departments_map.get(doc_info["department_slug"])
                profile = DoctorProfile(
                    user_id=user.id,
                    department_id=dept.id if dept else None,
                    slug=doc_info["slug"],
                    full_name=doc_info["full_name"],
                    photo=doc_info["photo"],
                    specialty=doc_info["specialty"],
                    qualifications=doc_info["qualifications"],
                    experience_years=doc_info["experience_years"],
                    languages=doc_info["languages"],
                    bio=doc_info["bio"],
                    gender=doc_info["gender"],
                    consultation_fee=doc_info["consultation_fee"],
                    rating=doc_info["rating"],
                    review_count=doc_info["review_count"]
                )
                db.add(profile)
                db.commit()
                db.refresh(profile)
                print(f"[CREATED] DoctorProfile: {profile.full_name}")

                # Add DoctorSchedules
                for sched in doc_info["schedules"]:
                    s = DoctorSchedule(
                        doctor_id=profile.id,
                        day_of_week=sched["day_of_week"],
                        start_time=sched["start_time"],
                        end_time=sched["end_time"]
                    )
                    db.add(s)
                db.commit()

        print("[SUCCESS] Module 2 seed data inserted successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding Module 2 data: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_module2()
