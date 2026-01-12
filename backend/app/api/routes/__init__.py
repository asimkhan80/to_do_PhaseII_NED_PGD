"""
Routes package - API route handlers.
"""

from app.api.routes.categories import router as categories_router
from app.api.routes.tasks import router as tasks_router

__all__ = [
    "tasks_router",
    "categories_router",
]
