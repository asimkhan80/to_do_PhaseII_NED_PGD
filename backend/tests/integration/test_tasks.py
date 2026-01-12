"""
Integration tests for task lifecycle.
Tests end-to-end workflows: create -> edit -> complete -> delete.
"""

import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient


class TestTaskLifecycle:
    """Integration tests for complete task lifecycle."""

    def test_full_task_lifecycle(self, client: TestClient):
        """Test create -> read -> update -> complete -> delete workflow."""
        # 1. Create a task
        create_data = {
            "title": "Integration Test Task",
            "description": "Testing the full lifecycle",
            "priority": "high",
        }
        create_response = client.post("/api/v1/tasks", json=create_data)
        assert create_response.status_code == 201
        task = create_response.json()
        task_id = task["id"]
        assert task["title"] == "Integration Test Task"
        assert task["status"] == "pending"

        # 2. Read the task
        get_response = client.get(f"/api/v1/tasks/{task_id}")
        assert get_response.status_code == 200
        assert get_response.json()["id"] == task_id

        # 3. Update the task
        update_response = client.patch(
            f"/api/v1/tasks/{task_id}",
            json={"title": "Updated Task", "priority": "low"},
        )
        assert update_response.status_code == 200
        updated_task = update_response.json()
        assert updated_task["title"] == "Updated Task"
        assert updated_task["priority"] == "low"

        # 4. Complete the task
        complete_response = client.post(f"/api/v1/tasks/{task_id}/complete")
        assert complete_response.status_code == 200
        completed = complete_response.json()
        assert completed["task"]["status"] == "completed"
        assert completed["task"]["completed_at"] is not None

        # 5. Uncomplete the task
        uncomplete_response = client.post(f"/api/v1/tasks/{task_id}/uncomplete")
        assert uncomplete_response.status_code == 200
        assert uncomplete_response.json()["status"] == "pending"

        # 6. Delete the task
        delete_response = client.delete(f"/api/v1/tasks/{task_id}")
        assert delete_response.status_code == 204

        # 7. Verify task is not accessible
        get_deleted = client.get(f"/api/v1/tasks/{task_id}")
        assert get_deleted.status_code == 404


class TestTaskWithCategory:
    """Integration tests for tasks with categories."""

    def test_task_with_category_workflow(self, client: TestClient):
        """Test creating and managing tasks with categories."""
        # 1. Create a category
        category_response = client.post(
            "/api/v1/categories", json={"name": "Work Tasks", "color": "#3B82F6"}
        )
        assert category_response.status_code == 201
        category = category_response.json()
        category_id = category["id"]

        # 2. Create task with category
        task_response = client.post(
            "/api/v1/tasks",
            json={
                "title": "Categorized Task",
                "priority": "medium",
                "category_id": category_id,
            },
        )
        assert task_response.status_code == 201
        task = task_response.json()
        assert task["category_id"] == category_id
        assert task["category"]["name"] == "Work Tasks"

        # 3. Filter tasks by category
        filter_response = client.get(
            "/api/v1/tasks", params={"category_id": category_id}
        )
        assert filter_response.status_code == 200
        filtered_tasks = filter_response.json()
        assert len(filtered_tasks) == 1
        assert filtered_tasks[0]["id"] == task["id"]


class TestRecurringTasks:
    """Integration tests for recurring task functionality."""

    def test_recurring_task_creates_next_occurrence(self, client: TestClient):
        """Completing a recurring task creates the next occurrence."""
        tomorrow = (date.today() + timedelta(days=1)).isoformat()

        # Create daily recurring task
        create_response = client.post(
            "/api/v1/tasks",
            json={
                "title": "Daily Standup",
                "priority": "high",
                "due_date": tomorrow,
                "recurrence_type": "daily",
            },
        )
        assert create_response.status_code == 201
        task = create_response.json()
        task_id = task["id"]
        assert task["recurrence_type"] == "daily"

        # Complete the task
        complete_response = client.post(f"/api/v1/tasks/{task_id}/complete")
        assert complete_response.status_code == 200
        result = complete_response.json()

        # Verify next task was created
        assert result["next_task"] is not None
        next_task = result["next_task"]
        assert next_task["title"] == "Daily Standup"
        assert next_task["status"] == "pending"
        # Next due date should be one day after original
        assert next_task["due_date"] > task["due_date"]


class TestTaskFiltering:
    """Integration tests for task filtering and sorting."""

    def test_filter_by_status(self, client: TestClient):
        """Test filtering tasks by status."""
        # Create pending task
        pending = client.post(
            "/api/v1/tasks", json={"title": "Pending Task", "priority": "medium"}
        ).json()

        # Create and complete another task
        completed = client.post(
            "/api/v1/tasks", json={"title": "Done Task", "priority": "low"}
        ).json()
        client.post(f"/api/v1/tasks/{completed['id']}/complete")

        # Filter pending only
        pending_response = client.get("/api/v1/tasks", params={"status": "pending"})
        pending_tasks = pending_response.json()
        assert all(t["status"] == "pending" for t in pending_tasks)

        # Filter completed only
        completed_response = client.get(
            "/api/v1/tasks", params={"status": "completed"}
        )
        completed_tasks = completed_response.json()
        assert all(t["status"] == "completed" for t in completed_tasks)

    def test_filter_by_priority(self, client: TestClient):
        """Test filtering tasks by priority."""
        # Create tasks with different priorities
        client.post("/api/v1/tasks", json={"title": "High Priority", "priority": "high"})
        client.post("/api/v1/tasks", json={"title": "Low Priority", "priority": "low"})

        # Filter by high priority
        response = client.get("/api/v1/tasks", params={"priority": "high"})
        tasks = response.json()
        assert all(t["priority"] == "high" for t in tasks)

    def test_search_tasks(self, client: TestClient):
        """Test searching tasks by title/description."""
        client.post(
            "/api/v1/tasks",
            json={"title": "Meeting with client", "description": "Discuss project"},
        )
        client.post("/api/v1/tasks", json={"title": "Buy groceries"})

        # Search for "meeting"
        response = client.get("/api/v1/tasks", params={"search": "meeting"})
        tasks = response.json()
        assert len(tasks) == 1
        assert "Meeting" in tasks[0]["title"]

    def test_sort_tasks(self, client: TestClient):
        """Test sorting tasks."""
        client.post("/api/v1/tasks", json={"title": "Zebra Task", "priority": "low"})
        client.post("/api/v1/tasks", json={"title": "Apple Task", "priority": "high"})

        # Sort by title ascending
        response = client.get(
            "/api/v1/tasks", params={"sort_by": "title", "sort_order": "asc"}
        )
        tasks = response.json()
        if len(tasks) >= 2:
            assert tasks[0]["title"] < tasks[1]["title"]


class TestDueDateValidation:
    """Integration tests for due date validation."""

    def test_cannot_create_task_with_past_due_date(self, client: TestClient):
        """Creating a task with past due date fails."""
        yesterday = (date.today() - timedelta(days=1)).isoformat()

        response = client.post(
            "/api/v1/tasks",
            json={"title": "Past Due Task", "priority": "medium", "due_date": yesterday},
        )
        assert response.status_code == 400
        assert "past" in response.json()["detail"].lower()

    def test_due_time_requires_due_date(self, client: TestClient):
        """Creating a task with due_time but no due_date fails."""
        response = client.post(
            "/api/v1/tasks",
            json={"title": "Time Only Task", "priority": "medium", "due_time": "14:00"},
        )
        assert response.status_code == 400
