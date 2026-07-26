import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

from pgvector.sqlalchemy import Vector

def generate_uuid():
    return str(uuid.uuid4())

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    session_token = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=True)
    booking_state = Column(Text, nullable=True)
    status = Column(String(50), default="active", nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", backref="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    quick_replies = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    session = relationship("ChatSession", back_populates="messages")


class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    category = Column(String(100), default="General", nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    embedding = Column(Vector(384), nullable=True)
    is_published = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

