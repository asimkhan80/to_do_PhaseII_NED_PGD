"""
Pydantic schemas for Category API requests and responses.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator
import re


class CategoryCreate(BaseModel):
    """Schema for creating a new category."""

    name: str = Field(..., min_length=1, max_length=50)
    color: Optional[str] = Field(None, max_length=7)

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not re.match(r"^#[0-9A-Fa-f]{6}$", v):
            raise ValueError("Color must be a valid hex color code (e.g., #FF5733)")
        return v


class CategoryUpdate(BaseModel):
    """Schema for updating an existing category."""

    name: Optional[str] = Field(None, min_length=1, max_length=50)
    color: Optional[str] = Field(None, max_length=7)

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not re.match(r"^#[0-9A-Fa-f]{6}$", v):
            raise ValueError("Color must be a valid hex color code (e.g., #FF5733)")
        return v


class CategoryResponse(BaseModel):
    """Schema for category API responses."""

    id: UUID
    name: str
    color: Optional[str]
    is_default: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
