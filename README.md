---
title: Todo App
emoji: ✅
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# Phase II Full-Stack Web Todo Application

A production-grade full-stack web todo application with organization, filtering, and usability enhancements.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Organization**: Assign priorities (High/Medium/Low) and categories
- **Search & Filter**: Find tasks by status, priority, category, due dates, and text search
- **Sorting**: Order tasks by title, priority, due date, or creation date
- **Due Dates**: Set due dates with optional times, with overdue indicators
- **Recurring Tasks**: Create daily, weekly, or monthly recurring tasks
- **Completion Tracking**: Mark tasks complete/incomplete with visual feedback

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, React Query
- **Backend**: FastAPI, Python, SQLModel, Pydantic
- **Database**: PostgreSQL (Neon)
- **Testing**: Pytest (backend), Jest (frontend)

## Quick Start

See [Quickstart Guide](specs/001-fullstack-web-todo/quickstart.md) for detailed setup instructions.

### Prerequisites

- Python 3.11+
- Node.js 18+
- Neon DB account (free tier available)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd to_do_phaseII

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Update .env with your Neon DATABASE_URL
alembic upgrade head

# Frontend setup
cd ../frontend
npm install
cp .env.local.example .env.local
```

### Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Project Structure

```
to_do_phaseII/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/routes/      # API endpoints
│   │   ├── models/          # SQLModel entities
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Business logic
│   ├── tests/               # Backend tests
│   └── alembic/             # Database migrations
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/             # Pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # API client
│   └── tests/               # Frontend tests
└── specs/                   # Documentation
```

## Testing

```bash
# Backend tests
cd backend
pytest

# With coverage
pytest --cov=app

# Frontend tests
cd frontend
npm test
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/v1/tasks | List tasks (with filters) |
| POST | /api/v1/tasks | Create task |
| GET | /api/v1/tasks/{id} | Get task |
| PATCH | /api/v1/tasks/{id} | Update task |
| DELETE | /api/v1/tasks/{id} | Delete task |
| POST | /api/v1/tasks/{id}/complete | Complete task |
| POST | /api/v1/tasks/{id}/uncomplete | Uncomplete task |
| GET | /api/v1/categories | List categories |
| POST | /api/v1/categories | Create category |
| PATCH | /api/v1/categories/{id} | Update category |
| DELETE | /api/v1/categories/{id} | Delete category |

## Documentation

- [Feature Specification](specs/001-fullstack-web-todo/spec.md)
- [Architecture Plan](specs/001-fullstack-web-todo/plan.md)
- [Data Model](specs/001-fullstack-web-todo/data-model.md)
- [Task List](specs/001-fullstack-web-todo/tasks.md)
- [Quickstart Guide](specs/001-fullstack-web-todo/quickstart.md)

## Hugging Face Spaces Deployment

This app is configured for deployment on Hugging Face Spaces using Docker SDK.

### Deploy to HF Spaces

1. Create a new Space on [Hugging Face](https://huggingface.co/spaces)
2. Select **Docker** as the SDK
3. Clone this repository to your Space:
   ```bash
   git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
   cd YOUR_SPACE_NAME
   # Copy all files from this repo
   git add .
   git commit -m "Initial deployment"
   git push
   ```

The app will automatically build and deploy. SQLite database is used for storage (note: data resets on Space restart).

## License

MIT
