from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class DepartmentResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DoctorScheduleResponse(BaseModel):
    id: str
    day_of_week: str
    start_time: str
    end_time: str
    slot_duration_minutes: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class DoctorProfileResponse(BaseModel):
    id: str
    slug: str
    full_name: str
    photo: Optional[str] = None
    specialty: str
    qualifications: Optional[str] = None
    experience_years: int
    languages: Optional[str] = None
    bio: Optional[str] = None
    gender: Optional[str] = None
    consultation_fee: float
    rating: float
    review_count: int
    department: Optional[DepartmentResponse] = None

    model_config = ConfigDict(from_attributes=True)

class DoctorDetailResponse(DoctorProfileResponse):
    schedules: List[DoctorScheduleResponse] = []

    model_config = ConfigDict(from_attributes=True)
