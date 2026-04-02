
from pydantic import BaseModel


class AIGeneratePostRequest(BaseModel):
    topic: str
    tone: str
    length: str
    language: str


class AIGeneratePostResponse(BaseModel):
    title: str
    content: str


class AIPostOut(BaseModel):
    id: str
    topic: str
    tone: str
    length: str
    language: str
    title: str
    content: str

    class Config:
        from_attributes = True
