"use client"

import { Search, Plus, Bell, LogOut } from "lucide-react"
import { useState } from "react"

interface AppHeaderProps {
  onAddTask: () => void
  onSearch?: (query: string) => void
}

export function AppHeader({ onAddTask, onSearch }: AppHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold">
            CF
          </div>
          <h1 className="text-lg font-bold text-foreground">CampaignFlow</h1>
          <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">Demo</span>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks... (⌘K)"
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>

          <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <Bell className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              JD
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  Settings
                </button>
                <div className="border-t border-border my-1" />
                <button className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-muted transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
