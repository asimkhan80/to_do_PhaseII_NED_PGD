"use client";

import { useMemo } from "react";
import { getTodayForApi } from "@/utils/dates";

interface DateTimePickerProps {
  date: string | undefined;
  time: string | undefined;
  onDateChange: (date: string | undefined) => void;
  onTimeChange: (time: string | undefined) => void;
  disabled?: boolean;
  error?: string;
}

/**
 * Combined date and optional time picker for task due dates.
 */
export function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  disabled,
  error,
}: DateTimePickerProps) {
  const minDate = useMemo(() => getTodayForApi(), []);

  const handleDateChange = (value: string) => {
    if (value) {
      onDateChange(value);
    } else {
      onDateChange(undefined);
      onTimeChange(undefined); // Clear time when date is cleared
    }
  };

  const handleTimeChange = (value: string) => {
    onTimeChange(value || undefined);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={date || ""}
            onChange={(e) => handleDateChange(e.target.value)}
            min={minDate}
            className={`input ${error ? "border-red-500" : ""}`}
            disabled={disabled}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="time"
            value={time || ""}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="input"
            disabled={disabled || !date}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
