"use client";

import type { Task } from "@/types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: Error | null;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export function TaskList({ tasks, isLoading, error, hasActiveFilters, onClearFilters }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="card p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 font-medium">Failed to load tasks</p>
        <p className="text-sm text-gray-600 mt-1">{error.message}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="card p-8 text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-600">
            No tasks match your current filters.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="mt-4 btn-secondary"
            >
              Clear Filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="card p-8 text-center">
        <svg
          className="w-12 h-12 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
        <p className="mt-1 text-sm text-gray-600">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
