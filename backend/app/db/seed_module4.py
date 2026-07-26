import json
import uuid
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.chat import ChatSession, ChatMessage, FAQ
from app.models.user import User

def seed_module4():
    print("Creating Module 4 tables in database...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        patient_user = db.query(User).filter(User.email == "john.doe@example.com").first()

        # Seed FAQs
        faqs_data = [
            {
                "category": "Hours & Location",
                "question": "What are the clinic's operating hours?",
                "answer": "LuminaHealth Clinic is open Monday to Saturday from 8:00 AM to 9:00 PM. We are closed on Sundays.",
                "display_order": 1
            },
            {
                "category": "Appointments",
                "question": "How can I cancel or reschedule my appointment?",
                "answer": "You can cancel or reschedule up to 24 hours prior to your scheduled slot by using our AI Assistant or calling our main line.",
                "display_order": 2
            },
            {
                "category": "Billing & Insurance",
                "question": "What payment methods and insurance plans do you accept?",
                "answer": "We accept major credit/debit cards, cash, bank transfers, and leading health insurance providers.",
                "display_order": 3
            }
        ]

        for f in faqs_data:
            faq = db.query(FAQ).filter(FAQ.question == f["question"]).first()
            if not faq:
                faq = FAQ(**f)
                db.add(faq)
                db.commit()
                print(f"[CREATED] FAQ: '{f['question'][:30]}...'")

        # Seed ChatSession & ChatMessages
        session_token = "demo-session-token-9999"
        session = db.query(ChatSession).filter(ChatSession.session_token == session_token).first()
        if not session:
            session = ChatSession(
                user_id=patient_user.id if patient_user else None,
                session_token=session_token,
                title="Appointment Booking Inquiry",
                status="completed",
                booking_state=json.dumps({"selected_specialty": "Pediatrics", "selected_doctor": "Dr. Elena Rodriguez"})
            )
            db.add(session)
            db.commit()
            db.refresh(session)
            print(f"[CREATED] ChatSession: {session.id}")

            messages_data = [
                {
                    "sender": "user",
                    "content": "Hi, I need to book an appointment with a pediatrician.",
                    "quick_replies": None
                },
                {
                    "sender": "assistant",
                    "content": "Hello! I can certainly help you with that. We have Dr. Elena Rodriguez available. Would you like to check her schedule?",
                    "quick_replies": json.dumps(["Yes, check schedule", "Show doctor profile"])
                }
            ]

            for msg_data in messages_data:
                msg = ChatMessage(
                    session_id=session.id,
                    sender=msg_data["sender"],
                    content=msg_data["content"],
                    quick_replies=msg_data["quick_replies"]
                )
                db.add(msg)
            db.commit()
            print(f"[CREATED] ChatMessages for session {session.id}")

        print("[SUCCESS] Module 4 seed data inserted successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding Module 4 data: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_module4()
