from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.doctor import Department
from app.schemas.doctor import DepartmentResponse

router = APIRouter()

@router.get("/", response_model=List[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).order_by(Department.name.asc()).all()
    return departments
