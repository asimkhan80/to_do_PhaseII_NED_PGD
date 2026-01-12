# Research: Phase II Full-Stack Web Todo Application

**Date**: 2026-01-11
**Branch**: `001-fullstack-web-todo`
**Status**: Complete

## Overview

This document consolidates technology research and decisions for the Phase II implementation. All NEEDS CLARIFICATION items from the Technical Context have been resolved.

---

## 1. FastAPI + SQLModel Integration

### Decision
Use FastAPI 0.109+ with SQLModel 0.0.14+ for the backend API layer.

### Rationale
- SQLModel is created by the same author as FastAPI (Sebastián Ramírez)
- Combines SQLAlchemy Core/ORM with Pydantic validation
- Single model class serves as both database table and API schema
- Native async support matches FastAPI's async-first design

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| FastAPI + SQLAlchemy | Requires separate Pydantic models, more boilerplate |
| FastAPI + Tortoise ORM | Less mature, smaller community |
| Django REST Framework | Heavier, not async-native |

### Best Practices
- Use `SQLModel` for database models with `table=True`
- Use plain `SQLModel` (no `table=True`) for request/response schemas
- Leverage Pydantic validators for business rule validation
- Use dependency injection for database sessions

---

## 2. Neon DB (Serverless PostgreSQL)

### Decision
Use Neon DB as the PostgreSQL provider with connection pooling.

### Rationale
- Serverless architecture matches modern deployment patterns
- Auto-scaling reduces operational overhead
- PostgreSQL compatibility ensures standard SQL features
- Free tier sufficient for Phase II development

### Connection Strategy
```python
# Use connection string with pooling endpoint
DATABASE_URL = "postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Configure SQLModel/SQLAlchemy with pool settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Handle connection drops
    pool_size=5,
    max_overflow=10
)
```

### Cold Start Mitigation
- Enable connection pooling in Neon dashboard
- Use `pool_pre_ping=True` to detect stale connections
- Consider keep-alive queries for production

---

## 3. Next.js 14 App Router

### Decision
Use Next.js 14 with App Router for the frontend.

### Rationale
- App Router is the recommended approach for new Next.js projects
- Server Components reduce client-side JavaScript
- Built-in data fetching patterns
- Excellent TypeScript support

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Next.js Pages Router | Legacy approach, App Router recommended |
| Create React App | No SSR, limited features |
| Vite + React | No SSR out of box, more config needed |
| Remix | Less ecosystem, steeper learning curve |

### Component Strategy
- **Server Components**: Initial data fetching, layout, static content
- **Client Components**: Interactive elements (forms, filters, modals)
- Use `'use client'` directive only where interactivity needed

---

## 4. State Management

### Decision
Use React hooks (useState, useReducer) with React Query (TanStack Query) for server state.

### Rationale
- React Query handles caching, refetching, optimistic updates
- No need for Redux/Zustand for this scope
- Filter/sort state can be URL params for shareability

### Implementation Pattern
```typescript
// Server state via React Query
const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks', filters],
  queryFn: () => fetchTasks(filters)
});

// Local UI state via useState
const [isFormOpen, setFormOpen] = useState(false);

// Filter state via URL params
const searchParams = useSearchParams();
```

---

## 5. API Design Patterns

### Decision
RESTful API with consistent response envelope and comprehensive error handling.

### Response Envelope
```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Task title is required",
    "details": [
      { "field": "title", "message": "Field is required" }
    ]
  }
}
```

### HTTP Status Codes
| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT, PATCH |
| 201 | Successful POST (created) |
| 204 | Successful DELETE |
| 400 | Validation error |
| 404 | Resource not found |
| 500 | Server error |

---

## 6. Recurring Task Implementation

### Decision
Store recurrence rules with tasks; generate next occurrence on completion.

### Rationale
- Simple model: recurrence_type enum + computed next_due_date
- No need for complex RRULE parsing in Phase II
- Keeps database queries simple

### Implementation
```python
class RecurrenceType(str, Enum):
    NONE = "none"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

# On task completion:
if task.recurrence_type != RecurrenceType.NONE:
    next_task = create_next_occurrence(task)
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| iCal RRULE format | Overkill for daily/weekly/monthly |
| Separate recurrence table | Added complexity, not needed for Phase II |
| Background job scheduler | Single-user mode doesn't need async generation |

---

## 7. Date/Time Handling

### Decision
Store all timestamps as UTC; display in user's local timezone.

### Backend
- Use `datetime.utcnow()` for all timestamps
- Store as PostgreSQL `TIMESTAMP WITH TIME ZONE`
- SQLModel field: `Field(default_factory=datetime.utcnow)`

### Frontend
- Parse ISO strings with `date-fns` or native `Intl`
- Display using user's browser timezone
- Send dates to API in ISO 8601 format

### Libraries
- Backend: Python `datetime` (stdlib)
- Frontend: `date-fns` for formatting/parsing

---

## 8. Soft Delete Pattern

### Decision
Implement soft delete with `deleted_at` timestamp.

### Rationale
- Allows task recovery within retention period
- Simple to implement with SQLModel
- Filtering handled at query level

### Implementation
```python
class Task(SQLModel, table=True):
    deleted_at: datetime | None = Field(default=None)

# Query active tasks
def get_active_tasks(session):
    return session.exec(
        select(Task).where(Task.deleted_at == None)
    ).all()
```

---

## 9. Testing Strategy

### Backend Testing
- **pytest** for all Python tests
- **pytest-asyncio** for async endpoint tests
- **httpx** AsyncClient for API testing
- **Factory Boy** or fixtures for test data

### Frontend Testing
- **Jest** as test runner
- **React Testing Library** for component tests
- **MSW (Mock Service Worker)** for API mocking

### Test Categories
| Category | Location | Purpose |
|----------|----------|---------|
| Contract | `backend/tests/contract/` | Verify API contracts |
| Integration | `backend/tests/integration/` | End-to-end flows |
| Unit | `backend/tests/unit/` | Business logic |
| Component | `frontend/tests/` | UI components |

---

## 10. Environment Configuration

### Decision
Use `.env` files with Pydantic Settings for backend, Next.js env for frontend.

### Backend (.env)
```
DATABASE_URL=postgresql://...
CORS_ORIGINS=http://localhost:3000
DEBUG=true
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Security
- Never commit `.env` files
- Provide `.env.example` templates
- Use secrets manager in production (Phase IV+)

---

## Summary

All technology decisions align with:
- Constitution mandate (Next.js, FastAPI, SQLModel, Neon DB)
- Phase II scope (single-user, web-only)
- Best practices for each technology

No NEEDS CLARIFICATION items remain. Ready for Phase 1 design artifacts.
