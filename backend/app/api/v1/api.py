from fastapi import APIRouter
from app.api.v1.endpoints import auth, chat, doctors, services, departments, appointments, faqs, patients

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(doctors.router, prefix="/doctors", tags=["doctors"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(faqs.router, prefix="/faqs", tags=["faqs"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])

