from typing import Optional
from datetime import date
from pydantic import BaseModel, ConfigDict
from app.schemas.auth import UserOut

class PatientProfileOut(BaseModel):
    id: str
    user_id: Optional[str] = None
    date_of_birth: Optional[date] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PatientProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None

class PatientFullResponse(BaseModel):
    user: UserOut
    profile: Optional[PatientProfileOut] = None

    model_config = ConfigDict(from_attributes=True)
