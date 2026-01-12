"""
Category API routes.
"""

from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CategoryServiceDep
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_data: CategoryCreate, category_service: CategoryServiceDep
) -> CategoryResponse:
    """Create a new category."""
    # Check for duplicate name
    existing = category_service.get_by_name(category_data.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists",
        )
    category = category_service.create(category_data)
    return category


@router.get("", response_model=list[CategoryResponse])
def get_categories(category_service: CategoryServiceDep) -> list[CategoryResponse]:
    """Get all categories."""
    return category_service.get_all()


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: UUID, category_service: CategoryServiceDep
) -> CategoryResponse:
    """Get a single category by ID."""
    category = category_service.get_by_id(category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return category


@router.patch("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: UUID,
    category_data: CategoryUpdate,
    category_service: CategoryServiceDep,
) -> CategoryResponse:
    """Update a category."""
    try:
        category = category_service.update(category_id, category_data)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        return category
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: UUID, category_service: CategoryServiceDep
) -> None:
    """Soft delete a category."""
    try:
        deleted = category_service.delete(category_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
