from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.patient import PatientProfile
from app.schemas.patient import PatientFullResponse, PatientProfileUpdate

router = APIRouter()

def get_or_create_patient_profile(user_id: str, db: Session) -> PatientProfile:
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()
    if not profile:
        profile = PatientProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.get("/me", response_model=PatientFullResponse)
def get_my_patient_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_patient_profile(current_user.id, db)
    return {
        "user": current_user,
        "profile": profile
    }

@router.put("/me", response_model=PatientFullResponse)
def update_my_patient_profile(
    payload: PatientProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_patient_profile(current_user.id, db)

    # Update User model fields if provided
    user_updated = False
    if payload.full_name is not None and payload.full_name.strip() != "":
        current_user.full_name = payload.full_name.strip()
        user_updated = True
    if payload.phone is not None:
        current_user.phone = payload.phone.strip()
        user_updated = True

    if user_updated:
        db.add(current_user)

    # Update PatientProfile model fields if provided
    update_data = payload.model_dump(exclude_unset=True)
    profile_fields = [
        "date_of_birth", "age", "gender", "blood_group",
        "emergency_contact_name", "emergency_contact_phone",
        "medical_history", "allergies"
    ]
    for field in profile_fields:
        if field in update_data:
            setattr(profile, field, update_data[field])

    db.add(profile)
    db.commit()
    db.refresh(current_user)
    db.refresh(profile)

    return {
        "user": current_user,
        "profile": profile
    }
