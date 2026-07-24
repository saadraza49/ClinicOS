from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import json
import urllib.request
import urllib.error
import re
from groq import Groq
import re
from app.core.config import settings

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

SYSTEM_PROMPT = f"""You are an AI assistant for {CLINIC_NAME}.
Your responsibility is to assist users with clinic-related information only.

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
- Keep answers short and friendly. Use simple English.
- Stay focused on clinic-related topics.
- If users ask medical questions, provide general educational information only and recommend consulting a licensed doctor.
- Do not diagnose diseases or prescribe medicines.
- Never fabricate information.

Appointment Booking Behavior:
Whenever the user expresses an intention to book an appointment (e.g., "Book appointment", "I need to see a doctor", "Schedule an appointment"), immediately switch into Appointment Booking Mode.
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
- Return a structured appointment summary exactly like this:

Appointment Summary
Full Name: [Name]
Phone Number: [Phone]
Email: [Email]
Age: [Age]
Gender: [Gender]
Doctor: [Selected Doctor Name, e.g. Dr. Omar Al-Fayed]
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
def chat_endpoint(payload: ChatRequest):
    user_msg = payload.message
    cleaned = clean_message(user_msg)

    # Only run static rule-based flows if we are NOT in the middle of booking an appointment
    if not is_booking_in_progress(payload.history):
        # 1. Rule-based flow: Doctor Flow & Symptom mapping
        skin_keywords = ["skin problems", "skin problem", "itchy skin", "acne", "rash", "dermatologist", "skin issue", "skin doctor"]
        if any(keyword in cleaned for keyword in skin_keywords):
            return ChatResponse(
                reply="I recommend consulting a Dermatologist.",
                quickReplies=["Book Appointment", "Clinic Services"]
            )

        heart_keywords = ["heart pain", "chest pain", "cardiologist", "heart issue", "heart problem", "heart doctor"]
        if any(keyword in cleaned for keyword in heart_keywords):
            return ChatResponse(
                reply="For heart related concerns, I recommend consulting a Cardiologist. If you are experiencing severe chest pain, please call emergency services immediately.",
                quickReplies=["Book Appointment", "Emergency Contact"]
            )

        child_keywords = ["child sick", "pediatrician", "baby", "toddler", "child doctor"]
        if any(keyword in cleaned for keyword in child_keywords):
            return ChatResponse(
                reply="For children and infant healthcare, I recommend consulting a Pediatrician.",
                quickReplies=["Book Appointment", "Clinic Services"]
            )

        dentist_keywords = ["toothache", "dentist", "dental", "teeth", "tooth pain"]
        if any(keyword in cleaned for keyword in dentist_keywords):
            return ChatResponse(
                reply="For dental concerns and toothaches, I recommend consulting a Dentist.",
                quickReplies=["Book Appointment", "Clinic Services"]
            )

        # 4. Quick reply mappings for static information
        if any(k in cleaned for k in ["clinic timings", "opening hours", "timings", "opening hour"]):
            return ChatResponse(
                reply=f"{CLINIC_NAME} is open {CLINIC_HOURS}.",
                quickReplies=["Book Appointment", "Clinic Location"]
            )

        if any(k in cleaned for k in ["clinic location", "address", "where is the clinic", "location"]):
            return ChatResponse(
                reply=f"We are located at {ADDRESS}. You can visit us during our operating hours.",
                quickReplies=["Clinic Timings", "Book Appointment"]
            )

        if any(k in cleaned for k in ["consultation fee", "fees", "price", "cost"]):
            return ChatResponse(
                reply=f"Our consultation fees are:\n- {FEE_INFO}",
                quickReplies=["Book Appointment", "Find a Doctor"]
            )

        if any(k in cleaned for k in ["emergency contact", "emergency number", "emergency"]):
            return ChatResponse(
                reply=f"For medical emergencies, please call our 24/7 emergency line at {EMERGENCY_NUMBER} immediately.",
                quickReplies=["Clinic Timings", "Book Appointment"]
            )

        if any(k in cleaned for k in ["clinic services", "services"]):
            return ChatResponse(
                reply="We offer a wide range of services including General Medicine, Cardiology, Dermatology, Dentistry, Pediatrics, and Gynecology.",
                quickReplies=["Find a Doctor", "Book Appointment"]
            )

    # Directly use the dedicated chatbot API key from environment
    groq_api_key = settings.CHATBOT_GROQ_API_KEY.strip()
    if not groq_api_key or "your_groq_api_key" in groq_api_key:
        # Fallback to local response if Groq API Key is not set up
        return ChatResponse(
            reply=f"Welcome to {CLINIC_NAME}! I can help you book appointments, explain our services, timings, or location. How may I assist you today?",
            quickReplies=["Book Appointment", "Clinic Timings", "Clinic Location"]
        )

    # Build prompt messages including session history
    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
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
