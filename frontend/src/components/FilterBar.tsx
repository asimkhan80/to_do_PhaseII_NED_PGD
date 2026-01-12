"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import type { TaskStatus, Priority } from "@/types";

interface FilterBarProps {
  search: string | undefined;
  status: TaskStatus | undefined;
  priority: Priority | undefined;
  categoryId: string | undefined;
  dueBefore: string | undefined;
  dueAfter: string | undefined;
  hasActiveFilters: boolean;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TaskStatus | undefined) => void;
  onPriorityChange: (priority: Priority | undefined) => void;
  onCategoryChange: (categoryId: string | undefined) => void;
  onDueBeforeChange: (date: string | undefined) => void;
  onDueAfterChange: (date: string | undefined) => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus | ""; label: string }[] = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_OPTIONS: { value: Priority | ""; label: string }[] = [
  { value: "", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function FilterBar({
  search,
  status,
  priority,
  categoryId,
  dueBefore,
  dueAfter,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onDueBeforeChange,
  onDueAfterChange,
  onClearFilters,
}: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(search || "");
  const { data: categories = [] } = useCategories();

  // Sync search input with prop
  useEffect(() => {
    setSearchInput(search || "");
  }, [search]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (search || "")) {
        onSearchChange(searchInput);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, search, onSearchChange]);

  return (
    <div className="card p-4 space-y-3">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search tasks..."
          className="input pl-10"
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput("");
              onSearchChange("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        {/* Status filter */}
        <select
          value={status || ""}
          onChange={(e) =>
            onStatusChange(e.target.value ? (e.target.value as TaskStatus) : undefined)
          }
          className="input w-auto min-w-[130px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={priority || ""}
          onChange={(e) =>
            onPriorityChange(e.target.value ? (e.target.value as Priority) : undefined)
          }
          className="input w-auto min-w-[130px]"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={categoryId || ""}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
          className="input w-auto min-w-[130px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Date range filters */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500">Due:</span>
          <input
            type="date"
            value={dueAfter || ""}
            onChange={(e) => onDueAfterChange(e.target.value || undefined)}
            className="input w-auto"
            title="Due after"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={dueBefore || ""}
            onChange={(e) => onDueBeforeChange(e.target.value || undefined)}
            className="input w-auto"
            title="Due before"
          />
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
