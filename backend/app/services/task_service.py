"""
Task service with CRUD operations.
"""

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from sqlmodel import Session, select

from app.models.task import Priority, Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.recurrence import create_next_occurrence


class TaskService:
    """Service for task CRUD operations."""

    def __init__(self, session: Session):
        self.session = session

    def create(self, task_data: TaskCreate) -> Task:
        """Create a new task."""
        # Validate due_time requires due_date
        if task_data.due_time and not task_data.due_date:
            raise ValueError("due_time requires due_date to be set")

        # Validate due_date is not in the past (allow today)
        if task_data.due_date and task_data.due_date < date.today():
            raise ValueError("due_date cannot be in the past")

        task = Task(
            title=task_data.title,
            description=task_data.description,
            priority=task_data.priority,
            category_id=task_data.category_id,
            due_date=task_data.due_date,
            due_time=task_data.due_time,
            recurrence_type=task_data.recurrence_type,
        )
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def get_all(
        self,
        include_deleted: bool = False,
        status: Optional[TaskStatus] = None,
        priority: Optional[Priority] = None,
        category_id: Optional[UUID] = None,
        search: Optional[str] = None,
        due_before: Optional[date] = None,
        due_after: Optional[date] = None,
        sort_by: Optional[str] = "created_at",
        sort_order: Optional[str] = "desc",
        page: Optional[int] = 1,
        limit: Optional[int] = 50,
    ) -> list[Task]:
        """Get all tasks with optional filtering, sorting, and pagination."""
        query = select(Task)

        # Base filter: exclude soft-deleted
        if not include_deleted:
            query = query.where(Task.deleted_at == None)  # noqa: E711

        # Status filter
        if status:
            query = query.where(Task.status == status)

        # Priority filter
        if priority:
            query = query.where(Task.priority == priority)

        # Category filter
        if category_id:
            query = query.where(Task.category_id == category_id)

        # Search filter (ILIKE on title and description)
        if search:
            search_pattern = f"%{search}%"
            query = query.where(
                (Task.title.ilike(search_pattern))
                | (Task.description.ilike(search_pattern))
            )

        # Due date filters
        if due_before:
            query = query.where(Task.due_date <= due_before)

        if due_after:
            query = query.where(Task.due_date >= due_after)

        # Sorting
        sort_column = getattr(Task, sort_by, Task.created_at)
        if sort_order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        # Pagination
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        return list(self.session.exec(query).all())

    def get_by_id(self, task_id: UUID) -> Optional[Task]:
        """Get a single task by ID."""
        query = select(Task).where(
            Task.id == task_id,
            Task.deleted_at == None,  # noqa: E711
        )
        return self.session.exec(query).first()

    def update(self, task_id: UUID, task_data: TaskUpdate) -> Optional[Task]:
        """Update a task."""
        task = self.get_by_id(task_id)
        if not task:
            return None

        update_data = task_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(task, key, value)

        task.updated_at = datetime.utcnow()

        # Handle completion timestamp
        if task_data.status == TaskStatus.COMPLETED and task.completed_at is None:
            task.completed_at = datetime.utcnow()
        elif task_data.status == TaskStatus.PENDING:
            task.completed_at = None

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete(self, task_id: UUID) -> bool:
        """Soft delete a task."""
        task = self.get_by_id(task_id)
        if not task:
            return False

        task.deleted_at = datetime.utcnow()
        task.updated_at = datetime.utcnow()
        self.session.add(task)
        self.session.commit()
        return True

    def complete(self, task_id: UUID) -> tuple[Optional[Task], Optional[Task]]:
        """
        Mark a task as complete.
        For recurring tasks, also creates the next occurrence.

        Returns: (completed_task, next_task) - next_task is None for non-recurring tasks
        """
        task = self.get_by_id(task_id)
        if not task:
            return None, None

        task.status = TaskStatus.COMPLETED
        task.completed_at = datetime.utcnow()
        task.updated_at = datetime.utcnow()
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        # Create next occurrence for recurring tasks
        next_task = create_next_occurrence(self.session, task)

        return task, next_task

    def uncomplete(self, task_id: UUID) -> Optional[Task]:
        """Mark a task as pending (uncomplete)."""
        task = self.get_by_id(task_id)
        if not task:
            return None

        task.status = TaskStatus.PENDING
        task.completed_at = None
        task.updated_at = datetime.utcnow()
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task
