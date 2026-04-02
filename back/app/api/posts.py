from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependency import get_db
from app.models.post import Post
from app.schemas.post import PostCreate, PostOut

router = APIRouter(prefix="/posts", tags=["POSTS"])


@router.get("/", response_model=list[PostOut])
def get_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()


@router.post("/", response_model=PostOut)
def create_posts(data: PostCreate, db: Session = Depends(get_db)):
    post = Post(title=data.title, description=data.description)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post
