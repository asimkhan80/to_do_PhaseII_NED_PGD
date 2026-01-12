from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine, select

from app.config import settings

# Create database engine with connection pooling
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    echo=settings.debug,
)


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Get database session for dependency injection."""
    with Session(engine) as session:
        yield session


def seed_default_categories():
    """Seed default categories (Work, Home, Personal) if not exist."""
    from app.models.category import Category

    default_categories = [
        {"name": "Work", "color": "#3B82F6", "is_default": True},
        {"name": "Home", "color": "#10B981", "is_default": True},
        {"name": "Personal", "color": "#8B5CF6", "is_default": True},
    ]

    with Session(engine) as session:
        for cat_data in default_categories:
            existing = session.exec(
                select(Category).where(Category.name == cat_data["name"])
            ).first()
            if not existing:
                category = Category(**cat_data)
                session.add(category)
        session.commit()
