from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.appointment import Service
from app.models.doctor import Department
from app.schemas.service import ServiceResponse

router = APIRouter()

@router.get("/", response_model=List[ServiceResponse])
def get_services(
    category: Optional[str] = Query(None, description="Category/Department slug or name filter"),
    search: Optional[str] = Query(None, description="Search by service name or description"),
    popular_only: bool = Query(False, description="Filter popular services only"),
    db: Session = Depends(get_db)
):
    query = db.query(Service)

    if category and category.lower() != "all":
        # Check if category matches department slug or ID
        dept_obj = db.query(Department).filter(
            (Department.slug == category.lower()) | (Department.id == category)
        ).first()
        if dept_obj:
            query = query.filter(Service.department_id == dept_obj.id)
        else:
            # Check for text match in name or short_description
            query = query.filter(
                (Service.name.ilike(f"%{category}%")) |
                (Service.short_description.ilike(f"%{category}%"))
            )

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Service.name.ilike(search_pattern)) |
            (Service.short_description.ilike(search_pattern))
        )

    if popular_only:
        query = query.filter(Service.is_popular == True)

    services = query.order_by(Service.name.asc()).all()
    return services

@router.get("/{slug_or_id}", response_model=ServiceResponse)
def get_service_detail(slug_or_id: str, db: Session = Depends(get_db)):
    service = db.query(Service).filter(
        (Service.slug == slug_or_id) | (Service.id == slug_or_id)
    ).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service
