import sys
from app.db.session import SessionLocal
from app.models.chat import FAQ
from app.core.embeddings import get_embedding

def seed_clinic_knowledge():
    db = SessionLocal()
    try:
        print("Starting seeding of clinic knowledge and embeddings...")

        # Detailed clinic knowledge represented as question/answer chunks
        knowledge_data = [
            # Clinic general info
            {
                "category": "Hours & Location",
                "question": "What are your opening hours and timings?",
                "answer": "LuminaHealth Clinic is open Monday to Saturday, 9:00 AM – 9:00 PM (Closed on Sundays)."
            },
            {
                "category": "Hours & Location",
                "question": "Where is the clinic located? What is the address?",
                "answer": "LuminaHealth Clinic is located at 123 Healing Way, Wellness District, CA 90210. Free visitor parking is available in the front garage with full wheelchair access."
            },
            {
                "category": "Emergency Care",
                "question": "What is the emergency contact number? What should I do in an emergency?",
                "answer": "For medical emergencies, please call our 24/7 emergency line at +92 300 1234567 immediately or visit the nearest Emergency Room (ER)."
            },
            {
                "category": "Billing & Fees",
                "question": "What are the consultation fees for doctors?",
                "answer": "General Physician / Primary Care: 1,500 PKR / 120 USD. Specialist Doctors (Cardiology, Dermatology, Pediatrics, Dentistry, Neurology): 2,500 PKR / 150-250 USD."
            },
            {
                "category": "Billing & Fees",
                "question": "Which insurance providers do you accept?",
                "answer": "We accept major insurance plans including Aetna, Blue Cross, Cigna, and UnitedHealth. Please bring your insurance card at the time of visit."
            },
            
            # Doctors: Pediatrics
            {
                "category": "Doctors",
                "question": "Tell me about Dr. Elena Rodriguez (Pediatrics)",
                "answer": "Dr. Elena Rodriguez is a female board-certified Pediatrician (Pediatrics specialty) with 12 years of experience. Her qualifications include MD, FAAP. Her consultation fee is 150 USD (or equivalent). She speaks English and Spanish. She is available on Mondays and Wednesdays from 9:00 AM to 5:00 PM."
            },
            {
                "category": "Doctors",
                "question": "Tell me about Dr. Robert Miller (Pediatrics)",
                "answer": "Dr. Robert Miller is a male board-certified Pediatrician (Pediatrics specialty) with 14 years of experience. His qualifications include MD, Pediatric Specialist. His consultation fee is 150 USD (or equivalent). He speaks English. He is available on Mondays and Wednesdays from 9:00 AM to 5:00 PM."
            },
            
            # Doctors: Cardiology
            {
                "category": "Doctors",
                "question": "Tell me about Dr. Marcus Vance (Cardiology)",
                "answer": "Dr. Marcus Vance is a male board-certified Cardiologist (Cardiology specialty) with 22 years of experience. His qualifications include MD, FACC. His consultation fee is 250 USD (or equivalent). He speaks English. He is available on Mondays and Wednesdays from 9:00 AM to 5:00 PM."
            },
            {
                "category": "Doctors",
                "question": "Tell me about Dr. Sarah Jenkins (Cardiology)",
                "answer": "Dr. Sarah Jenkins is a female board-certified Cardiologist (Cardiology specialty) with 16 years of experience. Her qualifications include MD, FACC, FSCAI. Her consultation fee is 250 USD (or equivalent). She speaks English and Spanish. She is available on Mondays and Wednesdays from 9:00 AM to 5:00 PM."
            },

            # Doctors: Dermatology
            {
                "category": "Doctors",
                "question": "Tell me about Dr. Omar Al-Fayed (Dermatology)",
                "answer": "Dr. Omar Al-Fayed is a male board-certified Dermatologist (Dermatology specialty) with 10 years of experience. His qualifications include MD, FAAD. His consultation fee is 180 USD (or equivalent). He speaks English. He is available on Mondays and Wednesdays from 9:00 AM to 5:00 PM."
            },
            {
                "category": "Doctors",
                "question": "Tell me about Dr. Sophia Carter (Dermatology)",
                "answer": "Dr. Sophia Carter is a female board-certified Dermatologist (Dermatology specialty) with 8 years of experience. Her qualifications include MD, Skincare Specialist. Her consultation fee is 180 USD (or equivalent). She speaks English and Spanish. She is available on Mondays and Wednesdays from 9:00 AM to 5:00 PM."
            },

            # Doctors: Primary Care
            {
                "category": "Doctors",
                "question": "Tell me about Dr. James Wilson (Primary Care / General Physician)",
                "answer": "Dr. James Wilson is a male board-certified Family Medicine/Primary Care physician with 15 years of experience. His qualifications include MD, ABFM. His consultation fee is 120 USD (or equivalent). He speaks English. He is available on Mondays and Wednesdays from 9:00 AM to 5:00 PM."
            },
            {
                "category": "Doctors",
                "question": "Tell me about Dr. Fatima Ali (Primary Care / General Physician)",
                "answer": "Dr. Fatima Ali is a female board-certified Family Medicine/Primary Care physician with 11 years of experience. Her qualifications include MD, Family Medicine. Her consultation fee is 120 USD (or equivalent). She speaks English and Spanish. She is available on Mondays and Wednesdays from 9:00 AM to 5:00 PM."
            },

            # Doctors: Dentistry
            {
                "category": "Doctors",
                "question": "Tell me about Dr. Bilal Ahmed (Dentistry / Dentist)",
                "answer": "Dr. Bilal Ahmed is a male board-certified Dentist (Dentistry specialty) with 9 years of experience. His qualifications include DDS, Cosmetic Dentist. His consultation fee is 140 USD (or equivalent). He speaks English. He is available on Mondays and Wednesdays from 9:00 AM to 5:00 PM."
            },

            # Doctors: Neurology
            {
                "category": "Doctors",
                "question": "Tell me about Dr. Priya Patel (Neurology / Neurologist)",
                "answer": "Dr. Priya Patel is a female board-certified Neurologist (Neurology specialty) with 9 years of experience. Her qualifications include MD, PhD. Her consultation fee is 200 USD (or equivalent). She speaks English and Spanish. She is available on Mondays and Wednesdays from 9:00 AM to 5:00 PM."
            },

            # Services
            {
                "category": "Services",
                "question": "What Pediatric services do you offer? General Pediatric Checkup",
                "answer": "We offer General Pediatric Checkup (150 USD) for infant and child healthcare, and Child Vaccination & Immunization (90 USD). Our pediatricians Dr. Elena Rodriguez and Dr. Robert Miller care for newborns up to 18-year-old adolescents."
            },
            {
                "category": "Services",
                "question": "What Cardiology services do you offer? Heart exam",
                "answer": "We offer Cardiovascular Health Assessments (250 USD) and ECG & Heart Function Exams (180 USD). These are led by our board-certified cardiologists Dr. Marcus Vance and Dr. Sarah Jenkins."
            },
            {
                "category": "Services",
                "question": "What Dermatology services do you offer? Skin care",
                "answer": "We offer Acne & Skin Consultations (180 USD) for skin, hair, nail treatments, and cosmetic skincare, led by Dr. Omar Al-Fayed and Dr. Sophia Carter."
            },
            {
                "category": "Services",
                "question": "What Dentistry services do you offer? Dental cleaning",
                "answer": "We offer Dental Cleaning & Polishing (140 USD), fillings, and oral health checkups, led by our cosmetic dentist Dr. Bilal Ahmed."
            },
            {
                "category": "Services",
                "question": "What Neurology services do you offer? Headaches",
                "answer": "We offer Neurological Headaches & Sleep Exams (200 USD) for diagnosis and treatment of nervous system disorders, led by Dr. Priya Patel."
            },

            # General FAQs
            {
                "category": "General",
                "question": "Do you offer online telehealth appointments / virtual consultations?",
                "answer": "Yes, online video consultations (telehealth) are available for Primary Care and Dermatology. You can schedule them online."
            },
            {
                "category": "General",
                "question": "How do I request my medical records?",
                "answer": "Log in to your patient portal account to view and download your health history and medical records."
            },
            {
                "category": "General",
                "question": "How do I request a prescription refill?",
                "answer": "You can request prescription refills online via your patient portal, or ask your pharmacy to submit a refill authorization to us."
            }
        ]

        # Seed and update embeddings
        for idx, k in enumerate(knowledge_data):
            faq = db.query(FAQ).filter(FAQ.question == k["question"]).first()
            
            # Combine question and answer to build a rich search context
            text_to_embed = f"Question: {k['question']}\nAnswer: {k['answer']}"
            print(f"Generating embedding for: '{k['question'][:40]}...'")
            embedding_vector = get_embedding(text_to_embed)

            if faq:
                faq.answer = k["answer"]
                faq.category = k["category"]
                faq.embedding = embedding_vector
                faq.display_order = idx + 1
                print(f"-> Updated existing knowledge entry.")
            else:
                faq = FAQ(
                    category=k["category"],
                    question=k["question"],
                    answer=k["answer"],
                    embedding=embedding_vector,
                    is_published=True,
                    display_order=idx + 1
                )
                db.add(faq)
                print(f"-> Created new knowledge entry.")
            
            db.commit()

        # Check existing published FAQs that don't have embeddings and generate them
        unembedded_faqs = db.query(FAQ).filter(FAQ.embedding == None).all()
        if unembedded_faqs:
            print(f"Found {len(unembedded_faqs)} existing FAQs without embeddings. Generating embeddings now...")
            for faq in unembedded_faqs:
                text_to_embed = f"Question: {faq.question}\nAnswer: {faq.answer}"
                faq.embedding = get_embedding(text_to_embed)
                db.commit()
            print("[SUCCESS] All existing FAQs have been embedded.")

        print("\n==========================================")
        print("[SUCCESS] CLINIC KNOWLEDGE SEEDED WITH VECTOR EMBEDDINGS!")
        print("==========================================")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seeding failed: {e}", file=sys.stderr)
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_clinic_knowledge()
