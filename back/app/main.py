from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.api.ai import router as ai_router
from app.api.payment import router as payment_router
from app.api.pricing import router as pricing_router
from app.api.users import router as users_router

app = FastAPI(title="USERS-LIST")




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(pricing_router)
app.include_router(ai_router)
app.include_router(payment_router)
