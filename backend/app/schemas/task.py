"""
Pydantic schemas for Task API requests and responses.
"""

from datetime import date, datetime, time
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.task import Priority, RecurrenceType, TaskStatus


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    category_id: Optional[UUID] = None
    due_date: Optional[date] = None
    due_time: Optional[time] = None
    recurrence_type: RecurrenceType = RecurrenceType.NONE


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[Priority] = None
    category_id: Optional[UUID] = None
    due_date: Optional[date] = None
    due_time: Optional[time] = None
    recurrence_type: Optional[RecurrenceType] = None


class CategoryResponse(BaseModel):
    """Nested category in task response."""

    id: UUID
    name: str
    color: Optional[str]

    class Config:
        from_attributes = True


class TaskResponse(BaseModel):
    """Schema for task API responses."""

    id: UUID
    title: str
    description: Optional[str]
    status: TaskStatus
    priority: Priority
    category_id: Optional[UUID]
    category: Optional[CategoryResponse]
    due_date: Optional[date]
    due_time: Optional[time]
    recurrence_type: RecurrenceType
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class TaskCompleteResponse(BaseModel):
    """Response for task completion, includes next task for recurring tasks."""

    task: TaskResponse
    next_task: Optional[TaskResponse] = None
