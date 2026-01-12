"""
Task API routes.
"""

from datetime import date
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import TaskServiceDep
from app.models.task import Priority, TaskStatus
from app.schemas.task import TaskCompleteResponse, TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_data: TaskCreate, task_service: TaskServiceDep) -> TaskResponse:
    """Create a new task."""
    try:
        task = task_service.create(task_data)
        return task
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("", response_model=list[TaskResponse])
def get_tasks(
    task_service: TaskServiceDep,
    status: Optional[TaskStatus] = Query(None, description="Filter by status"),
    priority: Optional[Priority] = Query(None, description="Filter by priority"),
    category_id: Optional[UUID] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    due_before: Optional[date] = Query(None, description="Filter tasks due before date"),
    due_after: Optional[date] = Query(None, description="Filter tasks due after date"),
    sort_by: Optional[str] = Query("created_at", description="Sort field: title, priority, due_date, created_at"),
    sort_order: Optional[str] = Query("desc", description="Sort order: asc, desc"),
    page: Optional[int] = Query(1, ge=1, description="Page number"),
    limit: Optional[int] = Query(50, ge=1, le=100, description="Items per page"),
) -> list[TaskResponse]:
    """Get all tasks with optional filtering, sorting, and pagination."""
    return task_service.get_all(
        status=status,
        priority=priority,
        category_id=category_id,
        search=search,
        due_before=due_before,
        due_after=due_after,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        limit=limit,
    )


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: UUID, task_service: TaskServiceDep) -> TaskResponse:
    """Get a single task by ID."""
    task = task_service.get_by_id(task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: UUID, task_data: TaskUpdate, task_service: TaskServiceDep
) -> TaskResponse:
    """Update a task."""
    task = task_service.update(task_id, task_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: UUID, task_service: TaskServiceDep) -> None:
    """Soft delete a task."""
    deleted = task_service.delete(task_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )


@router.post("/{task_id}/complete", response_model=TaskCompleteResponse)
def complete_task(task_id: UUID, task_service: TaskServiceDep) -> TaskCompleteResponse:
    """Mark a task as complete. For recurring tasks, creates the next occurrence."""
    task, next_task = task_service.complete(task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskCompleteResponse(task=task, next_task=next_task)


@router.post("/{task_id}/uncomplete", response_model=TaskResponse)
def uncomplete_task(task_id: UUID, task_service: TaskServiceDep) -> TaskResponse:
    """Mark a task as pending (uncomplete)."""
    task = task_service.uncomplete(task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task
