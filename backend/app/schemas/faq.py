from pydantic import BaseModel, ConfigDict

class FAQResponse(BaseModel):
    id: str
    category: str
    question: str
    answer: str
    is_published: bool
    display_order: int

    model_config = ConfigDict(from_attributes=True)
