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
    <div className="glass-card rounded-xl p-5 border border-border/50 animate-fade-in">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Filters Label */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Filters</span>
        </div>

        <div className="h-6 w-px bg-border/50" />

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as Priority | "All" })}
          className="px-4 py-2.5 rounded-xl bg-background/60 border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 hover:border-accent/30 cursor-pointer"
        >
          <option value="All">All Priorities</option>
          <option value="High">🔴 High Priority</option>
          <option value="Medium">🟡 Medium Priority</option>
          <option value="Low">🔵 Low Priority</option>
        </select>

        {/* Platform Filter */}
        <select
          value={filters.platform}
          onChange={(e) => onFiltersChange({ ...filters, platform: e.target.value as Platform | "All" })}
          className="px-4 py-2.5 rounded-xl bg-background/60 border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 hover:border-accent/30 cursor-pointer"
        >
          <option value="All">All Platforms</option>
          <option value="Instagram">📷 Instagram</option>
          <option value="TikTok">🎵 TikTok</option>
          <option value="YouTube">▶️ YouTube</option>
        </select>

        {/* Assignee Filter */}
        <select
          value={filters.assignee}
          onChange={(e) => onFiltersChange({ ...filters, assignee: e.target.value })}
          className="px-4 py-2.5 rounded-xl bg-background/60 border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 hover:border-accent/30 cursor-pointer"
        >
          <option value="All">All Assignees</option>
          {assignees.map((assignee) => (
            <option key={assignee.id} value={assignee.id}>
              👤 {assignee.name}
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-semibold transition-all duration-300 cursor-pointer border border-destructive/20 hover-lift animate-scale-in"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}

        {/* Active Filter Count */}
        {hasActiveFilters && (
          <div className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20">
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Active Filters:</span>
            <span className="flex items-center justify-center w-6 h-6 rounded-full gradient-accent text-white text-xs font-bold">
              {[
                filters.priority !== "All",
                filters.platform !== "All",
                filters.assignee !== "All"
              ].filter(Boolean).length}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
