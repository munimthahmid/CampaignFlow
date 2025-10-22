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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border border-border w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Add New Task</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Task Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Influencer *</label>
            <select
              value={formData.influencerId}
              onChange={(e) => setFormData({ ...formData, influencerId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select an influencer</option>
              {influencers.map((inf) => (
                <option key={inf.id} value={inf.id}>
                  {inf.name} ({inf.handle})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Deliverable</label>
              <select
                value={formData.deliverable}
                onChange={(e) => setFormData({ ...formData, deliverable: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Post">Post</option>
                <option value="Story">Story</option>
                <option value="Reel">Reel</option>
                <option value="Short">Short</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Budget ($)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="Enter budget"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
