import sys
from sqlalchemy import text
from app.db.session import SessionLocal

def migrate_vector():
    db = SessionLocal()
    try:
        print("Ensuring pgvector extension is enabled in database...")
        db.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        db.commit()
        print("[SUCCESS] pgvector extension check passed.")

        print("Checking if 'embedding' column exists on 'faqs' table...")
        # Check column existence using information_schema
        result = db.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='faqs' AND column_name='embedding';"
        )).fetchone()

        if not result:
            print("Adding 'embedding' column of type vector(384) to 'faqs' table...")
            db.execute(text("ALTER TABLE faqs ADD COLUMN embedding vector(384);"))
            db.commit()
            print("[SUCCESS] 'embedding' column added successfully.")
        else:
            print("[INFO] 'embedding' column already exists in 'faqs' table.")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Migration failed: {e}", file=sys.stderr)
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    migrate_vector()
