import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.services.vector_service import sync_database_vectors
from sqlalchemy import text

def main():
    print("Initializing Database tables & pgvector extension...")
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        conn.commit()

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Vectorizing database content (Doctors, Services, FAQs, Clinic Info)...")
        count = sync_database_vectors(db)
        print(f"Successfully generated and stored {count} vectors in PostgreSQL knowledge_vectors table!")
    except Exception as e:
        print(f"Error vectorizing data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
