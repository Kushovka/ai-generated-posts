from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependency import get_db
from app.models.ai import AIPost
from app.schemas.ai import AIGeneratePostRequest, AIGeneratePostResponse, AIPostOut
from app.services.ai_service import generate_post

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/generate-post", response_model=AIPostOut)
def post_ai(data: AIGeneratePostRequest, db: Session = Depends(get_db)):
    generated = generate_post(data)
    aipost = AIPost(
        topic=data.topic,
        tone=data.tone,
        length=data.length,
        language=data.language,
        title=generated.title,
        content=generated.content,
    )
    db.add(aipost)
    db.commit()
    db.refresh(aipost)
    return aipost


@router.get("/", response_model=list[AIPostOut])
def get_ai(db: Session = Depends(get_db)):
    return db.query(AIPost).all()
