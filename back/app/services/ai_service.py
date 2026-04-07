import httpx

from app.core.config import settings
from app.schemas.ai import GenerateCoverLetterRequest, GenerateCoverLetterResponse


def generate_cover_letter(data: GenerateCoverLetterRequest) -> GenerateCoverLetterResponse:

    response = httpx.post(
        f"{settings.OLLAMA_BASE_URL}/api/generate",
        json={
            "model": settings.OLLAMA_MODEL,
            "prompt": (
                f"Write a professional cover letter in {data.language} for company {data.company_name}. "
                f"The candidate name is {data.applicant_name}. "
                "Base the letter completely on the provided job description. "
                "Highlight that the candidate matches the key requirements and responsibilities from the vacancy. "
                "If the vacancy mentions specific tools, technologies, or skills, reflect them in the letter as relevant strengths of the candidate. "
                "Write naturally, confidently, and professionally, as if the candidate is a strong fit for the role. "
                "Do not add placeholders, addresses, dates, headers, signatures, or English template phrases. "
                "Return only the final cover letter text. "
                f"Job description: {data.vacancy_text}"
            ),
            "stream": False,
        },
        timeout=360.0,
    )

    result = response.json()

    cover_letter = result["response"]

    return GenerateCoverLetterResponse(cover_letter=cover_letter)
