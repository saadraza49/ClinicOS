from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db
from app.models.doctor import DoctorProfile, Department
from app.models.appointment import AppointmentReview, Appointment, generate_uuid
from app.schemas.doctor import DoctorProfileResponse, DoctorDetailResponse
from app.schemas.appointment import ReviewCreate, ReviewResponse
from app.models.user import User
from app.api.v1.endpoints.patients import get_or_create_patient_profile
from app.core.security import decode_access_token

router = APIRouter()

def get_optional_user(request: Request, db: Session) -> Optional[User]:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    user = None
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        user_email = payload.get("email")
        if user_email:
            user = db.query(User).filter(User.email == user_email.lower()).first()
    return user

def get_realtime_rating_map(db: Session):
    """Returns a dict mapping doctor_id -> (avg_rating, total_reviews) in 1 fast query"""
    rating_stats = db.query(
        AppointmentReview.doctor_id,
        func.avg(AppointmentReview.rating).label("avg_rating"),
        func.count(AppointmentReview.id).label("total_reviews")
    ).group_by(AppointmentReview.doctor_id).all()

    return {
        r.doctor_id: (round(float(r.avg_rating), 1), int(r.total_reviews))
        for r in rating_stats
    }

@router.get("/", response_model=List[DoctorProfileResponse])
def get_doctors(
    department: Optional[str] = Query(None, description="Department slug or ID filter"),
    search: Optional[str] = Query(None, description="Search by doctor name or specialty"),
    db: Session = Depends(get_db)
):
    query = db.query(DoctorProfile)

    if department:
        dept_obj = db.query(Department).filter(
            (Department.slug == department) | (Department.id == department)
        ).first()
        if dept_obj:
            query = query.filter(DoctorProfile.department_id == dept_obj.id)
        else:
            query = query.filter(DoctorProfile.specialty.ilike(f"%{department}%"))

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (DoctorProfile.full_name.ilike(search_pattern)) |
            (DoctorProfile.specialty.ilike(search_pattern))
        )

    doctors = query.all()

    # Re-calculate real-time ratings from reviews table in 1 fast query
    stats_map = get_realtime_rating_map(db)
    for doc in doctors:
        if doc.id in stats_map:
            doc.rating, doc.review_count = stats_map[doc.id]

    # Sort by rating descending
    doctors.sort(key=lambda d: d.rating, reverse=True)
    return doctors

@router.get("/{slug_or_id}", response_model=DoctorDetailResponse)
def get_doctor_detail(slug_or_id: str, db: Session = Depends(get_db)):
    doctor = db.query(DoctorProfile).filter(
        (DoctorProfile.slug == slug_or_id) | (DoctorProfile.id == slug_or_id)
    ).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    stats_map = get_realtime_rating_map(db)
    if doctor.id in stats_map:
        doctor.rating, doctor.review_count = stats_map[doctor.id]

    return doctor

@router.get("/{slug_or_id}/reviews", response_model=List[ReviewResponse])
def get_doctor_reviews(slug_or_id: str, db: Session = Depends(get_db)):
    doctor = db.query(DoctorProfile).filter(
        (DoctorProfile.slug == slug_or_id) | (DoctorProfile.id == slug_or_id)
    ).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    reviews = db.query(AppointmentReview).filter(
        AppointmentReview.doctor_id == doctor.id
    ).order_by(AppointmentReview.created_at.desc()).all()
    return reviews

@router.post("/reviews", response_model=ReviewResponse)
def submit_doctor_review(
    payload: ReviewCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    doctor = db.query(DoctorProfile).filter(DoctorProfile.id == payload.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    if payload.rating < 1 or payload.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5 stars")

    optional_user = get_optional_user(request, db)
    patient_profile = get_or_create_patient_profile(optional_user.id, db) if optional_user else None
    patient_id = patient_profile.id if patient_profile else None

    appt_id = payload.appointment_id
    if not appt_id:
        existing_appt = db.query(Appointment).filter(Appointment.doctor_id == payload.doctor_id).first()
        if existing_appt:
            appt_id = existing_appt.id

    review = AppointmentReview(
        doctor_id=payload.doctor_id,
        appointment_id=appt_id or generate_uuid(),
        patient_id=patient_id,
        reviewer_name=payload.reviewer_name or (optional_user.full_name if optional_user else "Verified Patient"),
        rating=payload.rating,
        review_text=payload.review_text or "Great medical consultation experience."
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    # Instantly recalculate doctor rating in real time
    stats_map = get_realtime_rating_map(db)
    if doctor.id in stats_map:
        doctor.rating, doctor.review_count = stats_map[doctor.id]
        db.add(doctor)
        db.commit()

    return review
