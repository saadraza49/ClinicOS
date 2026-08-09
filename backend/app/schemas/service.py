from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.doctor import DepartmentResponse

class ServiceResponse(BaseModel):
    id: str
    department_id: Optional[str] = None
    name: str
    slug: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    price: float
    duration_minutes: int
    icon: Optional[str] = None
    is_popular: bool
    department: Optional[DepartmentResponse] = None

    model_config = ConfigDict(from_attributes=True)
