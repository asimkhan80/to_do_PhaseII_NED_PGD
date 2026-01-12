from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import categories_router, tasks_router
from app.config import settings

app = FastAPI(
    title="Todo API",
    description="Phase II Full-Stack Web Todo Application API",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API v1 routers
API_V1_PREFIX = "/api/v1"
app.include_router(tasks_router, prefix=API_V1_PREFIX)
app.include_router(categories_router, prefix=API_V1_PREFIX)


@app.get("/health")
def health_check():
    """Health check endpoint returning status and timestamp."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
    }
