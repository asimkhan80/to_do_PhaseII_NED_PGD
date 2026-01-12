// TypeScript type definitions for Task and Category
// Matches backend data model from specs/001-fullstack-web-todo/data-model.md

export type TaskStatus = "pending" | "completed";

export type Priority = "high" | "medium" | "low";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export interface Category {
  id: string;
  name: string;
  color: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  category_id: string | null;
  category: Category | null;
  due_date: string | null;
  due_time: string | null;
  recurrence_type: RecurrenceType;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

// Request/Response types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: Priority;
  category_id?: string;
  due_date?: string;
  due_time?: string;
  recurrence_type?: RecurrenceType;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  category_id?: string | null;
  due_date?: string | null;
  due_time?: string | null;
  recurrence_type?: RecurrenceType;
}

export interface CreateCategoryRequest {
  name: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
}

// Filter and sort types
export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  category_id?: string;
  search?: string;
  due_before?: string;
  due_after?: string;
}

export type TaskSortField = "title" | "priority" | "due_date" | "created_at";
export type SortOrder = "asc" | "desc";

export interface TaskQueryParams extends TaskFilters {
  sort_by?: TaskSortField;
  sort_order?: SortOrder;
}

// Response for task completion (includes next task for recurring)
export interface TaskCompleteResponse {
  task: Task;
  next_task: Task | null;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}
