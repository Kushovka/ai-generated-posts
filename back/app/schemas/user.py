from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
