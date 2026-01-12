"""
Contract tests for all API endpoints.
Verify request/response schemas match API specification.
"""

import pytest
from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """Contract tests for health check endpoint."""

    def test_health_check_returns_status_and_timestamp(self, client: TestClient):
        """GET /health returns expected schema."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "timestamp" in data
        assert data["status"] == "healthy"


class TestTasksEndpoints:
    """Contract tests for tasks API endpoints."""

    def test_create_task_accepts_valid_payload(
        self, client: TestClient, sample_task_data: dict
    ):
        """POST /api/v1/tasks accepts valid task data."""
        response = client.post("/api/v1/tasks", json=sample_task_data)
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert "title" in data
        assert "status" in data
        assert "priority" in data
        assert "created_at" in data
        assert data["title"] == sample_task_data["title"]

    def test_create_task_rejects_missing_title(self, client: TestClient):
        """POST /api/v1/tasks rejects payload without title."""
        response = client.post("/api/v1/tasks", json={"description": "No title"})
        assert response.status_code == 422

    def test_get_tasks_returns_list(self, client: TestClient):
        """GET /api/v1/tasks returns list of tasks."""
        response = client.get("/api/v1/tasks")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_get_tasks_accepts_filter_params(self, client: TestClient):
        """GET /api/v1/tasks accepts query parameters."""
        response = client.get(
            "/api/v1/tasks",
            params={
                "status": "pending",
                "priority": "high",
                "search": "test",
                "sort_by": "created_at",
                "sort_order": "desc",
                "page": 1,
                "limit": 10,
            },
        )
        assert response.status_code == 200

    def test_get_task_by_id_returns_task_schema(
        self, client: TestClient, sample_task_data: dict
    ):
        """GET /api/v1/tasks/{id} returns single task."""
        # Create task first
        create_response = client.post("/api/v1/tasks", json=sample_task_data)
        task_id = create_response.json()["id"]

        response = client.get(f"/api/v1/tasks/{task_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == task_id

    def test_get_task_by_id_returns_404_for_missing(self, client: TestClient):
        """GET /api/v1/tasks/{id} returns 404 for non-existent task."""
        response = client.get("/api/v1/tasks/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404

    def test_update_task_accepts_partial_update(
        self, client: TestClient, sample_task_data: dict
    ):
        """PATCH /api/v1/tasks/{id} accepts partial updates."""
        # Create task
        create_response = client.post("/api/v1/tasks", json=sample_task_data)
        task_id = create_response.json()["id"]

        # Update only title
        response = client.patch(
            f"/api/v1/tasks/{task_id}", json={"title": "Updated Title"}
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Updated Title"

    def test_delete_task_returns_204(
        self, client: TestClient, sample_task_data: dict
    ):
        """DELETE /api/v1/tasks/{id} returns 204 on success."""
        # Create task
        create_response = client.post("/api/v1/tasks", json=sample_task_data)
        task_id = create_response.json()["id"]

        response = client.delete(f"/api/v1/tasks/{task_id}")
        assert response.status_code == 204

    def test_complete_task_returns_complete_response(
        self, client: TestClient, sample_task_data: dict
    ):
        """POST /api/v1/tasks/{id}/complete returns TaskCompleteResponse."""
        # Create task
        create_response = client.post("/api/v1/tasks", json=sample_task_data)
        task_id = create_response.json()["id"]

        response = client.post(f"/api/v1/tasks/{task_id}/complete")
        assert response.status_code == 200
        data = response.json()
        assert "task" in data
        assert "next_task" in data
        assert data["task"]["status"] == "completed"

    def test_uncomplete_task_returns_task(
        self, client: TestClient, sample_task_data: dict
    ):
        """POST /api/v1/tasks/{id}/uncomplete returns pending task."""
        # Create and complete task
        create_response = client.post("/api/v1/tasks", json=sample_task_data)
        task_id = create_response.json()["id"]
        client.post(f"/api/v1/tasks/{task_id}/complete")

        response = client.post(f"/api/v1/tasks/{task_id}/uncomplete")
        assert response.status_code == 200
        assert response.json()["status"] == "pending"


class TestCategoriesEndpoints:
    """Contract tests for categories API endpoints."""

    def test_create_category_accepts_valid_payload(
        self, client: TestClient, sample_category_data: dict
    ):
        """POST /api/v1/categories accepts valid category data."""
        response = client.post("/api/v1/categories", json=sample_category_data)
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert "name" in data
        assert data["name"] == sample_category_data["name"]

    def test_get_categories_returns_list(self, client: TestClient):
        """GET /api/v1/categories returns list."""
        response = client.get("/api/v1/categories")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_category_by_id_returns_category(
        self, client: TestClient, sample_category_data: dict
    ):
        """GET /api/v1/categories/{id} returns single category."""
        create_response = client.post("/api/v1/categories", json=sample_category_data)
        category_id = create_response.json()["id"]

        response = client.get(f"/api/v1/categories/{category_id}")
        assert response.status_code == 200
        assert response.json()["id"] == category_id

    def test_update_category_returns_updated(
        self, client: TestClient, sample_category_data: dict
    ):
        """PATCH /api/v1/categories/{id} returns updated category."""
        create_response = client.post("/api/v1/categories", json=sample_category_data)
        category_id = create_response.json()["id"]

        response = client.patch(
            f"/api/v1/categories/{category_id}", json={"color": "#000000"}
        )
        assert response.status_code == 200
        assert response.json()["color"] == "#000000"

    def test_delete_category_returns_204(
        self, client: TestClient, sample_category_data: dict
    ):
        """DELETE /api/v1/categories/{id} returns 204."""
        create_response = client.post("/api/v1/categories", json=sample_category_data)
        category_id = create_response.json()["id"]

        response = client.delete(f"/api/v1/categories/{category_id}")
        assert response.status_code == 204
