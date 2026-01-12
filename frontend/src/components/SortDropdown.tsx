"use client";

import type { TaskSortField, SortOrder } from "@/types";

interface SortDropdownProps {
  sortBy: TaskSortField | undefined;
  sortOrder: SortOrder | undefined;
  onSortByChange: (sortBy: TaskSortField) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

const SORT_OPTIONS: { value: TaskSortField; label: string }[] = [
  { value: "created_at", label: "Date Created" },
  { value: "title", label: "Title" },
  { value: "priority", label: "Priority" },
  { value: "due_date", label: "Due Date" },
];

export function SortDropdown({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortDropdownProps) {
  const currentSortBy = sortBy || "created_at";
  const currentSortOrder = sortOrder || "desc";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      <select
        value={currentSortBy}
        onChange={(e) => onSortByChange(e.target.value as TaskSortField)}
        className="input w-auto min-w-[140px]"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={() => onSortOrderChange(currentSortOrder === "asc" ? "desc" : "asc")}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        title={currentSortOrder === "asc" ? "Ascending" : "Descending"}
      >
        {currentSortOrder === "asc" ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
