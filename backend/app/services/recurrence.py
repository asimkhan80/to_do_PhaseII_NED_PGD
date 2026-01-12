"""
Recurrence service for handling recurring task logic.
"""

from datetime import date, timedelta
from typing import Optional

from sqlmodel import Session

from app.models.task import RecurrenceType, Task, TaskStatus


def calculate_next_due_date(
    current_due_date: date, recurrence_type: RecurrenceType
) -> Optional[date]:
    """Calculate the next due date based on recurrence type."""
    if recurrence_type == RecurrenceType.NONE:
        return None
    elif recurrence_type == RecurrenceType.DAILY:
        return current_due_date + timedelta(days=1)
    elif recurrence_type == RecurrenceType.WEEKLY:
        return current_due_date + timedelta(weeks=1)
    elif recurrence_type == RecurrenceType.MONTHLY:
        # Add one month (handle edge cases like month-end)
        month = current_due_date.month + 1
        year = current_due_date.year
        if month > 12:
            month = 1
            year += 1
        # Handle days that don't exist in target month (e.g., Jan 31 -> Feb 28)
        day = min(current_due_date.day, 28)  # Safe default
        try:
            return date(year, month, current_due_date.day)
        except ValueError:
            return date(year, month, day)
    return None


def create_next_occurrence(session: Session, completed_task: Task) -> Optional[Task]:
    """
    Create the next occurrence of a recurring task.
    Called when a recurring task is completed.

    Returns the new task if created, None otherwise.
    """
    if completed_task.recurrence_type == RecurrenceType.NONE:
        return None

    if not completed_task.due_date:
        # Recurring tasks need a due date to calculate next occurrence
        return None

    next_due_date = calculate_next_due_date(
        completed_task.due_date, completed_task.recurrence_type
    )

    if not next_due_date:
        return None

    # Create new task with same properties
    new_task = Task(
        title=completed_task.title,
        description=completed_task.description,
        priority=completed_task.priority,
        category_id=completed_task.category_id,
        due_date=next_due_date,
        due_time=completed_task.due_time,
        recurrence_type=completed_task.recurrence_type,
        status=TaskStatus.PENDING,
    )

    session.add(new_task)
    session.commit()
    session.refresh(new_task)

    return new_task
