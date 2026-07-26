from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import json
import urllib.request
import urllib.error
import re
from groq import Groq
from app.core.config import settings
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.chat import FAQ
from app.models.doctor import DoctorProfile, Department
from app.models.appointment import Service
from app.core.embeddings import get_embedding


router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None

class ChatResponse(BaseModel):
    reply: str
    quickReplies: Optional[List[str]] = None

# Static Clinic Data
CLINIC_NAME = "LuminaHealth Clinic"
CLINIC_HOURS = "Monday to Saturday, 9:00 AM – 9:00 PM (Closed on Sundays)"
EMERGENCY_NUMBER = "+92 300 1234567"
ADDRESS = "123 Healing Way, Wellness District, CA 90210"
FEE_INFO = "General Physician: 1,500 PKR. Specialists: 2,500 PKR."

def get_system_prompt(db: Session) -> str:
    """
    Build the system prompt dynamically from live PostgreSQL database records:
    - Departments
    - Doctor Profiles & Schedules
    - Services
    """
    # 1. Departments (Live from PostgreSQL)
    depts = db.query(Department).all()
    if depts:
        dept_lines = [f"- {d.name}: {d.description or 'Specialist care department'}" for d in depts]
        depts_text = "\n".join(dept_lines)
    else:
        depts_text = "- Pediatrics, Cardiology, Dermatology, Primary Care, Dentistry, Neurology"

    # 2. Doctors & Schedules (Live from PostgreSQL)
    doctors = db.query(DoctorProfile).all()
    if doctors:
        doc_lines = []
        for idx, doc in enumerate(doctors, 1):
            schedules_str = ""
            if doc.schedules:
                sched_items = [f"{s.day_of_week} ({s.start_time}-{s.end_time})" for s in doc.schedules if s.is_active]
                if sched_items:
                    schedules_str = f" | Availability: {', '.join(sched_items)}"
            
            doc_lines.append(
                f"{idx}. {doc.full_name} (Specialty: {doc.specialty}, Gender: {doc.gender or 'Unspecified'}, "
                f"Fee: ${doc.consultation_fee:.0f}, Exp: {doc.experience_years} yrs, Qual: {doc.qualifications or 'MD'}, "
                f"Languages: {doc.languages or 'English'}{schedules_str})"
            )
        doctors_db_text = "\n".join(doc_lines)
    else:
        doctors_db_text = "1. Dr. Elena Rodriguez (Specialty: Pediatrics, Gender: Female)"

    # 3. Services (Live from PostgreSQL)
    services = db.query(Service).all()
    if services:
        srv_lines = [f"- {srv.name} ({srv.short_description or srv.name}, Fee: ${srv.price:.0f}, Duration: {srv.duration_minutes} mins)" for srv in services]
        services_db_text = "\n".join(srv_lines)
    else:
        services_db_text = "- General Physician Consultation"

    return f"""You are an AI assistant for {CLINIC_NAME}.
Your responsibility is to assist users with clinic-related information using LIVE database records from PostgreSQL.

Departments in Clinic (Live from PostgreSQL):
{depts_text}

Doctors & Schedules Database (Live from PostgreSQL):
{doctors_db_text}

Services Offered (Live from PostgreSQL):
{services_db_text}

Clinic Information:
- Name: {CLINIC_NAME}
- Opening Hours: {CLINIC_HOURS}
- Emergency Contact Number: {EMERGENCY_NUMBER}
- Address: {ADDRESS}
- Consultation Fees: {FEE_INFO}

General Behavior:
- Keep answers short, friendly, and helpful.
- Base your answers strictly on the live database records above and any retrieved knowledge.
- Do not fabricate doctors, fees, or services that are not in the database.
- If users ask medical questions, provide general educational information only and recommend consulting a licensed doctor.

Appointment Booking Behavior:
Whenever the user expresses an intention to book an appointment (e.g., "Book appointment", "I need to see a doctor", "Schedule an appointment"), immediately switch into Appointment Booking Mode.
- Collect required information one question at a time:
  1. Full Name
  2. Phone Number
  3. Email Address (optional)
  4. Age
  5. Gender (Patient's gender: Male/Female)
  6. Medical Specialty
  7. Doctor Gender Preference (ONLY ask if the selected specialty has BOTH Male and Female doctors available in the live Doctors Database above!)
  8. Preferred Doctor (Suggest matching doctors from the live database above!)
  9. Reason for Visit / Symptoms
  10. Preferred Date
  11. Preferred Time
- Ask only ONE question at a time and wait for the user's response.
- Validate obvious mistakes.

After all required information has been collected:
- Do NOT ask more questions. Return the Appointment Summary format:

Appointment Summary
Full Name: [Name]
Phone Number: [Phone]
Email: [Email]
Age: [Age]
Gender: [Gender]
Doctor: [Selected Doctor Name]
Specialty: [Selected Specialty]
Reason: [Reason]
Preferred Date: [Date]
Preferred Time: [Time]
Additional Notes: [Notes]

After displaying the summary, exactly say:
"Your appointment request is ready.
Please review the information below.
If everything looks correct, press the Submit Appointment button.
If you want to change anything, simply tell me which field you'd like to edit."

Frontend Integration:
When all required information has been collected and the summary is displayed, include the following JSON at the very end:
{{
"action": "SHOW_APPOINTMENT_REVIEW",
"completed": true,
"details": {{
  "name": "[Collected Full Name]",
  "phone": "[Collected Phone]",
  "age": "[Collected Age]",
  "gender": "[Collected Gender]",
  "doctor": "[Selected Doctor Name]",
  "specialty": "[Selected Specialty]",
  "symptoms": "[Collected Reason/Symptoms]",
  "date": "[Collected Date]",
  "time": "[Collected Time]"
}}
}}
"""



def clean_message(msg: str) -> str:
    # Remove emojis and leading/trailing whitespace
    cleaned = re.sub(r'[^\w\s\?\.,!\-:]', '', msg)
    return cleaned.strip().lower()

def is_booking_in_progress(history: Optional[List[ChatMessage]]) -> bool:
    if not history:
        return False
    # Scan history backwards to see if assistant has asked booking questions or if user initiated
    for msg in reversed(history):
        content_lower = msg.content.lower()
        if msg.role == "user" and "book appointment" in content_lower:
            return True
        if msg.role == "assistant" and any(q in content_lower for q in [
            "full name", "phone number", "email address", "how old", "years old",
            "gender", "medical specialty", "specialty", "preferred doctor", "doctor",
            "reason for visit", "symptoms", "preferred date", "preferred time", "additional notes"
        ]):
            return True
    return False

@router.post("", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest, db: Session = Depends(get_db)):
    user_msg = payload.message
    cleaned = clean_message(user_msg)

    # 1. RAG Retrieve context using pgvector if we are not booking
    context = ""
    top_faq_match = None
    if not is_booking_in_progress(payload.history):
        try:
            query_embedding = get_embedding(user_msg)
            related_faqs = db.query(FAQ).filter(FAQ.is_published == True)\
                .order_by(FAQ.embedding.cosine_distance(query_embedding))\
                .limit(4).all()
            if related_faqs:
                # Keep the absolute closest match for a direct fallback if Groq is offline/missing
                top_faq_match = related_faqs[0]
                
                chunks = []
                for faq in related_faqs:
                    chunks.append(f"Category: {faq.category}\nTopic: {faq.question}\nInformation: {faq.answer}")
                context = "\n\n".join(chunks)
        except Exception as rag_err:
            print(f"RAG Retrieval Error: {rag_err}")

    # Directly use the dedicated chatbot API key from environment
    groq_api_key = settings.CHATBOT_GROQ_API_KEY.strip()
    if not groq_api_key or "your_groq_api_key" in groq_api_key:
        # Smart fallback: if user asked a simple clinic question and we have a very close RAG match, return it directly!
        if top_faq_match and not is_booking_in_progress(payload.history):
            # Check if keyword matches the query to confirm intent
            return ChatResponse(
                reply=top_faq_match.answer,
                quickReplies=["Book Appointment", "Clinic Services", "Clinic Timings"]
            )
        # Fallback to local response if Groq API Key is not set up
        return ChatResponse(
            reply=f"Welcome to {CLINIC_NAME}! I can help you book appointments, explain our services, timings, or location. How may I assist you today?",
            quickReplies=["Book Appointment", "Clinic Timings", "Clinic Location"]
        )

    # Build prompt messages including session history, live DB data, and RAG context
    dynamic_system_prompt = get_system_prompt(db)

    if context:
        dynamic_system_prompt += f"\n\nUse the following official Clinic Knowledge Base information to answer the user's questions. If the user's query cannot be answered by this information, answer based on general clinic knowledge or politely request them to contact the clinic emergency line +92 300 1234567.\n\n[Clinic Knowledge Base]\n{context}"

    api_messages = [{"role": "system", "content": dynamic_system_prompt}]
    if payload.history:
        for hist in payload.history[-30:]:  # Limit history to last 30 messages to keep context window and history tracking balanced
            api_messages.append({"role": hist.role, "content": hist.content})
    api_messages.append({"role": "user", "content": user_msg})


    try:
        client = Groq(api_key=groq_api_key.strip())
        chat_completion = client.chat.completions.create(
            messages=api_messages,
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=1000
        )
        reply = chat_completion.choices[0].message.content
        
        # Smart dynamic 1-click quick replies based on current appointment question context
        reply_lower = reply.lower()
        if "prefer a male or female" in reply_lower or "doctor's gender" in reply_lower or "male or female doctor" in reply_lower:
            quick_replies = ["Male Doctor", "Female Doctor", "Any / No Preference"]
        elif "your gender" in reply_lower or "patient's gender" in reply_lower or "tell me your gender" in reply_lower:
            quick_replies = ["Male", "Female", "Prefer not to say"]
        elif "would you like to see dr." in reply_lower or "works for you" in reply_lower or "proceed with" in reply_lower:
            quick_replies = ["Yes, please", "No, suggest another"]
        elif "specialty" in reply_lower or "department" in reply_lower or "medical specialty" in reply_lower:
            quick_replies = ["Pediatrics", "Cardiology", "Dermatology", "Primary Care", "Dentistry", "Neurology"]
        elif "doctor" in reply_lower or "physician" in reply_lower or "specialist" in reply_lower:
            quick_replies = ["General Physician", "Cardiologist", "Dermatologist", "Pediatrician", "Dentist", "Any Available"]
        elif "time" in reply_lower or "timing" in reply_lower or "slot" in reply_lower or "hour" in reply_lower:
            quick_replies = ["Morning (10:00 AM)", "Afternoon (02:00 PM)", "Evening (06:00 PM)"]
        elif "date" in reply_lower or "day" in reply_lower:
            quick_replies = ["Today", "Tomorrow", "Monday", "Next Available"]
        elif "email" in reply_lower or "email address" in reply_lower:
            quick_replies = ["Skip Email"]
        elif "notes" in reply_lower or "symptom" in reply_lower or "reason" in reply_lower or "visit" in reply_lower:
            quick_replies = ["General Consultation", "Routine Checkup", "Follow-up"]
        elif "submit" in reply_lower or "ready" in reply_lower or "review" in reply_lower:
            quick_replies = ["Submit Appointment"]
        elif "appointment" in reply_lower or "book" in reply_lower:
            quick_replies = ["Book Appointment", "Clinic Timings"]
        else:
            quick_replies = ["Book Appointment", "Clinic Services", "Clinic Timings"]

        return ChatResponse(reply=reply, quickReplies=quick_replies)

    except Exception as e:
        print(f"Groq API Error: {e}")
        # Try a backup model in case llama-3.3 is overloaded
        try:
            chat_completion = client.chat.completions.create(
                messages=api_messages,
                model="llama-3.1-8b-instant",
                temperature=0.2,
                max_tokens=1000
            )
            reply = chat_completion.choices[0].message.content
            return ChatResponse(reply=reply, quickReplies=["Book Appointment", "Clinic Timings"])
        except Exception as backup_err:
            print(f"Groq API Backup Error: {backup_err}")
            raise HTTPException(status_code=500, detail=f"Backup error: {str(backup_err)}")
    except Exception as e:
        print(f"Chatbot General Error: {e}")
        raise HTTPException(status_code=500, detail=f"General error: {str(e)}")
