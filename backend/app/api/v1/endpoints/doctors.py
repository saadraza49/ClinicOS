from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.doctor import DoctorProfile, Department
from app.schemas.doctor import DoctorProfileResponse, DoctorDetailResponse

router = APIRouter()

@router.get("/", response_model=List[DoctorProfileResponse])
def get_doctors(
    department: Optional[str] = Query(None, description="Department slug or ID filter"),
    search: Optional[str] = Query(None, description="Search by doctor name or specialty"),
    db: Session = Depends(get_db)
):
    query = db.query(DoctorProfile)
    
    if department:
        # Check if department matches slug or ID
        dept_obj = db.query(Department).filter(
            (Department.slug == department) | (Department.id == department)
        ).first()
        if dept_obj:
            query = query.filter(DoctorProfile.department_id == dept_obj.id)
        else:
            # Fallback: check if specialty matches department string
            query = query.filter(DoctorProfile.specialty.ilike(f"%{department}%"))
            
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (DoctorProfile.full_name.ilike(search_pattern)) |
            (DoctorProfile.specialty.ilike(search_pattern))
        )

    doctors = query.order_by(DoctorProfile.rating.desc(), DoctorProfile.full_name.asc()).all()
    return doctors

@router.get("/{slug_or_id}", response_model=DoctorDetailResponse)
def get_doctor_detail(slug_or_id: str, db: Session = Depends(get_db)):
    doctor = db.query(DoctorProfile).filter(
        (DoctorProfile.slug == slug_or_id) | (DoctorProfile.id == slug_or_id)
    ).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    return doctor
