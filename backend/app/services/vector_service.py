from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastembed import TextEmbedding
from app.models.knowledge import KnowledgeVector
from app.models.doctor import DoctorProfile, DoctorSchedule, Department
from app.models.appointment import Service
from app.models.chat import FAQ

from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastembed import TextEmbedding
from app.models.knowledge import KnowledgeVector
from app.models.doctor import DoctorProfile, DoctorSchedule, Department
from app.models.appointment import Service
from app.models.chat import FAQ
import functools

# Initialize fastembed embedding model (BAAI/bge-small-en-v1.5 produces 384-dimensional embeddings)
_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        # threads=2 for multi-threaded fast embedding calculation
        _embedding_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5", threads=2)
    return _embedding_model

@functools.lru_cache(maxsize=1024)
def get_cached_embedding(text_content: str) -> tuple:
    model = get_embedding_model()
    embeddings = list(model.embed([text_content]))
    return tuple(embeddings[0].tolist())

def get_embedding(text_content: str) -> List[float]:
    return list(get_cached_embedding(text_content))

def sync_database_vectors(db: Session):
    """
    Reads existing Doctors, Services, Schedules, Departments, and FAQs from PostgreSQL,
    converts them into structured text representations, generates vectors, and saves/updates
    them in the knowledge_vectors table.
    """
    # 1. Ensure extension exists in database
    db.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
    db.commit()

    # Clear old vectors for recalculation
    db.query(KnowledgeVector).delete()
    db.commit()

    new_vectors = []

    # Sync Doctors
    doctors = db.query(DoctorProfile).all()
    for doc in doctors:
        dept_name = doc.department.name if doc.department else "General"
        schedules_str = ", ".join([f"{s.day_of_week}: {s.start_time}-{s.end_time}" for s in doc.schedules if s.is_active]) or "Schedule on request"
        doc_text = (
            f"Doctor: {doc.full_name}. Specialty: {doc.specialty}. Gender: {doc.gender or 'Unspecified'}. "
            f"Department: {dept_name}. Qualifications: {doc.qualifications or 'N/A'}. "
            f"Experience: {doc.experience_years} years. Consultation Fee: {doc.consultation_fee} PKR. "
            f"Rating: {doc.rating}/5. Bio: {doc.bio or ''}. Working Hours/Schedule: {schedules_str}."
        )
        vec = get_embedding(doc_text)
        new_vectors.append(KnowledgeVector(
            entity_type="doctor",
            entity_id=doc.id,
            content=doc_text,
            embedding=vec
        ))

    # Sync Services
    services = db.query(Service).all()
    for srv in services:
        dept_name = srv.department.name if srv.department else "General"
        srv_text = (
            f"Clinic Service: {srv.name}. Department: {dept_name}. Price: {srv.price} PKR. "
            f"Duration: {srv.duration_minutes} mins. Summary: {srv.short_description or ''}. "
            f"Full Description: {srv.full_description or ''}."
        )
        vec = get_embedding(srv_text)
        new_vectors.append(KnowledgeVector(
            entity_type="service",
            entity_id=srv.id,
            content=srv_text,
            embedding=vec
        ))

    # Sync FAQs
    faqs = db.query(FAQ).filter(FAQ.is_published == True).all()
    for faq in faqs:
        faq_text = f"FAQ Question: {faq.question}\nFAQ Answer: {faq.answer}"
        vec = get_embedding(faq_text)
        new_vectors.append(KnowledgeVector(
            entity_type="faq",
            entity_id=faq.id,
            content=faq_text,
            embedding=vec
        ))

    # Add General Clinic Info Vector
    clinic_info_text = (
        "Clinic Name: WeCare Clinic. "
        "Opening Hours: Monday to Saturday, 9:00 AM – 9:00 PM (Closed on Sundays). "
        "Emergency Contact: +92 300 1234567. "
        "Location & Address: 31.487555, 73.076189 (WeCare Health Center). Google Maps: https://maps.app.goo.gl/MRgu6Fdbd9PhaGmu7. "
        "General Consultation Fee: 1,500 PKR. Specialist Consultation Fee: 2,500 PKR."
    )
    vec = get_embedding(clinic_info_text)
    new_vectors.append(KnowledgeVector(
        entity_type="clinic_info",
        entity_id=None,
        content=clinic_info_text,
        embedding=vec
    ))

    # Batch insert to prevent database pooler connection timeouts
    batch_size = 5
    for i in range(0, len(new_vectors), batch_size):
        chunk = new_vectors[i:i + batch_size]
        db.add_all(chunk)
        db.commit()

    # Create HNSW index for ultra-fast vector search in PostgreSQL
    try:
        db.execute(text("CREATE INDEX IF NOT EXISTS kv_embedding_hnsw_idx ON knowledge_vectors USING hnsw (embedding vector_cosine_ops);"))
        db.commit()
    except Exception as idx_err:
        print(f"HNSW index creation warning: {idx_err}")

    return len(new_vectors)


def similarity_search(db: Session, query: str, limit: int = 5) -> List[str]:
    """
    Performs ultra-fast cosine similarity vector search on knowledge_vectors table.
    Automatically detects if new doctors/services were added to DB and re-syncs vectors on the fly!
    """
    # Auto-detect if user added/modified doctors directly in PostgreSQL DB
    try:
        current_doctors = db.query(DoctorProfile).count()
        vector_doctors = db.query(KnowledgeVector).filter(KnowledgeVector.entity_type == "doctor").count()
        if current_doctors != vector_doctors:
            sync_database_vectors(db)
    except Exception as count_err:
        print(f"Auto-sync check notice: {count_err}")

    cleaned_query = query.strip()
    # If the user is simply providing short form inputs (like phone number, age, "male", "yes"), skip vector DB query
    if len(cleaned_query.split()) <= 2 and (
        cleaned_query.isdigit() or 
        cleaned_query.lower() in ["male", "female", "yes", "no", "skip", "today", "tomorrow", "monday", "general consultation", "routine checkup", "follow-up"]
    ):
        return []

    query_vector = get_embedding(cleaned_query)
    results = (
        db.query(KnowledgeVector)
        .order_by(KnowledgeVector.embedding.cosine_distance(query_vector))
        .limit(limit)
        .all()
    )
    return [r.content for r in results]


