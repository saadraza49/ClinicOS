from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.chat import FAQ
from app.schemas.faq import FAQResponse

router = APIRouter()

@router.get("/", response_model=List[FAQResponse])
def get_faqs(
    category: Optional[str] = Query(None, description="Category filter"),
    search: Optional[str] = Query(None, description="Search term"),
    db: Session = Depends(get_db)
):
    query = db.query(FAQ)

    if category and category.lower() != "all":
        query = query.filter(FAQ.category.ilike(f"%{category}%"))

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (FAQ.question.ilike(search_pattern)) |
            (FAQ.answer.ilike(search_pattern))
        )

    faqs = query.order_by(FAQ.display_order.asc(), FAQ.id.asc()).all()
    return faqs
