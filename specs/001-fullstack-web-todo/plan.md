# Implementation Plan: Phase II Full-Stack Web Todo Application

**Branch**: `001-fullstack-web-todo` | **Date**: 2026-01-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fullstack-web-todo/spec.md`

## Summary

Transform the basic Todo application into a production-grade, full-stack web application with task organization (priorities, categories), search/filtering, sorting, due dates with time awareness, and recurring task support. The system uses a Next.js frontend communicating via REST API with a FastAPI backend, persisting data to Neon DB (PostgreSQL) using SQLModel ORM.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: FastAPI 0.109+, SQLModel 0.0.14+, Next.js 14+, React 18+
**Storage**: Neon DB (PostgreSQL 15+) via SQLModel ORM
**Testing**: pytest (backend), Jest + React Testing Library (frontend)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Web application (frontend + backend separation)
**Performance Goals**: <2s page load, <1s API response, 1000 tasks per user
**Constraints**: Stateless API, environment-based config, single-user mode (Phase II)
**Scale/Scope**: Single user, up to 1000 tasks, responsive desktop/mobile UI

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Spec-Driven Development | All code via agents | PASS | Using Claude Code for all implementation |
| II. Technology Stack Mandate | Next.js, FastAPI, SQLModel, Neon DB | PASS | Exact stack specified |
| III. Full-Stack Architecture | Stateless APIs, env config, REST | PASS | Design follows separation |
| IV. Data Persistence | Spec-defined schema, migrations | PASS | data-model.md defines schema |
| V. API Design Standards | REST, JSON, status codes, pagination | PASS | contracts/ defines endpoints |
| VI. Testing & Quality | Contract tests, integration tests, types | PASS | Test strategy defined |
| VII. Security & Configuration | No hardcoded secrets, validation | PASS | .env pattern, Pydantic validation |
| VIII. Phase Compliance | No premature features | PASS | Phase II scope only |

**Constitution Check Result**: ALL GATES PASSED

## Project Structure

### Documentation (this feature)

```text
specs/001-fullstack-web-todo/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Technology research
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Setup guide
├── contracts/           # Phase 1: API contracts
│   └── api.yaml         # OpenAPI 3.0 specification
├── checklists/          # Validation checklists
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2: Implementation tasks (via /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry
│   ├── config.py            # Environment configuration
│   ├── database.py          # Database connection setup
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py          # Task SQLModel
│   │   └── category.py      # Category SQLModel
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── task.py          # Pydantic request/response schemas
│   │   └── category.py      # Category schemas
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── tasks.py     # Task CRUD endpoints
│   │   │   └── categories.py # Category endpoints
│   │   └── deps.py          # Dependency injection
│   └── services/
│       ├── __init__.py
│       ├── task_service.py  # Task business logic
│       └── recurrence.py    # Recurring task logic
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # pytest fixtures
│   ├── contract/
│   │   └── test_api.py      # API contract tests
│   └── integration/
│       └── test_tasks.py    # Integration tests
├── alembic/
│   ├── env.py
│   └── versions/            # Database migrations
├── requirements.txt
├── pyproject.toml
└── .env.example

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page (task list)
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── TaskList.tsx     # Task list component
│   │   ├── TaskItem.tsx     # Individual task display
│   │   ├── TaskForm.tsx     # Create/edit task form
│   │   ├── FilterBar.tsx    # Search and filter controls
│   │   ├── SortDropdown.tsx # Sort selection
│   │   └── CategoryBadge.tsx # Category display
│   ├── services/
│   │   └── api.ts           # API client functions
│   ├── hooks/
│   │   ├── useTasks.ts      # Task data hook
│   │   └── useFilters.ts    # Filter state hook
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   └── utils/
│       └── dates.ts         # Date formatting utilities
├── tests/
│   └── components/          # Component tests
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local.example
```

**Structure Decision**: Web application structure with clear frontend/backend separation. Backend follows FastAPI best practices with layered architecture (routes → services → models). Frontend uses Next.js App Router with component-based organization.

## Architecture Decisions

### AD-1: API-First Design
- REST API with OpenAPI 3.0 specification
- Frontend consumes API via fetch/axios
- Enables future mobile clients (Phase III+)

### AD-2: SQLModel for ORM
- Combines SQLAlchemy + Pydantic
- Single model definition for DB and API
- Type safety throughout stack

### AD-3: Server Components + Client Components (Next.js)
- Server components for initial data fetch
- Client components for interactivity
- Optimistic updates for better UX

### AD-4: Soft Delete Pattern
- Tasks have `deleted_at` timestamp
- Filtering excludes soft-deleted by default
- Enables recovery within 30 days

### AD-5: UTC Storage with Local Display
- All timestamps stored as UTC
- Frontend converts to user's timezone
- Consistent across deployments

## Complexity Tracking

> No constitution violations requiring justification.

| Aspect | Complexity Level | Rationale |
|--------|-----------------|-----------|
| Database | Low | Single PostgreSQL, 3 tables max |
| API | Medium | 15+ endpoints with filtering/sorting |
| Frontend | Medium | Interactive components, state management |
| Auth | N/A | Deferred to Phase III |

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Neon DB cold starts | Medium | Connection pooling, keep-alive |
| Complex filter combinations | Medium | Database indexing, query optimization |
| Timezone handling edge cases | Low | Comprehensive date utility tests |
