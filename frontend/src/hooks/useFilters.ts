"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { TaskQueryParams, TaskStatus, Priority, TaskSortField, SortOrder } from "@/types";

/**
 * Hook for managing task filter and sort state via URL search params.
 * Enables shareable filter URLs and browser back/forward navigation.
 */
export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current filters from URL
  const filters: TaskQueryParams = useMemo(() => ({
    status: (searchParams.get("status") as TaskStatus) || undefined,
    priority: (searchParams.get("priority") as Priority) || undefined,
    category_id: searchParams.get("category_id") || undefined,
    search: searchParams.get("search") || undefined,
    due_before: searchParams.get("due_before") || undefined,
    due_after: searchParams.get("due_after") || undefined,
    sort_by: (searchParams.get("sort_by") as TaskSortField) || undefined,
    sort_order: (searchParams.get("sort_order") as SortOrder) || undefined,
  }), [searchParams]);

  // Update URL with new params
  const updateParams = useCallback((updates: Partial<TaskQueryParams>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }, [searchParams, router, pathname]);

  // Individual setters
  const setSearch = useCallback((search: string) => {
    updateParams({ search: search || undefined });
  }, [updateParams]);

  const setStatus = useCallback((status: TaskStatus | undefined) => {
    updateParams({ status });
  }, [updateParams]);

  const setPriority = useCallback((priority: Priority | undefined) => {
    updateParams({ priority });
  }, [updateParams]);

  const setCategoryId = useCallback((category_id: string | undefined) => {
    updateParams({ category_id });
  }, [updateParams]);

  const setDueBefore = useCallback((due_before: string | undefined) => {
    updateParams({ due_before });
  }, [updateParams]);

  const setDueAfter = useCallback((due_after: string | undefined) => {
    updateParams({ due_after });
  }, [updateParams]);

  const setSortBy = useCallback((sort_by: TaskSortField) => {
    updateParams({ sort_by });
  }, [updateParams]);

  const setSortOrder = useCallback((sort_order: SortOrder) => {
    updateParams({ sort_order });
  }, [updateParams]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.status ||
      filters.priority ||
      filters.category_id ||
      filters.search ||
      filters.due_before ||
      filters.due_after
    );
  }, [filters]);

  return {
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
  };
}
