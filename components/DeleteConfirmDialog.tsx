"use client"

import type { Task } from "@/types"
import { Trash2 } from "lucide-react"
import { useToast } from "./ToastProvider"
import { useState } from "react"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  task: Task | null
  onClose: () => void
  onConfirm: (taskId: string) => Promise<void>
}

export function DeleteConfirmDialog({ isOpen, task, onClose, onConfirm }: DeleteConfirmDialogProps) {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!task) return
    setIsLoading(true)
    try {
      await onConfirm(task.id)
      onClose()
      addToast("Task deleted successfully", "success")
    } catch (error) {
      addToast("Failed to delete task", "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !task) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card rounded-2xl border border-destructive/20 w-full max-w-md p-8 space-y-6 animate-scale-in shadow-elegant">
        {/* Icon Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/30 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Delete Task?</h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-foreground gradient-text">"{task.title}"</span>?
            </p>
          </div>
        </div>

        {/* Warning Message */}
        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            ⚠️ This action cannot be undone. The task will be permanently removed from your campaign.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-border bg-card/50 text-foreground hover:bg-muted hover:border-accent/30 transition-all duration-300 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-glow-pink"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
            ) : (
              "Delete Forever"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
