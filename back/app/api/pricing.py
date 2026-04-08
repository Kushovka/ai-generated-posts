from fastapi import APIRouter

from app.schemas.pricing import PricingPlanOut

router = APIRouter(prefix="/pricing", tags=["Pricing"])

plans = [
    {
        "name": "Старт",
        "price": 99,
        "credits": 10,
        "description": "Для первых откликов и проверки качества сервиса.",
    },
    {
        "name": "База",
        "price": 249,
        "credits": 30,
        "description": "Оптимально, если активно откликаешься на вакансии.",
    },
    {
        "name": "Плюс",
        "price": 499,
        "credits": 70,
        "description": "Подходит для интенсивного поиска работы и теста разных вакансий.",
    },
]


@router.get("/plans", response_model=list[PricingPlanOut])
def get_pricing_plans():
    return plans
