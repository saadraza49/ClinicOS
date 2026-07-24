from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title="LuminaHealth Clinic API",
    version="1.0.0",
    description="FastAPI Backend for Clinic Authentication and Services"
)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router under both root /auth and /api/v1
app.include_router(api_router)
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "LuminaHealth Clinic API is running"}
