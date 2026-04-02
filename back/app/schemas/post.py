from pydantic import BaseModel


class PostBase(BaseModel):
    title: str
    description: str


class PostCreate(PostBase):
    pass


class PostOut(PostBase):
    id: str

    class Config:
        from_attributes = True
