# Tasks: Phase II Full-Stack Web Todo Application

**Input**: Design documents from `/specs/001-fullstack-web-todo/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/api.yaml
**Branch**: `001-fullstack-web-todo`
**Generated**: 2026-01-11

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

## User Story Mapping

| Story | Priority | Title | Description |
|-------|----------|-------|-------------|
| US1 | P1 | Create and Manage Tasks | CRUD operations for tasks |
| US2 | P1 | Priorities and Categories | Task organization features |
| US7 | P1 | Mark Tasks Complete | Task completion workflow |
| US3 | P2 | Search and Filter | Find and filter tasks |
| US4 | P2 | Sort Tasks | Order tasks by criteria |
| US5 | P2 | Due Dates and Times | Deadline management |
| US6 | P3 | Recurring Tasks | Auto-rescheduling tasks |

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize backend and frontend projects with dependencies

- [x] T001 Create backend directory structure per plan.md in backend/
- [x] T002 Create requirements.txt with FastAPI, SQLModel, uvicorn, alembic, python-dotenv, httpx in backend/requirements.txt
- [x] T003 Create pyproject.toml with project metadata and pytest config in backend/pyproject.toml
- [x] T004 [P] Create frontend directory with Next.js 14 using `npx create-next-app@latest` in frontend/
- [x] T005 [P] Create .env.example with DATABASE_URL, CORS_ORIGINS, DEBUG placeholders in backend/.env.example
- [x] T006 [P] Create .env.local.example with NEXT_PUBLIC_API_URL in frontend/.env.local.example
- [x] T007 [P] Create .gitignore for Python and Node.js artifacts in root .gitignore

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create FastAPI application entry point with CORS middleware in backend/app/main.py
- [x] T009 Create Pydantic Settings config class for environment variables in backend/app/config.py
- [x] T010 Create SQLModel database connection with engine and session in backend/app/database.py
- [x] T011 [P] Create __init__.py files for all backend packages in backend/app/
- [x] T012 [P] Create alembic.ini and alembic/env.py for migrations in backend/alembic/
- [x] T013 Create health check endpoint returning status and timestamp in backend/app/main.py
- [x] T014 [P] Create TypeScript type definitions for Task and Category in frontend/src/types/index.ts
- [x] T015 [P] Create API client base with fetch wrapper and error handling in frontend/src/services/api.ts
- [x] T016 [P] Create date formatting utilities with timezone handling in frontend/src/utils/dates.ts
- [x] T017 Create Next.js root layout with metadata and global styles in frontend/src/app/layout.tsx
- [x] T018 [P] Create global CSS with Tailwind base styles in frontend/src/app/globals.css
- [x] T019 [P] Create pytest conftest.py with database fixtures in backend/tests/conftest.py

**Checkpoint**: Foundation ready - backend server runs, frontend builds, database connects

---

## Phase 3: User Story 1 - Create and Manage Tasks (P1) MVP

**Goal**: Users can create, view, edit, and delete tasks

**Independent Test**: Create a task, view it in list, edit title, delete it

### Backend Implementation for US1

- [x] T020 [P] [US1] Create TaskStatus, Priority, RecurrenceType enums in backend/app/models/task.py
- [x] T021 [P] [US1] Create Category SQLModel with fields per data-model.md in backend/app/models/category.py
- [x] T022 [US1] Create Task SQLModel with all fields and Category relationship in backend/app/models/task.py
- [x] T023 [US1] Create models __init__.py exporting Task, Category in backend/app/models/__init__.py
- [x] T024 [US1] Create initial Alembic migration for categories and tasks tables in backend/alembic/versions/
- [x] T025 [US1] Create seed script for default categories (Work, Home, Personal) in backend/app/database.py
- [x] T026 [P] [US1] Create TaskCreate, TaskUpdate, TaskResponse Pydantic schemas in backend/app/schemas/task.py
- [x] T027 [P] [US1] Create CategoryCreate, CategoryResponse Pydantic schemas in backend/app/schemas/category.py
- [x] T028 [US1] Create TaskService with create, get_all, get_by_id, update, delete methods in backend/app/services/task_service.py
- [x] T029 [US1] Create database session dependency in backend/app/api/deps.py
- [x] T030 [US1] Create tasks router with POST /tasks, GET /tasks, GET /tasks/{id}, PUT /tasks/{id}, DELETE /tasks/{id} in backend/app/api/routes/tasks.py
- [x] T031 [US1] Create categories router with GET /categories, POST /categories in backend/app/api/routes/categories.py
- [x] T032 [US1] Register task and category routers in main.py with /api/v1 prefix in backend/app/main.py

### Frontend Implementation for US1

- [x] T033 [P] [US1] Create API functions: fetchTasks, createTask, updateTask, deleteTask in frontend/src/services/api.ts
- [x] T034 [P] [US1] Create useTasks hook with React Query for task data management in frontend/src/hooks/useTasks.ts
- [x] T035 [US1] Create TaskItem component displaying task title, status, actions in frontend/src/components/TaskItem.tsx
- [x] T036 [US1] Create TaskList component rendering array of TaskItem in frontend/src/components/TaskList.tsx
- [x] T037 [US1] Create TaskForm component with title input, description textarea, submit button in frontend/src/components/TaskForm.tsx
- [x] T038 [US1] Create home page integrating TaskList and TaskForm in frontend/src/app/page.tsx
- [x] T039 [US1] Add delete confirmation dialog to TaskItem in frontend/src/components/TaskItem.tsx
- [x] T040 [US1] Add edit mode to TaskItem with inline editing in frontend/src/components/TaskItem.tsx

**Checkpoint**: US1 complete - Full task CRUD working end-to-end

---

## Phase 4: User Story 2 - Priorities and Categories (P1)

**Goal**: Users can assign priorities and categories to organize tasks

**Independent Test**: Create task with High priority and Work category, verify visual indicators

### Backend Implementation for US2

- [x] T041 [US2] Add priority and category_id to TaskCreate schema in backend/app/schemas/task.py
- [x] T042 [US2] Update TaskService.create to accept priority and category_id in backend/app/services/task_service.py
- [x] T043 [US2] Add category CRUD endpoints: GET /categories/{id}, PUT /categories/{id}, DELETE /categories/{id} in backend/app/api/routes/categories.py
- [x] T044 [US2] Add validation preventing deletion of default categories in backend/app/api/routes/categories.py

### Frontend Implementation for US2

- [x] T045 [P] [US2] Create CategoryBadge component with color-coded display in frontend/src/components/CategoryBadge.tsx
- [x] T046 [P] [US2] Create PriorityIndicator component with High/Medium/Low visual styles in frontend/src/components/PriorityIndicator.tsx
- [x] T047 [US2] Add priority dropdown to TaskForm with High/Medium/Low options in frontend/src/components/TaskForm.tsx
- [x] T048 [US2] Add category dropdown to TaskForm fetching from API in frontend/src/components/TaskForm.tsx
- [x] T049 [US2] Update TaskItem to display PriorityIndicator and CategoryBadge in frontend/src/components/TaskItem.tsx
- [x] T050 [US2] Create useCategories hook for category data management in frontend/src/hooks/useCategories.ts
- [x] T051 [US2] Add "Create Category" inline form in category dropdown in frontend/src/components/TaskForm.tsx

**Checkpoint**: US2 complete - Tasks display with priority colors and category badges

---

## Phase 5: User Story 7 - Mark Tasks Complete (P1)

**Goal**: Users can mark tasks complete/incomplete with visual feedback

**Independent Test**: Click checkbox to complete task, see strikethrough, click again to uncomplete

### Backend Implementation for US7

- [x] T052 [US7] Create POST /tasks/{id}/complete endpoint setting status and completed_at in backend/app/api/routes/tasks.py
- [x] T053 [US7] Create POST /tasks/{id}/uncomplete endpoint clearing status and completed_at in backend/app/api/routes/tasks.py
- [x] T054 [US7] Add complete/uncomplete methods to TaskService in backend/app/services/task_service.py

### Frontend Implementation for US7

- [x] T055 [P] [US7] Add completeTask, uncompleteTask API functions in frontend/src/services/api.ts
- [x] T056 [US7] Add checkbox/toggle to TaskItem for completion status in frontend/src/components/TaskItem.tsx
- [x] T057 [US7] Add completed task styling (strikethrough, muted colors) in frontend/src/components/TaskItem.tsx
- [x] T058 [US7] Add optimistic update for completion toggle in useTasks hook in frontend/src/hooks/useTasks.ts

**Checkpoint**: US7 complete - MVP fully functional (US1 + US2 + US7)

---

## Phase 6: User Story 3 - Search and Filter Tasks (P2)

**Goal**: Users can search and filter tasks by multiple criteria

**Independent Test**: Create tasks with different attributes, use search/filters to find specific tasks

### Backend Implementation for US3

- [x] T059 [US3] Add query parameters to GET /tasks: status, priority, category_id, search, due_before, due_after in backend/app/api/routes/tasks.py
- [x] T060 [US3] Update TaskService.get_all with filtering logic per data-model.md query patterns in backend/app/services/task_service.py
- [x] T061 [US3] Add ILIKE search on title and description fields in backend/app/services/task_service.py
- [x] T062 [US3] Add pagination parameters (page, limit) to GET /tasks in backend/app/api/routes/tasks.py

### Frontend Implementation for US3

- [x] T063 [P] [US3] Create useFilters hook managing filter state in URL params in frontend/src/hooks/useFilters.ts
- [x] T064 [US3] Create FilterBar component with search input in frontend/src/components/FilterBar.tsx
- [x] T065 [US3] Add status filter dropdown (All/Pending/Completed) to FilterBar in frontend/src/components/FilterBar.tsx
- [x] T066 [US3] Add priority filter dropdown to FilterBar in frontend/src/components/FilterBar.tsx
- [x] T067 [US3] Add category filter dropdown to FilterBar in frontend/src/components/FilterBar.tsx
- [x] T068 [US3] Add date range filter inputs to FilterBar in frontend/src/components/FilterBar.tsx
- [x] T069 [US3] Add "Clear Filters" button to FilterBar in frontend/src/components/FilterBar.tsx
- [x] T070 [US3] Integrate FilterBar with useTasks hook to pass filter params in frontend/src/app/page.tsx
- [x] T071 [US3] Add "No tasks found" empty state with clear search option in frontend/src/components/TaskList.tsx

**Checkpoint**: US3 complete - Search and all filters working

---

## Phase 7: User Story 4 - Sort Tasks (P2)

**Goal**: Users can sort tasks by title, priority, or due date

**Independent Test**: Create tasks with different values, verify sort order changes correctly

### Backend Implementation for US4

- [x] T072 [US4] Add sort_by and sort_order query parameters to GET /tasks in backend/app/api/routes/tasks.py
- [x] T073 [US4] Implement sorting logic in TaskService.get_all (title, priority, due_date, created_at) in backend/app/services/task_service.py

### Frontend Implementation for US4

- [x] T074 [P] [US4] Create SortDropdown component with sort options in frontend/src/components/SortDropdown.tsx
- [x] T075 [US4] Add sort state to useFilters hook in frontend/src/hooks/useFilters.ts
- [x] T076 [US4] Integrate SortDropdown with useTasks to pass sort params in frontend/src/app/page.tsx
- [x] T077 [US4] Add ascending/descending toggle to SortDropdown in frontend/src/components/SortDropdown.tsx

**Checkpoint**: US4 complete - All sort options working

---

## Phase 8: User Story 5 - Due Dates and Times (P2)

**Goal**: Users can set due dates with optional times and see overdue indicators

**Independent Test**: Create task with due date, verify display; create overdue task, verify visual indicator

### Backend Implementation for US5

- [x] T078 [US5] Ensure due_date and due_time in TaskCreate/TaskUpdate schemas in backend/app/schemas/task.py
- [x] T079 [US5] Add validation: due_date must not be in past for new tasks in backend/app/services/task_service.py
- [x] T080 [US5] Add validation: due_time only valid if due_date is set in backend/app/services/task_service.py

### Frontend Implementation for US5

- [x] T081 [P] [US5] Create DateTimePicker component with date input and optional time in frontend/src/components/DateTimePicker.tsx
- [x] T082 [US5] Add DateTimePicker to TaskForm for due date selection in frontend/src/components/TaskForm.tsx
- [x] T083 [US5] Add due date display to TaskItem with formatted date/time in frontend/src/components/TaskItem.tsx
- [x] T084 [US5] Add overdue styling (red indicator) when due_date < today in frontend/src/components/TaskItem.tsx
- [x] T085 [US5] Add "Due Today" highlight styling when due_date === today in frontend/src/components/TaskItem.tsx
- [x] T086 [US5] Add past date validation error message in TaskForm in frontend/src/components/TaskForm.tsx

**Checkpoint**: US5 complete - Due dates with visual indicators working

---

## Phase 9: User Story 6 - Recurring Tasks (P3)

**Goal**: Users can create recurring tasks that auto-reschedule on completion

**Independent Test**: Create daily recurring task, complete it, verify new task created for next day

### Backend Implementation for US6

- [x] T087 [US6] Create recurrence service with create_next_occurrence function in backend/app/services/recurrence.py
- [x] T088 [US6] Update complete endpoint to call recurrence service and return next_task in backend/app/api/routes/tasks.py
- [x] T089 [US6] Add recurrence_type to TaskCreate schema in backend/app/schemas/task.py

### Frontend Implementation for US6

- [x] T090 [P] [US6] Create RecurrenceSelector component with None/Daily/Weekly/Monthly options in frontend/src/components/RecurrenceSelector.tsx
- [x] T091 [US6] Add RecurrenceSelector to TaskForm in frontend/src/components/TaskForm.tsx
- [x] T092 [US6] Add recurrence indicator icon to TaskItem for recurring tasks in frontend/src/components/TaskItem.tsx
- [x] T093 [US6] Update completion handler to show "New task created" toast when recurring in frontend/src/hooks/useTasks.ts
- [x] T094 [US6] Add delete confirmation asking "Delete this instance or all?" for recurring tasks in frontend/src/components/TaskItem.tsx

**Checkpoint**: US6 complete - All user stories implemented

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements affecting multiple user stories

- [x] T095 [P] Add loading spinners to TaskList and TaskForm in frontend/src/components/
- [x] T096 [P] Add error boundary component for graceful error handling in frontend/src/components/ErrorBoundary.tsx
- [x] T097 Add toast notifications for success/error feedback in frontend/src/app/layout.tsx
- [x] T098 [P] Add responsive styles for mobile viewport in frontend/src/app/globals.css
- [x] T099 [P] Create contract tests for all API endpoints in backend/tests/contract/test_api.py
- [x] T100 [P] Create integration test for task lifecycle (create→edit→complete→delete) in backend/tests/integration/test_tasks.py
- [x] T101 Add API documentation with FastAPI OpenAPI at /docs in backend/app/main.py
- [x] T102 Create README.md with setup instructions referencing quickstart.md in root README.md
- [x] T103 Run full application test: create task, organize, filter, sort, complete, verify all features

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──► Phase 2 (Foundational) ──┬──► Phase 3 (US1: CRUD)
                                              │
                                              └──► Phase 4 (US2: Organize) ──► Phase 5 (US7: Complete)
                                                                                       │
                              ┌────────────────────────────────────────────────────────┘
                              │
                              ▼
                     Phase 6 (US3: Filter) ──► Phase 7 (US4: Sort) ──► Phase 8 (US5: Due Dates)
                                                                                │
                                                                                ▼
                                                                       Phase 9 (US6: Recurring)
                                                                                │
                                                                                ▼
                                                                       Phase 10 (Polish)
```

### User Story Dependencies

- **US1 (CRUD)**: No dependencies - foundational story
- **US2 (Organize)**: Depends on US1 (needs task entity)
- **US7 (Complete)**: Depends on US1 (needs task entity)
- **US3 (Filter)**: Depends on US1, US2 (needs tasks with attributes)
- **US4 (Sort)**: Depends on US1 (can run parallel to US3)
- **US5 (Due Dates)**: Depends on US1 (can run parallel to US3/US4)
- **US6 (Recurring)**: Depends on US5, US7 (needs due dates and completion)

### Parallel Opportunities by Phase

**Phase 2 (Foundational)**:
```
T011, T012, T014, T015, T016, T018, T019 can run in parallel
```

**Phase 3 (US1)**:
```
Backend: T020, T021 parallel → T022 → T023 → T024 → T025
         T026, T027 parallel → T028 → T029 → T030, T031 → T032
Frontend: T033, T034 parallel → T035 → T036 → T037 → T038 → T039 → T040
```

**Phase 4-9 follow similar patterns with [P] markers**

---

## Implementation Strategy

### MVP First (Phases 1-5)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (CRUD)
4. Complete Phase 4: User Story 2 (Organize)
5. Complete Phase 5: User Story 7 (Complete)
6. **STOP and VALIDATE**: Test MVP independently
7. Deploy/demo if ready

**MVP Delivers**: Core todo functionality with priorities, categories, and completion

### Incremental Delivery

| Increment | User Stories | Cumulative Value |
|-----------|--------------|------------------|
| MVP | US1 + US2 + US7 | Basic organized todo app |
| +Search | US3 | Find tasks easily |
| +Sort | US4 | View tasks in preferred order |
| +Due Dates | US5 | Deadline management |
| +Recurring | US6 | Automated task scheduling |

---

## Task Summary

| Phase | Tasks | Parallel | Description |
|-------|-------|----------|-------------|
| 1 | 7 | 4 | Setup |
| 2 | 12 | 8 | Foundational |
| 3 | 21 | 5 | US1: CRUD |
| 4 | 11 | 2 | US2: Organize |
| 5 | 7 | 1 | US7: Complete |
| 6 | 13 | 1 | US3: Filter |
| 7 | 6 | 1 | US4: Sort |
| 8 | 9 | 1 | US5: Due Dates |
| 9 | 8 | 1 | US6: Recurring |
| 10 | 9 | 5 | Polish |
| **Total** | **103** | **29** | |

---

## Notes

- All tasks include exact file paths for LLM execution
- [P] tasks can run in parallel within their phase
- [Story] labels enable filtering by user story
- Each user story checkpoint validates independent functionality
- Constitution compliance: contract tests (T099), integration tests (T100)
- Commit after each task or logical group
