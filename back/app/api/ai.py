from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependency import get_db
from app.models.ai import AIPost
from app.schemas.ai import (
    CoverLetterOut,
    GenerateCoverLetterRequest,
    GenerateCoverLetterResponse,
)
from app.services.ai_service import generate_cover_letter

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/generate-cover-letter", response_model=CoverLetterOut)
def generate_cover_letter_route(
    data: GenerateCoverLetterRequest, db: Session = Depends(get_db)
):
    generated = generate_cover_letter(data)
    aipost = AIPost(
        company_name=data.company_name,
        vacancy_text=data.vacancy_text,
        applicant_name=data.applicant_name,
        language=data.language,
        cover_letter=generated.cover_letter,
    )
    db.add(aipost)
    db.commit()
    db.refresh(aipost)
    return aipost


@router.get("/cover-letters", response_model=list[CoverLetterOut])
def get_cover_letters(db: Session = Depends(get_db)):
    return db.query(AIPost).all()
