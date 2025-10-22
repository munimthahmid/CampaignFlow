import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Instagram, Youtube, Music2, BadgeInfo } from "lucide-react"
import type { ReactNode } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(dateString?: string): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)}d`
  if (diffDays === 0) return "Due today"
  if (diffDays === 1) return "Due tomorrow"
  return `Due in ${diffDays}d`
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "High":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-400"
    case "Medium":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400"
    case "Low":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

export function getPlatformIcon(platform: string, className: string = "w-3.5 h-3.5"): ReactNode {
  switch (platform) {
    case "Instagram":
      return <Instagram className={className} />
    case "TikTok":
      return <Music2 className={className} />
    case "YouTube":
      return <Youtube className={className} />
    default:
      return <BadgeInfo className={className} />
  }
}
