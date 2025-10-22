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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border border-border w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Delete Task?</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-semibold text-foreground">"{task.title}"</span>? This
          action cannot be undone.
        </p>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors font-medium"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}
