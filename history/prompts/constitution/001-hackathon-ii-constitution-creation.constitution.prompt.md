---
id: 001
title: Hackathon II Constitution Creation
stage: constitution
date: 2026-01-11
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: Asim
command: /sp.constitution
labels: ["constitution", "phase-ii", "governance", "hackathon"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - history/prompts/constitution/001-hackathon-ii-constitution-creation.constitution.prompt.md
  - history/prompts/general/.gitkeep
  - history/adr/.gitkeep
  - specs/phase_ii/.gitkeep
tests:
  - N/A (constitution document, no tests applicable)
---

## Prompt

/sp.constitution

CONSTITUTION
Hackathon II
The Evolution of Todo – Mastering Spec-Driven Development & Cloud-Native AI
Phase II → Phase V Governance Constitution
1. PREAMBLE & CONTINUITY CLAUSE

This Constitution extends and supersedes Phase-I scope while preserving all Phase-I principles unless explicitly overridden.

Phase I established foundational discipline

Phase II onward introduces organization, usability, intelligence, and cloud-native evolution

Each phase is incremental, auditable, and spec-driven

No phase may violate the constraints or outputs of earlier phases

2. MANDATORY DEVELOPMENT PHILOSOPHY

All phases governed by this Constitution must strictly follow the:

Agentic Dev Stack

Required Workflow (Non-Negotiable)

Specification (Spec-Kit Plus)

Architecture & Plan

Task Decomposition

Agent-based Implementation

Review, Iteration, Versioned Specs

Manual coding without agent mediation is prohibited
All production code must be generated via Claude Code / Agents

3. PHASE STRUCTURE & OFFICIAL SCOPE
Hackathon Phases Overview (Authoritative)
Phase    Description    Tech Stack    Points    Due Date
Phase I    In-Memory CLI Todo    Python, Claude Code, Spec-Kit Plus    100    Dec 7, 2025
Phase II    Full-Stack Web Todo App    Next.js, FastAPI, SQLModel, Neon DB    150    Dec 14, 2025
Phase III    AI-Powered Todo Chatbot    OpenAI ChatKit, Agents SDK, MCP SDK    200    Dec 21, 2025
Phase IV    Local Kubernetes Deployment    Docker, Minikube, Helm, kubectl-ai    250    Jan 4, 2026
Phase V    Advanced Cloud Deployment    Kafka, Dapr, DigitalOcean DOKS    300    Jan 18, 2026

TOTAL CORE POINTS: 1,000

4. PHASE II CONSTITUTION
Intermediate Level – Organization & Usability
4.1 Phase II Objective

Transform the basic Todo application into a production-grade, full-stack web application with organization, filtering, and usability enhancements.

4.2 Mandatory Functional Requirements (Phase II)

The application must implement all Phase-I features PLUS:

A. Task Organization

Priorities: High / Medium / Low

Tags or Categories (e.g., Work, Home, Personal)

B. Search & Filtering

Search tasks by keyword

Filter by:

Status (Completed / Pending)

Priority

Category / Tag

Due date (if present)

C. Sorting

Alphabetical (A–Z)

Priority-based

Due-date-based

4.3 Phase II Technology Mandate
Layer    Requirement
Frontend    Next.js
Backend    FastAPI
ORM    SQLModel
Database    Neon DB (PostgreSQL)
API Style    REST (GraphQL optional, not required)
4.4 Phase II Engineering Standards

Clear frontend/backend separation

Stateless APIs

Database schema defined via specs

Clean REST endpoint contracts

Environment-based configuration

5. ADVANCED FUNCTIONAL CONSTITUTION
(Introduced in Phase II, Expanded in Phase III)
5.1 Recurring Tasks

Tasks may be:

Daily

Weekly

Monthly

System must auto-reschedule next occurrence

Recurrence rules must be stored and evaluated

5.2 Due Dates & Time Awareness

Tasks must support:

Due date

Optional time

Backend must enforce due-date validity

Frontend must provide date/time selection

6. PHASE III CONSTITUTION
AI-Powered Todo Chatbot
6.1 Objective

Introduce natural-language interaction with the Todo system using agentic AI.

6.2 Mandatory Capabilities

Chat-based task creation

Chat-based search & update

Context awareness (previous tasks, priorities)

Tool-calling via Agents SDK

6.3 Technology Mandate

OpenAI ChatKit

Agents SDK

Official MCP SDK

7. PHASE IV CONSTITUTION
Local Kubernetes Deployment
7.1 Objective

Package the system as a cloud-native, containerized application deployed locally.

7.2 Mandatory Requirements

Dockerized frontend & backend

Kubernetes manifests or Helm charts

Minikube deployment

Observability readiness (logs, health checks)

7.3 Tooling

Docker

Minikube

Helm

kubectl-ai

kagent

8. PHASE V CONSTITUTION
Advanced Cloud-Native Deployment
8.1 Objective

Deploy a scalable, event-driven Todo platform.

8.2 Mandatory Components

Kafka for event streaming

Dapr for service orchestration

DigitalOcean DOKS for managed Kubernetes

Scalable microservices architecture

9. BONUS CONSTITUTION (OPTIONAL BUT SCORABLE)
Bonus Feature    Points
Reusable Intelligence (Subagents, Agent Skills)    +200
Cloud-Native Blueprints via Agent Skills    +200
Urdu Language Support (Chatbot)    +100
Voice Commands    +200
Total Bonus    +600
10. SPEC-KIT PLUS GOVERNANCE

Each phase must include:

/specs
 ├── phase_ii/
 ├── phase_iii/
 ├── phase_iv/
 └── phase_v/


Specs must be versioned

No overwriting

Architecture diagrams encouraged (Phase II+)

11. COMPLIANCE & SCORING RULES

A phase is valid only if:

Its spec exists

Implementation matches spec

Required tech stack is used

Repo reflects phase boundaries

No premature phase features appear

12. FINAL DECLARATION

This Constitution governs Phase II through Phase V of:

Hackathon II – The Evolution of Todo

It is binding, auditable, and agent-enforceable.

## Response snapshot

Created the Hackathon II Constitution v1.0.0 with 8 core principles:

1. **Spec-Driven Development (Agent-First)** - All code via Claude Code/Agents
2. **Technology Stack Mandate** - Next.js, FastAPI, SQLModel, Neon DB
3. **Full-Stack Architecture** - Stateless APIs, environment config, REST contracts
4. **Data Persistence & Schema** - Spec-defined, version-controlled, SQLModel validated
5. **API Design Standards** - RESTful, consistent JSON, proper status codes
6. **Testing & Quality** - Contract tests, integration tests, type safety
7. **Security & Configuration** - No hardcoded secrets, input validation, OWASP compliance
8. **Phase Compliance** - Incremental, auditable, no premature features

Phase II functional requirements codified: task organization (priorities, tags), search/filtering, sorting, recurring tasks, and due dates.

## Outcome

- Impact: Established binding governance for Hackathon II Phases II-V
- Tests: N/A (governance document)
- Files: .specify/memory/constitution.md, history directory structure created
- Next prompts: `/sp.specify` to create Phase II feature specification
- Reflection: Constitution successfully captures all hackathon governance requirements with clear, enforceable principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual review PASS
- Prompt variant (if applicable): Standard /sp.constitution
- Next experiment (smallest change to try): Run /sp.specify to validate constitution integration
