from typing import List, Optional
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.security import decode_access_token
from app.models.appointment import Appointment, Service
from app.models.doctor import DoctorProfile, DoctorSchedule
from app.models.user import User
from app.schemas.appointment import TimeSlotResponse, AppointmentCreate, AppointmentResponse, AppointmentStatusUpdate, AppointmentCancelRequest, AppointmentRescheduleRequest

router = APIRouter()

def parse_time_str(time_str: str) -> datetime:
    time_str = time_str.strip()
    for fmt in ("%I:%M %p", "%H:%M", "%I:%M%p"):
        try:
            return datetime.strptime(time_str, fmt)
        except ValueError:
            pass
    return datetime.strptime("09:00 AM", "%I:%M %p")

def get_optional_user(request: Request, db: Session) -> Optional[User]:
    token = request.cookies.get("access_token")
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    return db.query(User).filter(User.id == payload["sub"]).first()

def get_appointment_datetime(app_date: date, app_time_str: str) -> datetime:
    parsed_t = parse_time_str(app_time_str)
    return datetime.combine(app_date, parsed_t.time())

VALID_STATUSES = ["pending", "confirmed", "in_consultation", "completed", "cancelled", "no_show", "rescheduled"]

STANDARD_SLOTS = [
    {"value": "09:00 AM", "label": "09:00 AM"},
    {"value": "09:30 AM", "label": "09:30 AM"},
    {"value": "10:00 AM", "label": "10:00 AM"},
    {"value": "10:30 AM", "label": "10:30 AM"},
    {"value": "11:00 AM", "label": "11:00 AM"},
    {"value": "11:30 AM", "label": "11:30 AM"},
    {"value": "12:00 PM", "label": "12:00 PM"},
    {"value": "12:30 PM", "label": "12:30 PM"},
    {"value": "02:00 PM", "label": "02:00 PM"},
    {"value": "02:30 PM", "label": "02:30 PM"},
    {"value": "03:00 PM", "label": "03:00 PM"},
    {"value": "03:30 PM", "label": "03:30 PM"},
    {"value": "04:00 PM", "label": "04:00 PM"},
    {"value": "04:30 PM", "label": "04:30 PM"},
    {"value": "05:00 PM", "label": "05:00 PM"},
]

from datetime import timedelta

def generate_slots_for_schedule(start_str: str, end_str: str, duration_mins: int = 30):
    slots = []
    try:
        current = parse_time_str(start_str)
        end = parse_time_str(end_str)
        delta = timedelta(minutes=duration_mins)

        while current < end:
            formatted = current.strftime("%I:%M %p")
            slots.append({"value": formatted, "label": formatted})
            current += delta
    except Exception as e:
        print(f"Error parsing schedule times ({start_str} - {end_str}): {e}")
    return slots

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

    day_short = parsed_date.strftime("%a")
    day_full = parsed_date.strftime("%A")

    # Find active doctor schedules for this day of week
    sched_query = db.query(DoctorSchedule).filter(
        DoctorSchedule.is_active == True,
        (DoctorSchedule.day_of_week.ilike(f"%{day_short}%") | DoctorSchedule.day_of_week.ilike(f"%{day_full}%"))
    )

    if doctor_id and doctor_id != "any":
        sched_query = sched_query.filter(DoctorSchedule.doctor_id == doctor_id)

    matching_schedules = sched_query.all()

    # Generate candidate slots from matching schedules
    candidate_slots = []
    if matching_schedules:
        for sched in matching_schedules:
            candidate_slots.extend(generate_slots_for_schedule(
                sched.start_time,
                sched.end_time,
                sched.slot_duration_minutes or 30
            ))
    else:
        # Return empty list if doctor is off on this day of week or no working schedules exist
        return []

    # Find booked appointments for doctor on specified date
    query = db.query(Appointment).filter(
        Appointment.appointment_date == parsed_date,
        Appointment.status != "cancelled"
    )
    if doctor_id and doctor_id != "any":
        query = query.filter(Appointment.doctor_id == doctor_id)

    existing_appointments = query.all()
    
    # Store normalized booked time representations
    booked_times = set()
    for app in existing_appointments:
        booked_times.add(app.appointment_time.strip().upper())
        try:
            parsed_t = parse_time_str(app.appointment_time)
            booked_times.add(parsed_t.strftime("%I:%M %p").upper())
            booked_times.add(parsed_t.strftime("%H:%M"))
        except Exception:
            pass

    now = datetime.now()
    is_today = (parsed_date == date.today())

    results = []
    seen_values = set()

    for s in candidate_slots:
        val = s["value"]
        lbl = s["label"]
        if val in seen_values:
            continue
        seen_values.add(val)

        is_disabled = False
        val_upper = val.strip().upper()

        # Disable if already booked
        if val_upper in booked_times:
            is_disabled = True

        # Disable if today and slot time has passed
        if is_today:
            try:
                slot_time = parse_time_str(val).time()
                slot_dt = datetime.combine(parsed_date, slot_time)
                if slot_dt <= now:
                    is_disabled = True
            except Exception:
                pass

        results.append(TimeSlotResponse(
            value=val,
            label=lbl,
            disabled=is_disabled
        ))

    return results

@router.post("/book", response_model=AppointmentResponse)
def create_appointment(
    payload: AppointmentCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    # 1. Reject past dates
    if payload.appointment_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book an appointment for a past date."
        )

    # 2. Resolve Doctor
    target_doctor_id = payload.doctor_id
    if target_doctor_id == "any" or not target_doctor_id:
        first_doc = db.query(DoctorProfile).first()
        if not first_doc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No doctors available in database")
        target_doctor_id = first_doc.id

    doctor = db.query(DoctorProfile).filter(DoctorProfile.id == target_doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")

    # 3. Validate Doctor Schedule for the day of week
    day_short = payload.appointment_date.strftime("%a")
    day_full = payload.appointment_date.strftime("%A")
    sched = db.query(DoctorSchedule).filter(
        DoctorSchedule.doctor_id == target_doctor_id,
        DoctorSchedule.is_active == True,
        (DoctorSchedule.day_of_week.ilike(f"%{day_short}%") | DoctorSchedule.day_of_week.ilike(f"%{day_full}%"))
    ).first()

    if not sched:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Dr. {doctor.full_name} is not scheduled to work on {day_full}s. Please choose another date."
        )

    # 4. Prevent Slot Collisions (Double Booking Prevention)
    existing_conflict = db.query(Appointment).filter(
        Appointment.doctor_id == target_doctor_id,
        Appointment.appointment_date == payload.appointment_date,
        Appointment.appointment_time == payload.appointment_time,
        Appointment.status != "cancelled"
    ).first()

    if existing_conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"The slot '{payload.appointment_time}' on {payload.appointment_date} for Dr. {doctor.full_name} is already booked. Please select a different time slot."
        )

    # 5. Determine Patient & Department
    department_id = payload.department_id or doctor.department_id
    optional_user = get_optional_user(request, db)
    patient_id = optional_user.id if optional_user else None

    # 6. Create Appointment
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
    cancel_req: Optional[AppointmentCancelRequest] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    # Authorization Check
    if appointment.patient_id and appointment.patient_id != current_user.id:
        if appointment.patient_email != current_user.email:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to cancel this appointment")

    if appointment.status == "cancelled":
        return appointment

    if appointment.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Completed appointments cannot be cancelled."
        )

    # 2-Hour Cancellation Rule Enforcement
    app_datetime = get_appointment_datetime(appointment.appointment_date, appointment.appointment_time)
    now_dt = datetime.now()
    seconds_left = (app_datetime - now_dt).total_seconds()

    if seconds_left <= 7200:  # 7200 seconds = 2 hours
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointments cannot be cancelled within 2 hours of the scheduled time. Please contact clinic support at +92 300 1234567 for urgent changes."
        )

    appointment.status = "cancelled"
    if cancel_req and cancel_req.reason:
        appointment.cancellation_reason = cancel_req.reason

    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.put("/{appointment_id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    appointment_id: str,
    status_update: AppointmentStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    new_status = status_update.status.lower()
    if new_status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}"
        )

    # If cancelling, enforce 2-hour rule for non-admin/non-doctor patient users
    if new_status == "cancelled" and current_user.role == "patient":
        app_datetime = get_appointment_datetime(appointment.appointment_date, appointment.appointment_time)
        seconds_left = (app_datetime - datetime.now()).total_seconds()
        if seconds_left <= 7200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Appointments cannot be cancelled within 2 hours of the scheduled time. Please contact clinic support."
            )

    appointment.status = new_status
    if status_update.cancellation_reason:
        appointment.cancellation_reason = status_update.cancellation_reason
    if status_update.notes:
        appointment.notes = status_update.notes

    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.put("/{appointment_id}/reschedule", response_model=AppointmentResponse)
def reschedule_appointment(
    appointment_id: str,
    reschedule_req: AppointmentRescheduleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    # Authorization Check
    if appointment.patient_id and appointment.patient_id != current_user.id:
        if appointment.patient_email != current_user.email:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to reschedule this appointment")

    if appointment.status in ["cancelled", "completed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot reschedule an appointment that is already {appointment.status}."
        )

    # 2-Hour Rule Enforcement on current scheduled time
    app_datetime = get_appointment_datetime(appointment.appointment_date, appointment.appointment_time)
    now_dt = datetime.now()
    seconds_left = (app_datetime - now_dt).total_seconds()
    if seconds_left <= 7200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointments cannot be rescheduled within 2 hours of the scheduled time. Please contact clinic support."
        )

    # Check if target date is in past
    if reschedule_req.new_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot reschedule to a past date."
        )

    # Check slot collision for doctor at new_date and new_time
    if appointment.doctor_id:
        existing_conflict = db.query(Appointment).filter(
            Appointment.doctor_id == appointment.doctor_id,
            Appointment.appointment_date == reschedule_req.new_date,
            Appointment.appointment_time == reschedule_req.new_time,
            Appointment.status.in_(["pending", "confirmed"]),
            Appointment.id != appointment.id
        ).first()

        if existing_conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"The time slot {reschedule_req.new_time} on {reschedule_req.new_date} is already booked. Please select another slot."
            )

    appointment.appointment_date = reschedule_req.new_date
    appointment.appointment_time = reschedule_req.new_time
    appointment.status = "confirmed"
    if reschedule_req.reason:
        appointment.notes = f"Rescheduled: {reschedule_req.reason}"

    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment



