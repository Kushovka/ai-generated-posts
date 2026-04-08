from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.dependency import get_db
from app.models.ai import AIPost
from app.models.user import User
from app.schemas.ai import CoverLetterOut, GenerateCoverLetterRequest
from app.services.ai_service import generate_cover_letter

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/generate-cover-letter", response_model=CoverLetterOut)
def generate_cover_letter_route(
    data: GenerateCoverLetterRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.credits <= 0:
        raise HTTPException(status_code=403, detail="No credits")
    generated = generate_cover_letter(data)
    aipost = AIPost(
        user_id=current_user.id,
        company_name=data.company_name,
        vacancy_text=data.vacancy_text,
        applicant_name=data.applicant_name,
        language=data.language,
        cover_letter=generated.cover_letter,
    )
    db.add(aipost)
    current_user.credits -= 1
    db.commit()
    db.refresh(aipost)
    return aipost


@router.get("/cover-letters", response_model=list[CoverLetterOut])
def get_cover_letters(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return db.query(AIPost).filter(AIPost.user_id == current_user.id).all()
