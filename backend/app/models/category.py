"""
Category model for task organization.
"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.task import Task


class Category(SQLModel, table=True):
    """Category entity for grouping tasks."""

    __tablename__ = "categories"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=50, nullable=False, unique=True)
    color: Optional[str] = Field(default=None, max_length=7)  # #RRGGBB
    is_default: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    deleted_at: Optional[datetime] = Field(default=None)

    # Relationships
    tasks: list["Task"] = Relationship(back_populates="category")
