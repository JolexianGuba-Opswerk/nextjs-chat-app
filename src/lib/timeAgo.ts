/**
 * Returns a human-readable "time ago" string from a given date string.
 * Examples: "Just now", "5 minutes ago", "3 hours ago", "2 days ago"
 */
export function timeAgo(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));  
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffMinutes < 5) {
    return "Just now";
  }
  if (diffMinutes < 60) {
    return formatter.format(-diffMinutes, "minute");
  }
  if (diffHours < 24) {
    return formatter.format(-diffHours, "hour");
  }
  if (diffDays < 30) {
    return formatter.format(-diffDays, "day");
  }
  if (diffDays < 365) {
    return formatter.format(-diffMonths, "month");
  }
  return formatter.format(-diffYears, "year");
}
