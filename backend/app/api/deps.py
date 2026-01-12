"""
API dependencies for dependency injection.
"""

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from app.database import get_session
from app.services.category_service import CategoryService
from app.services.task_service import TaskService

# Database session dependency
SessionDep = Annotated[Session, Depends(get_session)]


def get_task_service(session: SessionDep) -> TaskService:
    """Get task service with database session."""
    return TaskService(session)


def get_category_service(session: SessionDep) -> CategoryService:
    """Get category service with database session."""
    return CategoryService(session)


# Service dependencies
TaskServiceDep = Annotated[TaskService, Depends(get_task_service)]
CategoryServiceDep = Annotated[CategoryService, Depends(get_category_service)]
