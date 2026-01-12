"""
Category service with CRUD operations.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlmodel import Session, select

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    """Service for category CRUD operations."""

    def __init__(self, session: Session):
        self.session = session

    def create(self, category_data: CategoryCreate) -> Category:
        """Create a new category."""
        category = Category(
            name=category_data.name,
            color=category_data.color,
            is_default=False,
        )
        self.session.add(category)
        self.session.commit()
        self.session.refresh(category)
        return category

    def get_all(self, include_deleted: bool = False) -> list[Category]:
        """Get all categories, optionally including soft-deleted."""
        query = select(Category)
        if not include_deleted:
            query = query.where(Category.deleted_at == None)  # noqa: E711
        query = query.order_by(Category.name)
        return list(self.session.exec(query).all())

    def get_by_id(self, category_id: UUID) -> Optional[Category]:
        """Get a single category by ID."""
        query = select(Category).where(
            Category.id == category_id,
            Category.deleted_at == None,  # noqa: E711
        )
        return self.session.exec(query).first()

    def get_by_name(self, name: str) -> Optional[Category]:
        """Get a category by name (case-insensitive)."""
        query = select(Category).where(
            Category.name.ilike(name),
            Category.deleted_at == None,  # noqa: E711
        )
        return self.session.exec(query).first()

    def update(
        self, category_id: UUID, category_data: CategoryUpdate
    ) -> Optional[Category]:
        """Update a category."""
        category = self.get_by_id(category_id)
        if not category:
            return None

        # Prevent modifying default categories' names
        if category.is_default and category_data.name:
            raise ValueError("Cannot rename default categories")

        update_data = category_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(category, key, value)

        category.updated_at = datetime.utcnow()
        self.session.add(category)
        self.session.commit()
        self.session.refresh(category)
        return category

    def delete(self, category_id: UUID) -> bool:
        """Soft delete a category (default categories cannot be deleted)."""
        category = self.get_by_id(category_id)
        if not category:
            return False

        if category.is_default:
            raise ValueError("Cannot delete default categories")

        category.deleted_at = datetime.utcnow()
        category.updated_at = datetime.utcnow()
        self.session.add(category)
        self.session.commit()
        return True
