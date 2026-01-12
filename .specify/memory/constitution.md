<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version change: 0.0.0 → 1.0.0 (MAJOR: Initial constitution ratification)

Added Principles:
  - I. Spec-Driven Development (Agent-First)
  - II. Technology Stack Mandate
  - III. Full-Stack Architecture
  - IV. Data Persistence & Schema
  - V. API Design Standards
  - VI. Testing & Quality
  - VII. Security & Configuration
  - VIII. Phase Compliance

Added Sections:
  - Phase II Functional Requirements
  - Technology Mandate
  - Governance

Templates requiring updates:
  - ✅ plan-template.md (aligned with constitution check gates)
  - ✅ spec-template.md (aligned with functional requirements)
  - ✅ tasks-template.md (aligned with phase structure)

Follow-up TODOs: None
================================================================================
-->

# Hackathon II - Todo Evolution Constitution

## Project Overview

**Project Name**: Hackathon II - The Evolution of Todo
**Current Phase**: Phase II - Full-Stack Web Todo App
**Governance Scope**: Phase II through Phase V

This Constitution extends Phase I principles while introducing organization, usability, intelligence, and cloud-native evolution across subsequent phases.

## Core Principles

### I. Spec-Driven Development (Agent-First)

All production code MUST be generated via Claude Code / Agents following the Agentic Dev Stack workflow:

1. **Specification** (Spec-Kit Plus) - Requirements defined first
2. **Architecture & Plan** - Technical design documented
3. **Task Decomposition** - Work broken into testable units
4. **Agent-based Implementation** - Code generated via agents
5. **Review & Iteration** - Versioned specs maintained

Manual coding without agent mediation is PROHIBITED. All changes MUST flow through the spec-driven pipeline.

### II. Technology Stack Mandate (Phase II)

The following technology stack is NON-NEGOTIABLE for Phase II:

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | Next.js | React-based SSR/SSG framework |
| Backend | FastAPI | Modern async Python API framework |
| ORM | SQLModel | Type-safe SQL with Pydantic integration |
| Database | Neon DB (PostgreSQL) | Serverless PostgreSQL |
| API Style | REST | Standard HTTP methods, JSON payloads |

Deviations from this stack require explicit constitution amendment.

### III. Full-Stack Architecture

The application MUST implement clear separation between frontend and backend:

- **Stateless APIs**: Backend endpoints MUST NOT maintain session state
- **Environment-based Configuration**: All secrets and environment-specific values MUST use environment variables
- **Clean REST Contracts**: API endpoints MUST follow RESTful conventions with documented request/response schemas

### IV. Data Persistence & Schema

Database schema MUST be:

- Defined via specs before implementation
- Version-controlled through migrations
- Validated against SQLModel type definitions

All entities MUST support:
- Unique identifiers
- Created/updated timestamps
- Soft delete capability where appropriate

### V. API Design Standards

All REST endpoints MUST:

- Use appropriate HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Return consistent JSON response structures
- Include proper HTTP status codes
- Provide meaningful error messages
- Support pagination for list endpoints
- Include request validation

### VI. Testing & Quality

While full TDD is encouraged, the following MUST be maintained:

- Contract tests for all API endpoints
- Integration tests for critical user journeys
- Manual testing validation before phase completion

Code quality standards:
- Type hints required for Python code
- TypeScript strict mode for frontend code
- Linting and formatting enforced

### VII. Security & Configuration

Security requirements:

- No hardcoded secrets or tokens
- Environment variables via `.env` files
- Input validation on all user-provided data
- SQL injection prevention through ORM usage
- XSS prevention in frontend

### VIII. Phase Compliance

Each phase is incremental, auditable, and spec-driven:

- No phase may violate constraints of earlier phases
- Phase features MUST NOT appear prematurely
- Phase completion requires spec existence and implementation match

## Phase II Functional Requirements

### A. Task Organization (MANDATORY)

- **Priorities**: High / Medium / Low
- **Tags/Categories**: Work, Home, Personal (at minimum)

### B. Search & Filtering (MANDATORY)

- Search tasks by keyword
- Filter by Status (Completed / Pending)
- Filter by Priority
- Filter by Category/Tag
- Filter by Due date (if present)

### C. Sorting (MANDATORY)

- Alphabetical (A-Z)
- Priority-based
- Due-date-based

### D. Advanced Features (Phase II+)

**Recurring Tasks**:
- Daily, Weekly, Monthly recurrence options
- Auto-reschedule next occurrence
- Recurrence rules stored and evaluated

**Due Dates & Time Awareness**:
- Due date support on all tasks
- Optional time component
- Backend enforcement of due-date validity
- Frontend date/time selection UI

## Phase Overview (Authoritative Reference)

| Phase | Description | Tech Stack | Points | Status |
|-------|-------------|------------|--------|--------|
| I | In-Memory CLI Todo | Python, Claude Code | 100 | Complete |
| II | Full-Stack Web Todo App | Next.js, FastAPI, SQLModel, Neon DB | 150 | **Active** |
| III | AI-Powered Todo Chatbot | OpenAI ChatKit, Agents SDK, MCP SDK | 200 | Upcoming |
| IV | Local Kubernetes Deployment | Docker, Minikube, Helm, kubectl-ai | 250 | Upcoming |
| V | Advanced Cloud Deployment | Kafka, Dapr, DigitalOcean DOKS | 300 | Upcoming |

**Total Core Points**: 1,000

## Bonus Features (Optional)

| Bonus Feature | Points |
|---------------|--------|
| Reusable Intelligence (Subagents, Agent Skills) | +200 |
| Cloud-Native Blueprints via Agent Skills | +200 |
| Urdu Language Support (Chatbot) | +100 |
| Voice Commands | +200 |
| **Total Bonus** | +600 |

## Governance

### Amendment Procedure

1. Amendments MUST be documented with rationale
2. Version number MUST be incremented per semantic versioning:
   - MAJOR: Backward incompatible changes
   - MINOR: New additions or expansions
   - PATCH: Clarifications and fixes
3. Migration plan required for breaking changes

### Compliance Review

- All PRs MUST verify constitution compliance
- Phase boundaries MUST be respected
- Complexity additions MUST be justified

### Spec-Kit Plus Integration

All specs MUST be organized under:

```
/specs
├── phase_ii/
├── phase_iii/
├── phase_iv/
└── phase_v/
```

Specs MUST be versioned and never overwritten.

**Version**: 1.0.0 | **Ratified**: 2026-01-11 | **Last Amended**: 2026-01-11
