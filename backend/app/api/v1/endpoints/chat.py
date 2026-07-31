from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import json
import urllib.request
import urllib.error
import re
from groq import Groq
from app.core.config import settings

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

# Static Clinic Data
CLINIC_NAME = "WeCare Clinic"
CLINIC_HOURS = "Monday to Saturday, 9:00 AM – 9:00 PM (Closed on Sundays)"
EMERGENCY_NUMBER = "+92 300 1234567"
MAPS_URL = "https://maps.app.goo.gl/MRgu6Fdbd9PhaGmu7"
ADDRESS = f"31.487555, 73.076189 (WeCare Health Center). Google Maps: {MAPS_URL}"
FEE_INFO = "General Physician: 1,500 PKR. Specialists: 2,500 PKR."

BASE_SYSTEM_PROMPT = f"""You are a professional AI healthcare assistant for {CLINIC_NAME}.
Your responsibility is to assist users with clinic-related information and appointment bookings in an empathetic, highly professional manner.

Doctors Database (10 Doctors):
1. Dr. Elena Rodriguez (Specialty: Pediatrics, Gender: Female)
2. Dr. Robert Miller (Specialty: Pediatrics, Gender: Male)
3. Dr. Marcus Vance (Specialty: Cardiology, Gender: Male)
4. Dr. Sarah Jenkins (Specialty: Cardiology, Gender: Female)
5. Dr. Omar Al-Fayed (Specialty: Dermatology, Gender: Male)
6. Dr. Sophia Carter (Specialty: Dermatology, Gender: Female)
7. Dr. James Wilson (Specialty: Primary Care, Gender: Male)
8. Dr. Fatima Ali (Specialty: Primary Care, Gender: Female)
9. Dr. Bilal Ahmed (Specialty: Dentistry, Gender: Male)
10. Dr. Priya Patel (Specialty: Neurology, Gender: Female)

Clinic Information:
- Name: {CLINIC_NAME}
- Opening Hours: {CLINIC_HOURS}
- Emergency Contact Number: {EMERGENCY_NUMBER}
- Address: {ADDRESS}
- Consultation Fees: {FEE_INFO}

General Behavior:
- Keep answers concise, clear, and professional.
- Stay focused on clinic-related topics.
- If users ask medical questions, provide general educational information only and recommend consulting a licensed doctor.
- Do not diagnose diseases or prescribe medicines.
- Never fabricate information.

Appointment Booking Behavior:
Whenever the user expresses an intention to book an appointment (e.g., "Book appointment", "I need to see a doctor", "Schedule an appointment", or in any language), immediately switch into Appointment Booking Mode.
- Collect the following required information one question at a time:
  1. Full Name
  2. Phone Number
  3. Email Address (optional - ask user if they want to share or skip)
  4. Age
  5. Gender (Patient's gender: Male/Female)
  6. Medical Specialty (e.g. Pediatrics, Cardiology, Dermatology, Primary Care, Dentistry, Neurology)
  7. Doctor Gender Preference (ONLY ask this question if the selected Specialty has BOTH Male and Female doctors in the Doctors Database. If the specialty has only one doctor or only one gender available, SKIP this question entirely!)
  8. Preferred Doctor (Suggest the doctor(s) matching the selected Specialty and Gender Preference. If the gender question was skipped, suggest the only doctor available for that specialty by name and ask if that works. Make sure the doctor's proper name like "Dr. Elena Rodriguez" is recorded.)
  9. Reason for Visit / Symptoms
  10. Preferred Date
  11. Preferred Time
- Ask only ONE question at a time and wait for the user's answer before asking the next question.
- Validate obvious mistakes (e.g., invalid phone numbers).
- Remember every answer during the conversation. Never ask for information already collected.

After all required information has been collected:
- Do NOT ask more questions. Do NOT claim the appointment has been booked. Do NOT confirm the booking.
- Only prepare the appointment details.
- Return a structured appointment summary.
- After displaying the summary, instruct the user to press the Submit Appointment button to confirm.

Frontend Integration:
When all required information has been collected and the summary is displayed, include the following JSON exactly at the very end of your response:
{{
"action": "SHOW_APPOINTMENT_REVIEW",
"completed": true,
"details": {{
  "name": "[Collected Full Name]",
  "phone": "[Collected Phone]",
  "age": "[Collected Age]",
  "gender": "[Collected Gender]",
  "doctor": "[Selected Doctor Name, e.g. Dr. Omar Al-Fayed]",
  "specialty": "[Selected Specialty]",
  "symptoms": "[Collected Reason/Symptoms]",
  "date": "[Collected Date]",
  "time": "[Collected Time]"
}}
}}
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

@router.post("", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    user_msg = payload.message
    locale = (payload.locale or "en").lower()

    # Determine language directive
    if locale == "zh" or any("\u4e00" <= c <= "\u9fff" for c in user_msg):
        lang_instruction = "\n\nCRITICAL LANGUAGE REQUIREMENT: You MUST converse fluently, professionally, and naturally in Chinese (中文). All questions, responses, and summaries MUST be written in Chinese."
    elif locale == "fr" or any(w in user_msg.lower() for w in ["bonjour", "salut", "rendez-vous", "médecin", "merci"]):
        lang_instruction = "\n\nCRITICAL LANGUAGE REQUIREMENT: You MUST converse fluently, professionally, and naturally in French (Français). All questions, responses, and summaries MUST be written in French."
    else:
        lang_instruction = "\n\nCRITICAL LANGUAGE REQUIREMENT: Converse in clear, professional English."

    full_system_prompt = BASE_SYSTEM_PROMPT + lang_instruction

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
        
        # Smart dynamic 1-click quick replies based on current appointment question context
        reply_lower = reply.lower()
        if "prefer a male or female" in reply_lower or "doctor's gender" in reply_lower or "male or female doctor" in reply_lower or "男医生" in reply or "女医生" in reply:
            quick_replies = ["Male Doctor", "Female Doctor", "Any / No Preference"]
        elif "your gender" in reply_lower or "patient's gender" in reply_lower or "tell me your gender" in reply_lower or "性别" in reply:
            quick_replies = ["Male", "Female", "Prefer not to say"]
        elif "would you like to see dr." in reply_lower or "works for you" in reply_lower or "proceed with" in reply_lower or "确认" in reply:
            quick_replies = ["Yes, please", "No, suggest another"]
        elif "specialty" in reply_lower or "department" in reply_lower or "medical specialty" in reply_lower or "专科" in reply:
            quick_replies = ["Pediatrics", "Cardiology", "Dermatology", "Primary Care", "Dentistry", "Neurology"]
        elif "doctor" in reply_lower or "physician" in reply_lower or "specialist" in reply_lower or "医生" in reply:
            quick_replies = ["General Physician", "Cardiologist", "Dermatologist", "Pediatrician", "Dentist", "Any Available"]
        elif "time" in reply_lower or "timing" in reply_lower or "slot" in reply_lower or "hour" in reply_lower or "时间" in reply:
            quick_replies = ["Morning (10:00 AM)", "Afternoon (02:00 PM)", "Evening (06:00 PM)"]
        elif "date" in reply_lower or "day" in reply_lower or "日期" in reply:
            quick_replies = ["Today", "Tomorrow", "Monday", "Next Available"]
        elif "email" in reply_lower or "email address" in reply_lower or "邮箱" in reply:
            quick_replies = ["Skip Email"]
        elif "notes" in reply_lower or "symptom" in reply_lower or "reason" in reply_lower or "visit" in reply_lower or "症状" in reply:
            quick_replies = ["General Consultation", "Routine Checkup", "Follow-up"]
        elif "submit" in reply_lower or "ready" in reply_lower or "review" in reply_lower or "提交" in reply:
            quick_replies = ["Submit Appointment"]
        elif "appointment" in reply_lower or "book" in reply_lower or "预约" in reply:
            quick_replies = ["Book Appointment", "Clinic Timings"]
        else:
            quick_replies = ["Book Appointment", "Clinic Services", "Clinic Timings"]

        localized_replies = localize_quick_replies(quick_replies, locale)
        return ChatResponse(reply=reply, quickReplies=localized_replies)

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
            localized_replies = localize_quick_replies(["Book Appointment", "Clinic Timings"], locale)
            return ChatResponse(reply=reply, quickReplies=localized_replies)
        except Exception as backup_err:
            print(f"Groq API Backup Error: {backup_err}")
            raise HTTPException(status_code=500, detail=f"Backup error: {str(backup_err)}")
    except Exception as e:
        print(f"Chatbot General Error: {e}")
        raise HTTPException(status_code=500, detail=f"General error: {str(e)}")
