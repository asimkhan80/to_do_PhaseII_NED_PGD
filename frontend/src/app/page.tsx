"use client";

import { Suspense } from "react";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { FilterBar } from "@/components/FilterBar";
import { SortDropdown } from "@/components/SortDropdown";
import { useTasks } from "@/hooks/useTasks";
import { useFilters } from "@/hooks/useFilters";

function TasksContent() {
  const {
    filters,
    setSearch,
    setStatus,
    setPriority,
    setCategoryId,
    setDueBefore,
    setDueAfter,
    setSortBy,
    setSortOrder,
    clearFilters,
    hasActiveFilters,
  } = useFilters();

  const { data: tasks = [], isLoading, error } = useTasks(filters);

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-6">
      <TaskForm />

      <FilterBar
        search={filters.search}
        status={filters.status}
        priority={filters.priority}
        categoryId={filters.category_id}
        dueBefore={filters.due_before}
        dueAfter={filters.due_after}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onCategoryChange={setCategoryId}
        onDueBeforeChange={setDueBefore}
        onDueAfterChange={setDueAfter}
        onClearFilters={clearFilters}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Tasks ({tasks.length})
        </h2>
        <SortDropdown
          sortBy={filters.sort_by}
          sortOrder={filters.sort_order}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
        />
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Pending ({pendingTasks.length})
          </h3>
          <TaskList
            tasks={pendingTasks}
            isLoading={isLoading}
            error={error}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </section>

        {completedTasks.length > 0 && (
          <section>
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              Completed ({completedTasks.length})
            </h3>
            <TaskList tasks={completedTasks} />
          </section>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="card p-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded" />
          </div>
          <div className="card p-4 animate-pulse">
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      }
    >
      <TasksContent />
    </Suspense>
  );
}
