"use client";

import { useState } from "react";
import type { Task } from "@/types";
import {
  useDeleteTask,
  useCompleteTask,
  useUncompleteTask,
  useUpdateTask,
} from "@/hooks/useTasks";
import { getRelativeDateLabel, getDueDateStatus } from "@/utils/dates";
import { CategoryBadge } from "./CategoryBadge";
import { PriorityIndicator } from "./PriorityIndicator";
import { useToast } from "@/contexts/ToastContext";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteTask = useDeleteTask();
  const completeTask = useCompleteTask();
  const uncompleteTask = useUncompleteTask();
  const updateTask = useUpdateTask();
  const { showSuccess, showError } = useToast();

  const isCompleted = task.status === "completed";
  const dueDateStatus = getDueDateStatus(task.due_date);

  const handleToggleComplete = () => {
    if (isCompleted) {
      uncompleteTask.mutate(task.id, {
        onSuccess: () => showSuccess("Task marked as pending"),
        onError: (error) => showError(error.message),
      });
    } else {
      completeTask.mutate(task.id, {
        onSuccess: (response) => {
          if (response.next_task) {
            showSuccess("Task completed! Next occurrence created.");
          } else {
            showSuccess("Task completed!");
          }
        },
        onError: (error) => showError(error.message),
      });
    }
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => showSuccess("Task deleted"),
      onError: (error) => showError(error.message),
    });
    setShowDeleteConfirm(false);
  };

  const handleSaveEdit = () => {
    updateTask.mutate({
      id: task.id,
      data: {
        title: editTitle,
        description: editDescription || undefined,
      },
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(false);
  };

  const dueDateClasses = {
    overdue: "due-overdue",
    "due-soon": "due-soon",
    future: "due-future",
    none: "",
  };

  if (isEditing) {
    return (
      <div className="card p-4 animate-fade-in">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="input"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="input min-h-[80px]"
            placeholder="Description (optional)"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={!editTitle.trim() || updateTask.isPending}
              className="btn-primary"
            >
              {updateTask.isPending ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancelEdit} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card p-4 animate-fade-in ${isCompleted ? "task-completed" : ""}`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggleComplete}
          className="mt-1 h-5 w-5 rounded border-gray-300 cursor-pointer"
          disabled={completeTask.isPending || uncompleteTask.isPending}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
            <PriorityIndicator priority={task.priority} />
            {task.category && <CategoryBadge category={task.category} />}
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}

          {task.due_date && (
            <div className={`flex items-center gap-1 text-sm mt-1 ${dueDateClasses[dueDateStatus]}`}>
              <span>Due: {getRelativeDateLabel(task.due_date)}</span>
              {task.recurrence_type !== "none" && (
                <span
                  className="inline-flex items-center text-gray-500"
                  title={`Repeats ${task.recurrence_type}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Edit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-slide-up">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Task?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete &quot;{task.title}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteTask.isPending}
                className="btn-destructive"
              >
                {deleteTask.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
