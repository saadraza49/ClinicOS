from typing import Optional
from datetime import date
from pydantic import BaseModel, ConfigDict
from app.schemas.doctor import DoctorProfileResponse
from app.schemas.service import ServiceResponse

class TimeSlotResponse(BaseModel):
    value: str
    label: str
    disabled: bool

class AppointmentCreate(BaseModel):
    doctor_id: str
    service_id: Optional[str] = None
    department_id: Optional[str] = None
    patient_name: str
    patient_phone: str
    patient_email: Optional[str] = None
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    appointment_date: date
    appointment_time: str
    reason_for_visit: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: str
    patient_id: Optional[str] = None
    doctor_id: str
    service_id: Optional[str] = None
    department_id: Optional[str] = None
    patient_name: str
    patient_phone: str
    patient_email: Optional[str] = None
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    appointment_date: date
    appointment_time: str
    status: str
    reason_for_visit: Optional[str] = None
    booking_source: str
    doctor: Optional[DoctorProfileResponse] = None
    service: Optional[ServiceResponse] = None

    model_config = ConfigDict(from_attributes=True)
