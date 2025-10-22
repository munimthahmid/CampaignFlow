"use client"

import { Plus } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  onAction?: () => void
  actionLabel?: string
  variant?: "board" | "column"
}

export function EmptyState({
  title,
  description,
  onAction,
  actionLabel = "Add Task",
  variant = "column",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${variant === "board" ? "py-16" : "py-8"}`}>
      <div className="text-4xl mb-3 opacity-50">📋</div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
