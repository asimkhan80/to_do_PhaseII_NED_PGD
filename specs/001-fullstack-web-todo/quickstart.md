# Quickstart Guide: Phase II Full-Stack Web Todo Application

**Date**: 2026-01-11
**Branch**: `001-fullstack-web-todo`

## Prerequisites

Before starting, ensure you have installed:

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Neon DB Account** - [Sign up (free)](https://neon.tech/)

## Quick Setup (5 minutes)

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd to_do_phaseII
git checkout 001-fullstack-web-todo
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
```

### 3. Configure Neon Database

1. Log in to [Neon Console](https://console.neon.tech/)
2. Create a new project (or use existing)
3. Copy the connection string from Dashboard
4. Update `backend/.env`:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
CORS_ORIGINS=http://localhost:3000
DEBUG=true
```

### 4. Initialize Database

```bash
# Run migrations
alembic upgrade head

# Verify tables created
python -c "from app.database import engine; print('Database connected!')"
```

### 5. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd ../frontend

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local
```

Update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Verify Installation

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Project Structure

```
to_do_phaseII/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── config.py        # Settings management
│   │   ├── database.py      # DB connection
│   │   ├── models/          # SQLModel entities
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── api/routes/      # API endpoints
│   │   └── services/        # Business logic
│   ├── tests/               # Backend tests
│   ├── alembic/             # DB migrations
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   ├── hooks/           # Custom hooks
│   │   └── types/           # TypeScript types
│   ├── tests/               # Frontend tests
│   ├── package.json
│   └── .env.local.example
└── specs/                   # Documentation
```

---

## Common Tasks

### Run Backend Tests

```bash
cd backend
pytest
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

### Create New Migration

```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Reset Database

```bash
cd backend
alembic downgrade base
alembic upgrade head
```

### Build Frontend for Production

```bash
cd frontend
npm run build
npm start
```

---

## Environment Variables Reference

### Backend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string | `postgresql://...` |
| `CORS_ORIGINS` | Yes | Allowed frontend origins | `http://localhost:3000` |
| `DEBUG` | No | Enable debug mode | `true` |

### Frontend (.env.local)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL | `http://localhost:8000` |

---

## Troubleshooting

### Database Connection Failed

```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solution:**
1. Verify Neon DB is active (check console)
2. Check `DATABASE_URL` format includes `?sslmode=require`
3. Ensure no firewall blocking connection

### CORS Errors

```
Access-Control-Allow-Origin header missing
```

**Solution:**
1. Verify `CORS_ORIGINS` includes frontend URL
2. Restart backend server after .env changes

### Module Not Found (Python)

```
ModuleNotFoundError: No module named 'app'
```

**Solution:**
1. Ensure virtual environment is activated
2. Run from `backend/` directory
3. Reinstall: `pip install -r requirements.txt`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use
```

**Solution:**
```bash
# Find process using port (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Find process using port (macOS/Linux)
lsof -i :8000
kill -9 <PID>
```

---

## Next Steps

1. **Explore the API**: Visit http://localhost:8000/docs for interactive API documentation
2. **Create your first task**: Use the frontend UI or API directly
3. **Run tests**: Ensure everything works with `pytest` and `npm test`
4. **Read the spec**: Review `specs/001-fullstack-web-todo/spec.md` for feature details

---

## Support

- **Spec Documentation**: `specs/001-fullstack-web-todo/`
- **API Contract**: `specs/001-fullstack-web-todo/contracts/api.yaml`
- **Data Model**: `specs/001-fullstack-web-todo/data-model.md`
