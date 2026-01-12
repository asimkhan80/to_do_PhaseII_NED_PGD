"use client";

import { useState } from "react";
import { useCreateTask } from "@/hooks/useTasks";
import { useCategories, useCreateCategory } from "@/hooks/useCategories";
import { DateTimePicker } from "./DateTimePicker";
import { RecurrenceSelector } from "./RecurrenceSelector";
import type { CreateTaskRequest, Priority, RecurrenceType } from "@/types";

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [categoryId, setCategoryId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [dueTime, setDueTime] = useState<string | undefined>();
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const createTask = useCreateTask();
  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const taskData: CreateTaskRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category_id: categoryId || undefined,
      due_date: dueDate,
      due_time: dueTime,
      recurrence_type: recurrenceType !== "none" ? recurrenceType : undefined,
    };

    createTask.mutate(taskData, {
      onSuccess: () => {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setCategoryId("");
        setDueDate(undefined);
        setDueTime(undefined);
        setRecurrenceType("none");
        setIsExpanded(false);
      },
    });
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    createCategory.mutate(
      { name: newCategoryName.trim() },
      {
        onSuccess: (category) => {
          setCategoryId(category.id);
          setNewCategoryName("");
          setShowNewCategory(false);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isExpanded) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategoryId("");
    setDueDate(undefined);
    setDueTime(undefined);
    setRecurrenceType("none");
    setIsExpanded(false);
    setShowNewCategory(false);
    setNewCategoryName("");
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a new task..."
            className="input flex-1"
            disabled={createTask.isPending}
          />
          {!isExpanded && (
            <button
              type="submit"
              disabled={!title.trim() || createTask.isPending}
              className="btn-primary"
            >
              {createTask.isPending ? "Adding..." : "Add"}
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-3 animate-slide-up">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="input min-h-[80px]"
              disabled={createTask.isPending}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="input"
                  disabled={createTask.isPending}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                {!showNewCategory ? (
                  <div className="flex gap-1">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="input flex-1"
                      disabled={createTask.isPending}
                    >
                      <option value="">No category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(true)}
                      className="px-2 text-primary hover:bg-gray-100 rounded"
                      title="Create new category"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                      className="input flex-1"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={
                        !newCategoryName.trim() || createCategory.isPending
                      }
                      className="px-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategory(false);
                        setNewCategoryName("");
                      }}
                      className="px-2 text-gray-500 hover:bg-gray-100 rounded"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DateTimePicker
                date={dueDate}
                time={dueTime}
                onDateChange={setDueDate}
                onTimeChange={setDueTime}
                disabled={createTask.isPending}
              />
              <RecurrenceSelector
                value={recurrenceType}
                onChange={setRecurrenceType}
                disabled={createTask.isPending || !dueDate}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
                disabled={createTask.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || createTask.isPending}
                className="btn-primary"
              >
                {createTask.isPending ? "Adding..." : "Add Task"}
              </button>
            </div>
          </div>
        )}
      </div>

      {createTask.isError && (
        <p className="mt-2 text-sm text-red-600">
          Failed to create task: {createTask.error.message}
        </p>
      )}
    </form>
  );
}
