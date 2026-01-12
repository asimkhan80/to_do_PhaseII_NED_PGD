import type { Category } from "@/types";

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md";
}

/**
 * Displays a colored badge for a category.
 * Color is determined by the category's color property.
 */
export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]}`}
      style={{ backgroundColor: category.color || "#6B7280" }}
    >
      <span className="text-white">{category.name}</span>
    </span>
  );
}
