from datetime import datetime

from pydantic import BaseModel


class CreatePaymentRequest(BaseModel):
    plan_name: str


class CreatePaymentResponse(BaseModel):
    payment_url: str


class PaymentWebhookRequest(BaseModel):
    event: str
    object: dict


class PaymentOut(BaseModel):
    id: str
    user_id: str
    plan_name: str
    amount: int
    credits: int
    provider_payment_id: str
    status: str
    created_at: datetime
