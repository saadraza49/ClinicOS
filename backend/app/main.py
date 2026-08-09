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
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router under both root /auth and /api/v1
app.include_router(api_router)
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
def startup_event():
    # Pre-warm embedding model into RAM on server boot to avoid cold-start latency
    try:
        from app.services.vector_service import get_embedding_model
        get_embedding_model()
        print("Embedding model successfully pre-warmed in memory.")
    except Exception as err:
        print(f"Startup model pre-warm notice: {err}")

@app.get("/")
def root():
    return {"message": "LuminaHealth Clinic API is running"}

