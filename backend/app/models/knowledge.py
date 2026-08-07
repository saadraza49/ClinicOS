import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime
from pgvector.sqlalchemy import Vector
from app.db.base import Base

def generate_uuid():
    return str(uuid.uuid4())

class KnowledgeVector(Base):
    __tablename__ = "knowledge_vectors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    entity_type = Column(String(50), nullable=False, index=True) # e.g. "doctor", "service", "faq", "schedule", "clinic_info"
    entity_id = Column(String(36), nullable=True, index=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(384), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
