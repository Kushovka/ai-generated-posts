import uuid

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import get_current_user
from app.db.dependency import get_db
from app.models.payment import Payment
from app.models.user import User
from app.schemas.payment import (
    CreatePaymentRequest,
    CreatePaymentResponse,
    PaymentWebhookRequest,
)

router = APIRouter(prefix="/payments", tags=["Payments"])


plans = [
    {"name": "Старт", "price": 99, "credits": 10},
    {"name": "База", "price": 249, "credits": 30},
    {"name": "Плюс", "price": 499, "credits": 70},
]


@router.post("/create", response_model=CreatePaymentResponse)
def create_payment(
    data: CreatePaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = next((plan for plan in plans if plan["name"] == data.plan_name), None)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    payload = {
        "amount": {
            "value": f"{plan['price']}.00",
            "currency": "RUB",
        },
        "capture": True,
        "confirmation": {
            "type": "redirect",
            "return_url": settings.YOOKASSA_RETURN_URL,
        },
        "description": f"Покупка тарифа {plan['name']}",
    }
    response = httpx.post(
        "https://api.yookassa.ru/v3/payments",
        json=payload,
        auth=(settings.YOOKASSA_SHOP_ID, settings.YOOKASSA_SECRET_KEY),
        headers={
            "Idempotence-Key": str(uuid.uuid4()),
        },
    )

    if response.status_code not in (200, 201):
        raise HTTPException(status_code=400, detail=response.text)

    payment_data = response.json()
    payment_url = payment_data["confirmation"]["confirmation_url"]

    payment = Payment(
        user_id=current_user.id,
        plan_name=plan["name"],
        amount=plan["price"],
        credits=plan["credits"],
        provider_payment_id=payment_data["id"],
        status=payment_data["status"],
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {"payment_url": payment_url}


@router.post("/webhook")
def payment_webhook(
    data: PaymentWebhookRequest,
    db: Session = Depends(get_db),
):

    provider_payment_id = data.object.get("id")
    status = data.object.get("status")

    if not provider_payment_id:
        raise HTTPException(status_code=400, detail="Payment id not found")

    payment = (
        db.query(Payment)
        .filter(Payment.provider_payment_id == provider_payment_id)
        .first()
    )

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    old_status = payment.status
    payment.status = status

    if old_status != "succeeded" and status == "succeeded":
        user = db.query(User).filter(User.id == payment.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.credits += payment.credits

    db.commit()

    return {"ok": True}
