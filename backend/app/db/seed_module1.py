from datetime import date
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.models.patient import PatientProfile
from app.core.security import get_password_hash

def seed_module1():
    print("Creating tables in database...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if dummy patient user exists
        patient_email = "john.doe@example.com"
        user = db.query(User).filter(User.email == patient_email).first()
        if not user:
            user = User(
                full_name="John Doe",
                email=patient_email,
                phone="+1-555-0192",
                role="patient",
                hashed_password=get_password_hash("password123")
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created dummy user: {user.full_name} ({user.email})")
        else:
            print(f"User {patient_email} already exists.")

        # Check if patient profile exists
        profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
        if not profile:
            profile = PatientProfile(
                user_id=user.id,
                date_of_birth=date(1990, 5, 15),
                age=36,
                gender="Male",
                blood_group="O+",
                emergency_contact_name="Jane Doe",
                emergency_contact_phone="+1-555-0193",
                medical_history="No chronic illnesses. Penicillin allergy.",
                allergies="Penicillin"
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
            print(f"Created PatientProfile for {user.full_name} with ID {profile.id}")
        else:
            print(f"PatientProfile already exists for user {user.id}")

        print("[SUCCESS] Module 1 seed data inserted successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding Module 1 data: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_module1()
