from pydantic import BaseModel


class PricingPlanOut(BaseModel):
    name: str
    price: int
    credits: int
    description: str
