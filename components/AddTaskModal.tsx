"use client"

import type React from "react"

import { useState } from "react"
import type { Task, Influencer } from "@/types"
import { X } from "lucide-react"
import { useToast } from "./ToastProvider"

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, "id">) => Promise<void>
  influencers: Influencer[]
}

export function AddTaskModal({ isOpen, onClose, onSubmit, influencers }: AddTaskModalProps) {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    influencerId: "",
    priority: "Medium" as const,
    status: "Backlog" as const,
    dueDate: "",
    budget: "",
    deliverable: "Post" as const,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.influencerId) {
      addToast("Please fill in all required fields", "error")
      return
    }

    setIsLoading(true)
    try {
      const influencer = influencers.find((i) => i.id === formData.influencerId)
      if (!influencer) throw new Error("Influencer not found")

      await onSubmit({
        title: formData.title,
        influencer,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || undefined,
        budget: formData.budget ? Number.parseInt(formData.budget) : undefined,
        deliverable: formData.deliverable,
      })

      setFormData({
        title: "",
        influencerId: "",
        priority: "Medium",
        status: "Backlog",
        dueDate: "",
        budget: "",
        deliverable: "Post",
      })
      onClose()
      addToast("Task created successfully", "success")
    } catch (error) {
      addToast("Failed to create task", "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card rounded-2xl border border-border/50 w-full max-w-lg p-8 space-y-6 animate-scale-in shadow-elegant">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold gradient-text">Add New Task</h2>
            <p className="text-sm text-muted-foreground mt-1">Create a new task for your campaign</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-destructive/10 rounded-xl transition-all duration-300 cursor-pointer group"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-destructive" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground uppercase tracking-wide">
              Task Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Instagram Post for Product Launch"
              className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 hover:border-accent/30"
              required
            />
          </div>

          {/* Influencer */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground uppercase tracking-wide">
              Influencer <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.influencerId}
              onChange={(e) => setFormData({ ...formData, influencerId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 hover:border-accent/30 cursor-pointer"
              required
            >
              <option value="">Select an influencer</option>
              {influencers.map((inf) => (
                <option key={inf.id} value={inf.id}>
                  {inf.name} ({inf.handle}) - {inf.platform}
                </option>
              ))}
            </select>
          </div>

          {/* Priority & Deliverable */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground uppercase tracking-wide">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 hover:border-accent/30 cursor-pointer"
              >
                <option value="Low">🔵 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground uppercase tracking-wide">Deliverable</label>
              <select
                value={formData.deliverable}
                onChange={(e) => setFormData({ ...formData, deliverable: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 hover:border-accent/30 cursor-pointer"
              >
                <option value="Post">📷 Post</option>
                <option value="Story">📖 Story</option>
                <option value="Reel">🎬 Reel</option>
                <option value="Short">▶️ Short</option>
              </select>
            </div>
          </div>

          {/* Due Date & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground uppercase tracking-wide">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 hover:border-accent/30"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground uppercase tracking-wide">Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="1000"
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 hover:border-accent/30"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-border bg-card/50 text-foreground hover:bg-muted hover:border-accent/30 transition-all duration-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl gradient-accent text-white hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-glow-purple"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
