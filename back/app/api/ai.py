from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.dependency import get_db
from app.models.ai import AIPost
from app.models.user import User
from app.schemas.ai import (
    CoverLetterOut,
    GenerateCoverLetterRequest,
    GenerateCoverLetterResponse,
)
from app.services.ai_service import generate_cover_letter

router = APIRouter(prefix="/ai", tags=["AI"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    email = decode_access_token(token)

    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="USer not found")

    return user


@router.post("/generate-cover-letter", response_model=CoverLetterOut)
def generate_cover_letter_route(
    data: GenerateCoverLetterRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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
    db.commit()
    db.refresh(aipost)
    return aipost


@router.get("/cover-letters", response_model=list[CoverLetterOut])
def get_cover_letters(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return db.query(AIPost).filter(AIPost.user_id == current_user.id).all()
