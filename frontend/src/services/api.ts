// API client base with fetch wrapper and error handling

import type {
  Task,
  Category,
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  TaskQueryParams,
  TaskCompleteResponse,
  ApiError,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: "An unexpected error occurred",
        status_code: response.status,
      }));
      throw new Error(error.detail);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  private buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  // Task endpoints
  async getTasks(params?: TaskQueryParams): Promise<Task[]> {
    const query = params ? this.buildQueryString(params as unknown as Record<string, unknown>) : "";
    return this.request<Task[]>(`/api/v1/tasks${query}`);
  }

  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/api/v1/tasks/${id}`);
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>("/api/v1/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    return this.request<Task>(`/api/v1/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/api/v1/tasks/${id}`, {
      method: "DELETE",
    });
  }

  async completeTask(id: string): Promise<TaskCompleteResponse> {
    return this.request<TaskCompleteResponse>(`/api/v1/tasks/${id}/complete`, {
      method: "POST",
    });
  }

  async uncompleteTask(id: string): Promise<Task> {
    return this.request<Task>(`/api/v1/tasks/${id}/uncomplete`, {
      method: "POST",
    });
  }

  // Category endpoints
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>("/api/v1/categories");
  }

  async getCategory(id: string): Promise<Category> {
    return this.request<Category>(`/api/v1/categories/${id}`);
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    return this.request<Category>("/api/v1/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryRequest
  ): Promise<Category> {
    return this.request<Category>(`/api/v1/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request<void>(`/api/v1/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>("/health");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
