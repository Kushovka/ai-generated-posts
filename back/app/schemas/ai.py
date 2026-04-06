from pydantic import BaseModel


class GenerateCoverLetterRequest(BaseModel):
    company_name: str
    vacancy_text: str
    applicant_name: str
    language: str


class GenerateCoverLetterResponse(BaseModel):
    cover_letter: str


class CoverLetterOut(BaseModel):
    id: str
    company_name: str
    vacancy_text: str
    applicant_name: str
    language: str
    cover_letter: str

    class Config:
        from_attributes = True
