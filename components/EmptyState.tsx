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
    <div className={`flex flex-col items-center justify-center ${variant === "board" ? "py-20" : "py-10"} animate-fade-in`}>
      {/* Icon with gradient background */}
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-gradient-accent blur-xl opacity-30 animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-foreground mb-2 text-lg">{title}</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs leading-relaxed">{description}</p>

      {/* Action Button */}
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-accent text-white text-sm font-semibold hover-lift transition-all duration-300 shadow-lg hover:shadow-glow-purple"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
