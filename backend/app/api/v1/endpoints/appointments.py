from typing import List, Optional
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.security import decode_access_token
from app.models.appointment import Appointment, Service
from app.models.doctor import DoctorProfile, DoctorSchedule
from app.models.user import User
from app.schemas.appointment import TimeSlotResponse, AppointmentCreate, AppointmentResponse

router = APIRouter()

from datetime import timedelta

def parse_time_str(time_str: str) -> datetime:
    time_str = time_str.strip()
    for fmt in ("%I:%M %p", "%H:%M", "%I:%M%p"):
        try:
            return datetime.strptime(time_str, fmt)
        except ValueError:
            pass
    return datetime.strptime("09:00 AM", "%I:%M %p")

def generate_slots_for_schedule(start_str: str, end_str: str, duration_mins: int = 30):
    slots = []
    try:
        current = parse_time_str(start_str)
        end = parse_time_str(end_str)
        delta = timedelta(minutes=duration_mins)

        while current < end:
            val_str = current.strftime("%H:%M")
            lbl_str = current.strftime("%I:%M %p")
            slots.append({"value": val_str, "label": lbl_str})
            current += delta
    except Exception as e:
        print(f"Error parsing schedule times ({start_str} - {end_str}): {e}")
    return slots

STANDARD_SLOTS = [
    {"value": "09:00", "label": "09:00 AM"},
    {"value": "09:30", "label": "09:30 AM"},
    {"value": "10:00", "label": "10:00 AM"},
    {"value": "10:30", "label": "10:30 AM"},
    {"value": "11:00", "label": "11:00 AM"},
    {"value": "11:30", "label": "11:30 AM"},
    {"value": "13:00", "label": "01:00 PM"},
    {"value": "13:30", "label": "01:30 PM"},
    {"value": "14:00", "label": "02:00 PM"},
    {"value": "14:30", "label": "02:30 PM"},
    {"value": "15:00", "label": "03:00 PM"},
    {"value": "15:30", "label": "03:30 PM"},
    {"value": "16:00", "label": "04:00 PM"},
    {"value": "16:30", "label": "04:30 PM"},
]

def get_optional_user(request: Request, db: Session) -> Optional[User]:
    token = request.cookies.get("access_token")
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    return db.query(User).filter(User.id == payload["sub"]).first()

@router.get("/slots", response_model=List[TimeSlotResponse])
def get_available_slots(
    doctor_id: Optional[str] = Query(None),
    appointment_date: str = Query(...),
    db: Session = Depends(get_db)
):
    try:
        parsed_date = date.fromisoformat(appointment_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    day_short = parsed_date.strftime("%a")  # e.g., Mon, Tue
    day_full = parsed_date.strftime("%A")   # e.g., Monday, Tuesday

    # Find active doctor schedules for this day of week
    sched_query = db.query(DoctorSchedule).filter(
        DoctorSchedule.is_active == True,
        (DoctorSchedule.day_of_week.ilike(f"%{day_short}%") | DoctorSchedule.day_of_week.ilike(f"%{day_full}%"))
    )

    if doctor_id and doctor_id != "any":
        sched_query = sched_query.filter(DoctorSchedule.doctor_id == doctor_id)

    matching_schedules = sched_query.all()

    # If no working schedule found for selected doctor/day, return empty list
    if not matching_schedules:
        return []

    # Generate slots from matching schedules
    generated_slots_map = {}
    for sched in matching_schedules:
        slots = generate_slots_for_schedule(
            sched.start_time,
            sched.end_time,
            sched.slot_duration_minutes or 30
        )
        for s in slots:
            generated_slots_map[s["value"]] = s["label"]

    # Find booked appointments for doctor on specified date
    query = db.query(Appointment).filter(
        Appointment.appointment_date == parsed_date,
        Appointment.status != "cancelled"
    )
    if doctor_id and doctor_id != "any":
        query = query.filter(Appointment.doctor_id == doctor_id)

    existing_appointments = query.all()
    booked_times = {app.appointment_time for app in existing_appointments}

    results = []
    sorted_slot_keys = sorted(generated_slots_map.keys())
    for val_str in sorted_slot_keys:
        lbl_str = generated_slots_map[val_str]
        is_disabled = (val_str in booked_times) or (lbl_str in booked_times)
        results.append(TimeSlotResponse(
            value=val_str,
            label=lbl_str,
            disabled=is_disabled
        ))

    return results

@router.post("/book", response_model=AppointmentResponse)
def create_appointment(
    payload: AppointmentCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    target_doctor_id = payload.doctor_id

    # If "any" is passed, choose the first available doctor
    if target_doctor_id == "any" or not target_doctor_id:
        first_doc = db.query(DoctorProfile).first()
        if not first_doc:
            raise HTTPException(status_code=400, detail="No doctors available in database")
        target_doctor_id = first_doc.id

    doctor = db.query(DoctorProfile).filter(DoctorProfile.id == target_doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    department_id = payload.department_id or doctor.department_id

    optional_user = get_optional_user(request, db)
    patient_id = optional_user.id if optional_user else None

    appointment = Appointment(
        patient_id=patient_id,
        doctor_id=target_doctor_id,
        service_id=payload.service_id,
        department_id=department_id,
        patient_name=payload.patient_name,
        patient_phone=payload.patient_phone,
        patient_email=payload.patient_email,
        patient_age=payload.patient_age,
        patient_gender=payload.patient_gender,
        appointment_date=payload.appointment_date,
        appointment_time=payload.appointment_time,
        status="confirmed",
        reason_for_visit=payload.reason_for_visit,
        booking_source="web"
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.get("/my-appointments", response_model=List[AppointmentResponse])
def get_my_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appointments = db.query(Appointment).filter(
        (Appointment.patient_id == current_user.id) | (Appointment.patient_email == current_user.email)
    ).order_by(Appointment.appointment_date.desc()).all()
    return appointments

@router.put("/{appointment_id}/cancel", response_model=AppointmentResponse)
def cancel_appointment(
    appointment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if appointment.patient_id and appointment.patient_id != current_user.id:
        if appointment.patient_email != current_user.email:
            raise HTTPException(status_code=403, detail="Not authorized to cancel this appointment")

    appointment.status = "cancelled"
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

