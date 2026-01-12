# Data Model: Phase II Full-Stack Web Todo Application

**Date**: 2026-01-11
**Branch**: `001-fullstack-web-todo`
**Source**: [spec.md](./spec.md) Key Entities section

## Overview

This document defines the database schema and entity relationships for the Phase II Todo application. All models use SQLModel for type-safe database operations.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         TASK                                 │
├─────────────────────────────────────────────────────────────┤
│ id: UUID (PK)                                               │
│ title: String (required, max 255)                           │
│ description: Text (optional)                                │
│ status: Enum [pending, completed]                           │
│ priority: Enum [high, medium, low]                          │
│ category_id: UUID (FK → Category) (optional)                │
│ due_date: Date (optional)                                   │
│ due_time: Time (optional)                                   │
│ recurrence_type: Enum [none, daily, weekly, monthly]        │
│ created_at: Timestamp                                       │
│ updated_at: Timestamp                                       │
│ completed_at: Timestamp (optional)                          │
│ deleted_at: Timestamp (optional, soft delete)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Many-to-One
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       CATEGORY                               │
├─────────────────────────────────────────────────────────────┤
│ id: UUID (PK)                                               │
│ name: String (required, unique, max 50)                     │
│ color: String (optional, hex color code)                    │
│ is_default: Boolean (system-provided categories)            │
│ created_at: Timestamp                                       │
│ updated_at: Timestamp                                       │
│ deleted_at: Timestamp (optional, soft delete)               │
└─────────────────────────────────────────────────────────────┘
```

---

## Entity Definitions

### Task

The primary entity representing a todo item.

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | UUID | Primary Key | auto-generated | Unique identifier |
| `title` | String(255) | Required, non-empty | - | Task title |
| `description` | Text | Optional | None | Detailed description |
| `status` | Enum | Required | `pending` | Current task state |
| `priority` | Enum | Required | `medium` | Task importance |
| `category_id` | UUID | Foreign Key, Optional | None | Link to Category |
| `due_date` | Date | Optional | None | Target completion date |
| `due_time` | Time | Optional | None | Target completion time |
| `recurrence_type` | Enum | Required | `none` | Repetition pattern |
| `created_at` | Timestamp | Required | now() | Creation timestamp (UTC) |
| `updated_at` | Timestamp | Required | now() | Last update timestamp (UTC) |
| `completed_at` | Timestamp | Optional | None | When task was completed |
| `deleted_at` | Timestamp | Optional | None | Soft delete timestamp |

#### Status Enum
```python
class TaskStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
```

#### Priority Enum
```python
class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
```

#### Recurrence Type Enum
```python
class RecurrenceType(str, Enum):
    NONE = "none"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
```

---

### Category

Groups tasks by user-defined or system-default categories.

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | UUID | Primary Key | auto-generated | Unique identifier |
| `name` | String(50) | Required, unique | - | Category name |
| `color` | String(7) | Optional, hex format | None | Display color (#RRGGBB) |
| `is_default` | Boolean | Required | False | System-provided flag |
| `created_at` | Timestamp | Required | now() | Creation timestamp (UTC) |
| `updated_at` | Timestamp | Required | now() | Last update timestamp (UTC) |
| `deleted_at` | Timestamp | Optional | None | Soft delete timestamp |

#### Default Categories (Seeded)
| Name | Color | is_default |
|------|-------|------------|
| Work | #3B82F6 (blue) | true |
| Home | #10B981 (green) | true |
| Personal | #8B5CF6 (purple) | true |

---

## SQLModel Definitions

### Task Model

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, date, time
from uuid import UUID, uuid4
from enum import Enum
from typing import Optional

class TaskStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"

class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class RecurrenceType(str, Enum):
    NONE = "none"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None)
    status: TaskStatus = Field(default=TaskStatus.PENDING)
    priority: Priority = Field(default=Priority.MEDIUM)
    category_id: Optional[UUID] = Field(default=None, foreign_key="categories.id")
    due_date: Optional[date] = Field(default=None)
    due_time: Optional[time] = Field(default=None)
    recurrence_type: RecurrenceType = Field(default=RecurrenceType.NONE)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    completed_at: Optional[datetime] = Field(default=None)
    deleted_at: Optional[datetime] = Field(default=None)

    # Relationship
    category: Optional["Category"] = Relationship(back_populates="tasks")
```

### Category Model

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional, List

class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=50, nullable=False, unique=True)
    color: Optional[str] = Field(default=None, max_length=7)  # #RRGGBB
    is_default: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    deleted_at: Optional[datetime] = Field(default=None)

    # Relationship
    tasks: List["Task"] = Relationship(back_populates="category")
```

---

## Validation Rules

### Task Validation

| Rule | Field(s) | Validation |
|------|----------|------------|
| Title required | `title` | Non-empty, max 255 chars |
| Due date not in past | `due_date` | >= today for new tasks |
| Time requires date | `due_time` | Only valid if `due_date` set |
| Completed requires timestamp | `status` | If COMPLETED, set `completed_at` |

### Category Validation

| Rule | Field(s) | Validation |
|------|----------|------------|
| Name required | `name` | Non-empty, max 50 chars |
| Name unique | `name` | Case-insensitive unique |
| Color format | `color` | Matches `^#[0-9A-Fa-f]{6}$` |
| Default immutable | `is_default` | Cannot delete default categories |

---

## State Transitions

### Task Status

```
┌─────────┐    complete()    ┌───────────┐
│ PENDING │ ───────────────► │ COMPLETED │
└─────────┘                  └───────────┘
     ▲                            │
     │         uncomplete()       │
     └────────────────────────────┘
```

### Task Lifecycle (with Soft Delete)

```
Created ──► Active ──► Completed
              │            │
              │            │ (if recurring)
              │            ▼
              │       New Task Created
              │
              ▼
         Soft Deleted ──► (30 days) ──► Hard Deleted
```

---

## Indexes

### Tasks Table

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `pk_tasks` | `id` | Primary | Primary key lookup |
| `ix_tasks_status` | `status` | B-tree | Filter by status |
| `ix_tasks_priority` | `priority` | B-tree | Filter/sort by priority |
| `ix_tasks_category` | `category_id` | B-tree | Filter by category |
| `ix_tasks_due_date` | `due_date` | B-tree | Sort/filter by due date |
| `ix_tasks_deleted` | `deleted_at` | B-tree | Exclude soft-deleted |
| `ix_tasks_search` | `title`, `description` | GIN (tsvector) | Full-text search |

### Categories Table

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `pk_categories` | `id` | Primary | Primary key lookup |
| `ix_categories_name` | `name` | Unique | Name lookup |

---

## Migration Strategy

### Initial Migration (001)

1. Create `categories` table
2. Create `tasks` table with foreign key
3. Seed default categories (Work, Home, Personal)

### Migration Commands

```bash
# Generate migration
alembic revision --autogenerate -m "initial_schema"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## Query Patterns

### Get Active Tasks with Filters

```python
def get_tasks(
    session: Session,
    status: Optional[TaskStatus] = None,
    priority: Optional[Priority] = None,
    category_id: Optional[UUID] = None,
    search: Optional[str] = None,
    due_before: Optional[date] = None,
    due_after: Optional[date] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> List[Task]:
    query = select(Task).where(Task.deleted_at == None)

    if status:
        query = query.where(Task.status == status)
    if priority:
        query = query.where(Task.priority == priority)
    if category_id:
        query = query.where(Task.category_id == category_id)
    if search:
        query = query.where(
            Task.title.ilike(f"%{search}%") |
            Task.description.ilike(f"%{search}%")
        )
    if due_before:
        query = query.where(Task.due_date <= due_before)
    if due_after:
        query = query.where(Task.due_date >= due_after)

    # Sorting
    sort_column = getattr(Task, sort_by)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    return session.exec(query).all()
```

### Create Recurring Task Instance

```python
def create_next_occurrence(task: Task) -> Task:
    if task.recurrence_type == RecurrenceType.DAILY:
        next_date = task.due_date + timedelta(days=1)
    elif task.recurrence_type == RecurrenceType.WEEKLY:
        next_date = task.due_date + timedelta(weeks=1)
    elif task.recurrence_type == RecurrenceType.MONTHLY:
        next_date = task.due_date + relativedelta(months=1)
    else:
        return None

    return Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        category_id=task.category_id,
        due_date=next_date,
        due_time=task.due_time,
        recurrence_type=task.recurrence_type
    )
```
