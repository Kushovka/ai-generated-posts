import httpx

from app.core.config import settings
from app.schemas.ai import AIGeneratePostRequest, AIGeneratePostResponse


def generate_post(data: AIGeneratePostRequest) -> AIGeneratePostResponse:

    response = httpx.post(
        f"{settings.OLLAMA_BASE_URL}/api/generate",
        json={
            "model": settings.OLLAMA_MODEL,
            "prompt": (
                f"Write a blog post about {data.topic}. "
                f"Language: {data.language}. "
                f"Tone: {data.tone}. Length: {data.length}."
            ),
            "stream": False,
        },
        timeout=60.0,
    )

    result = response.json()

    content = result["response"]

    return AIGeneratePostResponse(title=f"Post about {data.topic}", content=content)
