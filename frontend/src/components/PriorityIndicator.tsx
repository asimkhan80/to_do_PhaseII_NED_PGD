import type { Priority } from "@/types";

interface PriorityIndicatorProps {
  priority: Priority;
  size?: "sm" | "md";
  showLabel?: boolean;
}

const priorityConfig = {
  high: {
    label: "High",
    className: "priority-high",
    dotColor: "bg-red-500",
  },
  medium: {
    label: "Medium",
    className: "priority-medium",
    dotColor: "bg-yellow-500",
  },
  low: {
    label: "Low",
    className: "priority-low",
    dotColor: "bg-green-500",
  },
};

/**
 * Visual indicator for task priority level.
 * Displays as a colored badge with optional label.
 */
export function PriorityIndicator({
  priority,
  size = "sm",
  showLabel = true,
}: PriorityIndicatorProps) {
  const config = priorityConfig[priority];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  if (!showLabel) {
    // Compact dot-only indicator
    return (
      <span
        className={`inline-block w-2 h-2 rounded-full ${config.dotColor}`}
        title={config.label}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizeClasses[size]} ${config.className}`}
    >
      {config.label}
    </span>
  );
}
