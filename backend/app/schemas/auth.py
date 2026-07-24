from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserSignup(BaseModel):
    full_name: str = Field(..., alias="fullName", min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: Optional[str] = Field(None, alias="confirmPassword")
    phone: Optional[str] = None
    role: Optional[str] = "patient"

    class Config:
        populate_by_name = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = None

class UserOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str
    created_at: datetime

    class Config:
        from_attributes = True
