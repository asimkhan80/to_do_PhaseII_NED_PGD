"""
Pytest configuration and shared fixtures for backend tests.
"""

import pytest
from collections.abc import Generator
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.database import get_session


# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite://"


@pytest.fixture(name="engine")
def engine_fixture():
    """Create a test database engine."""
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="session")
def session_fixture(engine) -> Generator[Session, None, None]:
    """Create a test database session."""
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session) -> Generator[TestClient, None, None]:
    """Create a test client with overridden database session."""

    def get_session_override():
        yield session

    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_task_data() -> dict:
    """Return sample task data for testing."""
    return {
        "title": "Test Task",
        "description": "A test task description",
        "priority": "medium",
        "recurrence_type": "none",
    }


@pytest.fixture
def sample_category_data() -> dict:
    """Return sample category data for testing."""
    return {
        "name": "Test Category",
        "color": "#FF5733",
    }


@pytest.fixture
def default_categories() -> list[dict]:
    """Return default categories as defined in spec."""
    return [
        {"name": "Work", "color": "#3B82F6", "is_default": True},
        {"name": "Home", "color": "#10B981", "is_default": True},
        {"name": "Personal", "color": "#8B5CF6", "is_default": True},
    ]
