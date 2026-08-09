from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import json
import urllib.request
import urllib.error
import re
from groq import Groq
from app.core.config import settings
from app.db.session import get_db
from app.services.vector_service import similarity_search

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None
    locale: Optional[str] = "en"

class ChatResponse(BaseModel):
    reply: str
    quickReplies: Optional[List[str]] = None

# Static Baseline Info
CLINIC_NAME = "WeCare Clinic"

def get_db_doctors_context(db: Session) -> str:
    """Fetch real-time doctor profiles and their working schedules directly from PostgreSQL DB."""
    try:
        from app.models.doctor import DoctorProfile, DoctorSchedule
        doctors = db.query(DoctorProfile).all()
        if not doctors:
            return "No specific doctor profiles retrieved."
        
        lines = []
        for d in doctors:
            scheds = db.query(DoctorSchedule).filter(
                DoctorSchedule.doctor_id == d.id,
                DoctorSchedule.is_active == True
            ).all()
            if scheds:
                sched_str = ", ".join([f"{s.day_of_week} ({s.start_time} - {s.end_time})" for s in scheds])
            else:
                sched_str = "Mon - Sat (09:00 AM - 05:00 PM)"
            
            lines.append(
                f"- Doctor Name: {d.full_name} | Specialty: {d.specialty} | Gender: {d.gender or 'Unspecified'} | Fee: {d.consultation_fee} PKR | Schedule: {sched_str} | Bio: {d.bio or ''}"
            )
        return "\n".join(lines)
    except Exception as e:
        print(f"Error fetching DB doctors context for chatbot: {e}")
        return "Real-time doctor database currently initializing."

BASE_PROMPT_HEADER = """You are a warm, friendly, and empathetic AI Assistant for WeCare Clinic.
Your goal is to converse smoothly, warmly, and concisely (keep responses to around 2 lines max) while helping patients with clinic inquiries and appointment bookings.

Retrieved Context from PostgreSQL Database (pgvector Match & Real-Time Doctors Directory):
"""

BASE_PROMPT_FOOTER = """
General Persona & Absolute Ban Rules:
- Warm & Friendly Tone: Greet patients warmly, use smooth conversational tone, and keep responses concise (approx 2 lines max).
- STRICT DOMAIN BOUNDARY (Clinic Info Only): You MUST ONLY answer questions related to WeCare Clinic (doctors, services, fees, timings, appointments, location, clinic FAQs). If a user asks off-topic questions (e.g. math like "2+2", coding, politics, general history, or trivia), politely refuse: "I'm WeCare Clinic's assistant! I can only help you with clinic services, doctors, consultation fees, and appointment bookings. How can I assist with your health today?"
- Time Slot & Schedule Accuracy: Perform strict logical time comparison against the doctor's actual database working hours.
- If users ask medical questions, provide general educational information only in 1-2 lines and recommend consulting a licensed doctor. Do not diagnose diseases or prescribe medicines.

ABSOLUTE BAN & NO-META-TEXT RULES (CRITICAL):
1. NEVER output confusing meta-text or redundant notes such as "(you already provided this as...)", "(you provided this as...)", or "(And I'll remind you that I still need your phone number...)".
2. NEVER list a field as "missing" if the user has already provided it!
3. NEVER fabricate or invent fake doctor names (e.g., NEVER say Dr. Rachel Lee or any non-existent doctor). ONLY recommend doctors from the Real-Time Doctors Database context above!
4. Keep responses direct, natural, and concise (1-2 lines max).




Appointment Booking Behavior & Sequential Pipeline:
Whenever the user expresses an intention to book an appointment (e.g., "Book appointment", "I need to see a doctor", "Schedule an appointment", or in any language), execute the strict sequential booking pipeline:

Phase 1: Basic Patient Info (Name, Age, Gender)
- Ask the user to provide their Full Name, Age, and Gender.
- GENDER OPTIONS RULE: If Gender is not provided, ask for Gender. Quick reply options (Male / Female / Other) will be displayed until Gender is provided.
- CRITICAL PHONE BAN IN PHASE 1: Do NOT ask for phone number at this stage! Phone number is strictly collected at the very end.

Phase 2: Reason for Visit & Doctor Recommendation from Database
- When the user provides their Reason for Visit or symptoms (e.g., skin issues, chest pain, child fever, teeth problems, routine checkup):
- Match their symptoms to the correct medical specialty and suggest the BEST matching doctor directly from the Real-Time Doctors Database list above!
- Example: "For skin conditions, Dr. Omar Al-Fayed (Dermatology Specialist) is our top doctor. Would you like to schedule with Dr. Omar Al-Fayed?"

Phase 3: Doctor Selection & Available Days
- Once a doctor is selected or recommended, look up that doctor's working schedule days from the Real-Time Doctors Database.
- Ask the user to choose their preferred day from that doctor's available days (e.g. Monday, Wednesday, Friday).

Phase 4: Day Selection & Time Slots
- When the user selects a day, present the available time slots within that doctor's working hours for that day (e.g. 09:00 AM, 11:00 AM, 02:00 PM, 04:00 PM).

Phase 5: Check Missing Details & Phone Number Collection (LAST & FINAL STEP)
- Check if Full Name, Age, or Gender are missing. If any of these are missing, ask for them now before phone number.
- ONCE AND ONLY ONCE Name, Age, Gender, Reason for Visit, Doctor, Date, and Time Slot are ALL 100% collected:
  Ask specifically: "Please enter your contact phone number to finalize your appointment:"
- CRITICAL STOPPING RULE: When asking for the phone number, YOU MUST STOP IMMEDIATELY! DO NOT output the SHOW_APPOINTMENT_REVIEW JSON in the same response! Wait for the user to type their phone number!

Phase 6: Structured Appointment Summary Form (JSON Render)
- You are FORBIDDEN from outputting the SHOW_APPOINTMENT_REVIEW JSON unless the user has EXPLICITLY typed their 10+ digit phone number in the conversation history!
- Once the user types their phone number, output a warm conversational summary AND append the SHOW_APPOINTMENT_REVIEW JSON:

Frontend Integration (ONLY IF 10+ DIGIT PHONE NUMBER IS PROVIDED):
{
"action": "SHOW_APPOINTMENT_REVIEW",
"completed": true,
"details": {
  "name": "[Collected Full Name]",
  "phone": "[MUST BE THE ACTUAL 10+ DIGIT NUMBER]",
  "age": "[Collected Age]",
  "gender": "[Collected Gender]",
  "doctor": "[Selected Doctor Name, e.g. Dr. Omar Al-Fayed]",
  "specialty": "[Selected Specialty]",
  "symptoms": "[Collected Reason/Symptoms]",
  "date": "[Collected Date]",
  "time": "[Collected Time]"
}
}
"""

QUICK_REPLY_MAP = {
    "zh": {
        "Male Doctor": "男医生",
        "Female Doctor": "女医生",
        "Any / No Preference": "无偏好 / 任意医生",
        "Male": "男",
        "Female": "女",
        "Prefer not to say": "保密",
        "Yes, please": "是的，确认",
        "No, suggest another": "不，更换医生",
        "Pediatrics": "儿科",
        "Cardiology": "心血管科",
        "Dermatology": "皮肤科",
        "Primary Care": "全科",
        "Dentistry": "牙科",
        "Neurology": "神经内科",
        "General Physician": "全科医生",
        "Cardiologist": "心血管医生",
        "Dermatologist": "皮肤科医生",
        "Pediatrician": "儿科医生",
        "Dentist": "牙科医生",
        "Any Available": "任意在诊医生",
        "Morning (10:00 AM)": "上午 (10:00)",
        "Afternoon (02:00 PM)": "下午 (14:00)",
        "Evening (06:00 PM)": "傍晚 (18:00)",
        "Today": "今天",
        "Tomorrow": "明天",
        "Monday": "周一",
        "Next Available": "最早就诊时段",
        "Skip Email": "跳过邮箱",
        "General Consultation": "普通门诊",
        "Routine Checkup": "常规体检",
        "Follow-up": "复诊",
        "Submit Appointment": "提交预约",
        "Book Appointment": "预约门诊",
        "Clinic Timings": "门诊时间",
        "Clinic Services": "诊所服务",
        "Clinic Location": "诊所位置",
        "Find a Doctor": "查找医生",
        "Emergency Contact": "急诊联系"
    },
    "fr": {
        "Male Doctor": "Médecin Homme",
        "Female Doctor": "Médecin Femme",
        "Any / No Preference": "Pas de préférence",
        "Male": "Homme",
        "Female": "Femme",
        "Prefer not to say": "Ne pas préciser",
        "Yes, please": "Oui, s'il vous plaît",
        "No, suggest another": "Non, un autre médecin",
        "Pediatrics": "Pédiatrie",
        "Cardiology": "Cardiologie",
        "Dermatology": "Dermatologie",
        "Primary Care": "Soins Primaires",
        "Dentistry": "Dentisterie",
        "Neurology": "Neurologie",
        "General Physician": "Médecin Généraliste",
        "Cardiologist": "Cardiologue",
        "Dermatologist": "Dermatologue",
        "Pediatrician": "Pédiatre",
        "Dentist": "Dentiste",
        "Any Available": "Tout médecin disponible",
        "Morning (10:00 AM)": "Matin (10h00)",
        "Afternoon (02:00 PM)": "Après-midi (14h00)",
        "Evening (06:00 PM)": "Soir (18h00)",
        "Today": "Aujourd'hui",
        "Tomorrow": "Demain",
        "Monday": "Lundi",
        "Next Available": "Premier disponible",
        "Skip Email": "Passer l'e-mail",
        "General Consultation": "Consultation Générale",
        "Routine Checkup": "Bilan de santé",
        "Follow-up": "Suivi médical",
        "Submit Appointment": "Soumettre le rendez-vous",
        "Book Appointment": "Prendre Rendez-vous",
        "Clinic Timings": "Heures d'Ouverture",
        "Clinic Services": "Services Cliniques",
        "Clinic Location": "Emplacement Clinique",
        "Find a Doctor": "Trouver un Médecin",
        "Emergency Contact": "Contact d'Urgence"
    }
}

def localize_quick_replies(quick_replies: List[str], locale: str) -> List[str]:
    norm_locale = (locale or "en").lower()
    if norm_locale not in QUICK_REPLY_MAP:
        return quick_replies
    lang_map = QUICK_REPLY_MAP[norm_locale]
    return [lang_map.get(item, item) for item in quick_replies]

def get_quick_replies_for_response(reply: str, locale: str) -> List[str]:
    reply_lower = reply.lower()
    
    is_asking_for_patient_gender = (
        ("• gender" in reply_lower or "select gender" in reply_lower or "provide your gender" in reply_lower or "what is your gender" in reply_lower or "your gender" in reply_lower or reply_lower.strip() == "gender")
        and "already" not in reply_lower
        and "confirm" not in reply_lower
        and "noted" not in reply_lower
        and "mentioned" not in reply_lower
        and "gender as" not in reply_lower
        and "doctor" not in reply_lower
    )

    if "prefer a male or female" in reply_lower or "doctor's gender" in reply_lower or "male or female doctor" in reply_lower or "男医生" in reply or "女医生" in reply:
        quick_replies = ["Male Doctor", "Female Doctor", "Any / No Preference"]
    elif is_asking_for_patient_gender:
        quick_replies = ["Male", "Female", "Other"]
    elif "would you like to see dr." in reply_lower or "works for you" in reply_lower or "proceed with" in reply_lower or "确认" in reply:
        quick_replies = ["Yes, please", "No, suggest another"]
    elif "which day" in reply_lower or "preferred day" in reply_lower or "available days" in reply_lower or "choose a day" in reply_lower or "preferred date" in reply_lower or "appointment date" in reply_lower:
        quick_replies = ["Today", "Tomorrow", "Monday", "Wednesday", "Friday"]
    elif "preferred time" in reply_lower or "which time" in reply_lower or "time slot" in reply_lower or "what time" in reply_lower or "available slots" in reply_lower:
        quick_replies = ["09:00 AM", "11:00 AM", "02:00 PM", "04:30 PM"]
    elif "which specialty" in reply_lower or "medical specialty" in reply_lower or "select a specialty" in reply_lower:
        quick_replies = ["Pediatrics", "Cardiology", "Dermatology", "Primary Care", "Dentistry", "Neurology"]
    elif "preferred doctor" in reply_lower or "which doctor" in reply_lower or "choose a doctor" in reply_lower:
        quick_replies = ["Dr. Omar Al-Fayed", "Dr. Elena Rodriguez", "Dr. Marcus Vance", "Dr. James Wilson", "Any Available"]
    elif "submit appointment" in reply_lower or "press the submit" in reply_lower:
        quick_replies = ["Submit Appointment"]
    else:
        quick_replies = []

    return localize_quick_replies(quick_replies, locale)


@router.post("", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest, db: Session = Depends(get_db)):
    user_msg = payload.message
    locale = (payload.locale or "en").lower()

    # Dynamic Vector Database Retrieval (pgvector match)
    try:
        matched_chunks = similarity_search(db, user_msg, limit=5)
        context_str = "\n".join([f"- {c}" for c in matched_chunks]) if matched_chunks else "No specific vector results found."
    except Exception as search_err:
        print(f"Vector Retrieval Error: {search_err}")
        context_str = "Vector retrieval temporarily unavailable."

    # Dynamic Real-Time Doctors & Schedules Context from DB
    db_doctors_info = get_db_doctors_context(db)
    full_context_str = context_str + "\n\nReal-Time Doctors Database Context:\n" + db_doctors_info

    full_base_prompt = BASE_PROMPT_HEADER + full_context_str + "\n" + BASE_PROMPT_FOOTER

    # Determine language directive
    if locale == "zh" or any("\u4e00" <= c <= "\u9fff" for c in user_msg):
        lang_instruction = "\n\nCRITICAL LANGUAGE REQUIREMENT: You MUST converse fluently, professionally, and naturally in Chinese (中文). All questions, responses, and summaries MUST be written in Chinese."
    elif locale == "fr" or any(w in user_msg.lower() for w in ["bonjour", "salut", "rendez-vous", "médecin", "merci"]):
        lang_instruction = "\n\nCRITICAL LANGUAGE REQUIREMENT: You MUST converse fluently, professionally, and naturally in French (Français). All questions, responses, and summaries MUST be written in French."
    else:
        lang_instruction = "\n\nCRITICAL LANGUAGE REQUIREMENT: Converse in clear, professional English."

    full_system_prompt = full_base_prompt + lang_instruction


    # Directly use the dedicated chatbot API key from environment
    groq_api_key = settings.CHATBOT_GROQ_API_KEY.strip()
    if not groq_api_key or "your_groq_api_key" in groq_api_key:
        if locale == "zh":
            return ChatResponse(
                reply=f"欢迎来到 {CLINIC_NAME}！我可以帮您预约门诊、介绍诊所服务、门诊时间或诊所位置。今天有什么可以为您效劳？",
                quickReplies=localize_quick_replies(["Book Appointment", "Clinic Timings", "Clinic Location"], locale)
            )
        elif locale == "fr":
            return ChatResponse(
                reply=f"Bienvenue chez {CLINIC_NAME} ! Je peux vous aider à prendre rendez-vous, vous expliquer nos services, nos horaires ou notre adresse. Comment puis-je vous aider aujourd'hui ?",
                quickReplies=localize_quick_replies(["Book Appointment", "Clinic Timings", "Clinic Location"], locale)
            )
        else:
            return ChatResponse(
                reply=f"Welcome to {CLINIC_NAME}! I can help you book appointments, explain our services, timings, or location. How may I assist you today?",
                quickReplies=["Book Appointment", "Clinic Timings", "Clinic Location"]
            )

    # Append a strict reminder to force the model to obey the language inside the user message
    final_user_content = user_msg
    if locale == "zh":
        final_user_content += "\n\n[System Reminder: You MUST reply to this message in Chinese (中文). Do not reply in English.]"
    elif locale == "fr":
        final_user_content += "\n\n[System Reminder: You MUST reply to this message in French (Français). Do not reply in English.]"

    # Build prompt messages including session history
    api_messages = [{"role": "system", "content": full_system_prompt}]
    if payload.history:
        for hist in payload.history[-30:]:
            api_messages.append({"role": hist.role, "content": hist.content})
    api_messages.append({"role": "user", "content": final_user_content})

    try:
        client = Groq(api_key=groq_api_key.strip())
        chat_completion = client.chat.completions.create(
            messages=api_messages,
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=1000
        )
        reply = chat_completion.choices[0].message.content

        return ChatResponse(reply=reply, quickReplies=get_quick_replies_for_response(reply, locale))

    except Exception as e:
        print(f"Groq API Error: {e}")
        try:
            chat_completion = client.chat.completions.create(
                messages=api_messages,
                model="llama-3.1-8b-instant",
                temperature=0.2,
                max_tokens=1000
            )
            reply = chat_completion.choices[0].message.content
            return ChatResponse(reply=reply, quickReplies=get_quick_replies_for_response(reply, locale))

        except Exception as backup_err:
            print(f"Groq API Backup Error: {backup_err}")
            return ChatResponse(
                reply="I'm sorry, I'm having trouble processing your request right now. Please try again or call our clinic directly.",
                quickReplies=[]
            )
    except Exception as e:
        print(f"Chatbot General Error: {e}")
        raise HTTPException(status_code=500, detail=f"General error: {str(e)}")
