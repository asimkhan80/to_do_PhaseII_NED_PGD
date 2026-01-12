"use client";

import type { RecurrenceType } from "@/types";

interface RecurrenceSelectorProps {
  value: RecurrenceType;
  onChange: (value: RecurrenceType) => void;
  disabled?: boolean;
}

const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

/**
 * Dropdown selector for task recurrence frequency.
 */
export function RecurrenceSelector({
  value,
  onChange,
  disabled,
}: RecurrenceSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Repeat
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as RecurrenceType)}
        className="input"
        disabled={disabled}
      >
        {RECURRENCE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
