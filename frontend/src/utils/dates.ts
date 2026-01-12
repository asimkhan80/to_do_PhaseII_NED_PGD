// Date formatting utilities with timezone handling
// All dates stored as UTC, displayed in local timezone

import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  isFuture,
  formatDistanceToNow,
  startOfDay,
  endOfDay,
} from "date-fns";

/**
 * Parse ISO date string to Date object
 */
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Format date for display (e.g., "Jan 12, 2026")
 */
export function formatDisplayDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = parseISO(dateString);
  return format(date, "MMM d, yyyy");
}

/**
 * Format date with time (e.g., "Jan 12, 2026 at 3:30 PM")
 */
export function formatDisplayDateTime(
  dateString: string | null,
  timeString: string | null
): string {
  if (!dateString) return "";
  const date = parseISO(dateString);
  const formattedDate = format(date, "MMM d, yyyy");

  if (timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const timeDate = new Date();
    timeDate.setHours(hours, minutes, 0, 0);
    const formattedTime = format(timeDate, "h:mm a");
    return `${formattedDate} at ${formattedTime}`;
  }

  return formattedDate;
}

/**
 * Get relative date label (Today, Tomorrow, Yesterday, or formatted date)
 */
export function getRelativeDateLabel(dateString: string | null): string {
  if (!dateString) return "";
  const date = parseISO(dateString);

  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "MMM d, yyyy");
}

/**
 * Get human-readable distance (e.g., "2 days ago", "in 3 hours")
 */
export function getTimeDistance(dateString: string): string {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Check if a date is overdue (past and not today)
 */
export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false;
  const date = parseISO(dateString);
  return isPast(endOfDay(date)) && !isToday(date);
}

/**
 * Check if a date is due soon (today or tomorrow)
 */
export function isDueSoon(dateString: string | null): boolean {
  if (!dateString) return false;
  const date = parseISO(dateString);
  return isToday(date) || isTomorrow(date);
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(dateString: string | null): boolean {
  if (!dateString) return false;
  const date = parseISO(dateString);
  return isFuture(startOfDay(date));
}

/**
 * Format date for API request (YYYY-MM-DD)
 */
export function formatDateForApi(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Format time for API request (HH:mm)
 */
export function formatTimeForApi(date: Date): string {
  return format(date, "HH:mm");
}

/**
 * Get today's date formatted for API
 */
export function getTodayForApi(): string {
  return formatDateForApi(new Date());
}

/**
 * Format timestamp for display (e.g., "Jan 12, 2026 3:30 PM")
 */
export function formatTimestamp(timestamp: string): string {
  const date = parseISO(timestamp);
  return format(date, "MMM d, yyyy h:mm a");
}

/**
 * Get due date status for styling
 */
export function getDueDateStatus(
  dateString: string | null
): "overdue" | "due-soon" | "future" | "none" {
  if (!dateString) return "none";
  if (isOverdue(dateString)) return "overdue";
  if (isDueSoon(dateString)) return "due-soon";
  return "future";
}
