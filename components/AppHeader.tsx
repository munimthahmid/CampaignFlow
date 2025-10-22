"use client"

import { Search, Plus, Bell, LogOut } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { USING_SUPABASE } from "@/lib/config"
import { supabaseClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Image from "next/image"
import { getInitials } from "@/lib/utils"

interface AppHeaderProps {
  onAddTask: () => void
  onSearch?: (query: string) => void
}

export function AppHeader({ onAddTask, onSearch }: AppHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Focus search: Cmd/Ctrl+K or '/'
      if ((e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // Load current user (Supabase)
  useEffect(() => {
    if (!USING_SUPABASE) return
    const supabase = supabaseClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    if (USING_SUPABASE) {
      const supabase = supabaseClient()
      await supabase.auth.signOut()
    } else {
      document.cookie = "session=; Max-Age=0; path=/"
    }
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-border/50 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4 gap-6 max-w-[1920px] mx-auto">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white font-bold shadow-lg">
            CF
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold gradient-text">CampaignFlow</h1>
            <span className="text-xs text-muted-foreground">Influencer Management</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tasks... (⌘K or /)"
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-background/60 border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 hover:border-accent/30"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs font-semibold text-muted-foreground bg-muted rounded border border-border">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-accent text-white font-semibold hover-lift shadow-lg transition-all duration-300 hover:shadow-glow-purple"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          <button className="relative p-2.5 rounded-xl hover:bg-accent/10 transition-all duration-300 text-muted-foreground hover:text-accent cursor-pointer group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-white font-semibold text-sm hover-lift cursor-pointer overflow-hidden shadow-lg ring-2 ring-accent/20"
              aria-label="User menu"
            >
              {user?.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.full_name || user.email || "User"}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                <span>{getInitials(user?.user_metadata?.full_name || user?.email || "User")}</span>
              )}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 glass-card rounded-xl shadow-elegant py-2 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-border/50">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.user_metadata?.full_name || user?.email || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 transition-all cursor-pointer flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                    <Search className="w-4 h-4 text-accent" />
                  </div>
                  <span>Profile</span>
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 transition-all cursor-pointer flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                    <Bell className="w-4 h-4 text-accent" />
                  </div>
                  <span>Settings</span>
                </button>
                <div className="border-t border-border/50 my-2" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-all flex items-center gap-2 cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-all">
                    <LogOut className="w-4 h-4 text-destructive" />
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
