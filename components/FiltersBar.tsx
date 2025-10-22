"use client"

import type { FilterState, Platform, Priority } from "@/types"
import { X } from "lucide-react"

interface FiltersBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  assignees: Array<{ id: string; name: string }>
}

export function FiltersBar({ filters, onFiltersChange, assignees }: FiltersBarProps) {
  const hasActiveFilters =
    filters.search || filters.priority !== "All" || filters.platform !== "All" || filters.assignee !== "All"

  return (
    <div className="flex flex-wrap gap-3 items-center p-4 bg-card rounded-lg border border-border">
      {/* Search */}
      <div className="flex-1 min-w-64">
        <input
          type="text"
          placeholder="Search tasks or influencers..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Priority Filter */}
      <select
        value={filters.priority}
        onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as Priority | "All" })}
        className="px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="All">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* Platform Filter */}
      <select
        value={filters.platform}
        onChange={(e) => onFiltersChange({ ...filters, platform: e.target.value as Platform | "All" })}
        className="px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="All">All Platforms</option>
        <option value="Instagram">Instagram</option>
        <option value="TikTok">TikTok</option>
        <option value="YouTube">YouTube</option>
      </select>

      {/* Assignee Filter */}
      <select
        value={filters.assignee}
        onChange={(e) => onFiltersChange({ ...filters, assignee: e.target.value })}
        className="px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="All">All Assignees</option>
        {assignees.map((assignee) => (
          <option key={assignee.id} value={assignee.id}>
            {assignee.name}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={() =>
            onFiltersChange({
              search: "",
              priority: "All",
              platform: "All",
              assignee: "All",
            })
          }
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-sm font-medium transition-colors"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      )}
    </div>
  )
}
