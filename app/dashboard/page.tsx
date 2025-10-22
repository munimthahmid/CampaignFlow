"use client"

import { useState, useEffect, useMemo } from "react"
import type { Task, FilterState } from "@/types"
import { dataClient } from "@/lib/dataClient"
import { sampleInfluencers } from "@/lib/sampleData"
import { AppHeader } from "@/components/AppHeader"
import { FiltersBar } from "@/components/FiltersBar"
import { Board } from "@/components/Board"
import { AddTaskModal } from "@/components/AddTaskModal"
import { EditTaskDrawer } from "@/components/EditTaskDrawer"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"
import { BoardSkeleton } from "@/components/Skeletons"
import { useToast } from "@/components/ToastProvider"
import { useRouter } from "next/navigation"
import { USING_SUPABASE } from "@/lib/config"
import { supabaseClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const { addToast } = useToast()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    priority: "All",
    platform: "All",
    assignee: "All",
  })

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      // Route guard for supabase
      if (USING_SUPABASE) {
        try {
          const supabase = supabaseClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) {
            router.replace('/login')
            return
          }
        } catch {}
      } else {
        // Mock cookie-based guard
        try {
          const hasSession = document.cookie.split(";").some((c) => c.trim().startsWith("session="))
          if (!hasSession) {
            router.replace('/login')
            return
          }
        } catch {}
      }

      try {
        const data = await dataClient.listTasks()
        setTasks(data)
      } catch (error) {
        addToast("Failed to load tasks", "error")
      } finally {
        setIsLoading(false)
      }
    }
    loadTasks()
  }, [addToast])

  // Keyboard shortcuts: 'n' opens Add Task
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null
      const isTyping = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
      if (!isTyping && e.key.toLowerCase() === "n") {
        e.preventDefault()
        setShowAddModal(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.influencer.handle.toLowerCase().includes(filters.search.toLowerCase())

      const matchesPriority = filters.priority === "All" || task.priority === filters.priority
      const matchesPlatform = filters.platform === "All" || task.influencer.platform === filters.platform
      const matchesAssignee =
        filters.assignee === "All" || (task.assignees?.some((a) => a.id === filters.assignee) ?? false)

      return matchesSearch && matchesPriority && matchesPlatform && matchesAssignee
    })
  }, [tasks, filters])

  // Get unique assignees
  const assignees = useMemo(() => {
    const uniqueAssignees = new Map()
    tasks.forEach((task) => {
      task.assignees?.forEach((assignee) => {
        if (!uniqueAssignees.has(assignee.id)) {
          uniqueAssignees.set(assignee.id, assignee)
        }
      })
    })
    return Array.from(uniqueAssignees.values())
  }, [tasks])

  const handleAddTask = async (task: Omit<Task, "id">) => {
    try {
      const newTask = await dataClient.createTask(task)
      setTasks((prev) => [...prev, newTask])
    } catch (error) {
      throw error
    }
  }

  const handleUpdateTask = async (updates: Partial<Task>) => {
    if (!editingTask) return
    try {
      const updated = await dataClient.updateTask(editingTask.id, updates)
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      setEditingTask(null)
    } catch (error) {
      throw error
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dataClient.deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      setDeletingTask(null)
    } catch (error) {
      throw error
    }
  }

  const handleTasksChange = async (newTasks: Task[]) => {
    setTasks(newTasks)
    // Persist status changes
    for (const task of newTasks) {
      const oldTask = tasks.find((t) => t.id === task.id)
      if (oldTask && oldTask.status !== task.status) {
        try {
          await dataClient.updateTaskStatus(task.id, task.status)
        } catch (error) {
          addToast("Failed to update task status", "error")
        }
      }
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader onAddTask={() => setShowAddModal(true)} onSearch={(q) => setFilters((f) => ({ ...f, search: q }))} />

      <main className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
        <FiltersBar filters={filters} onFiltersChange={setFilters} assignees={assignees} />

        {isLoading ? (
          <BoardSkeleton />
        ) : (
          <Board
            tasks={filteredTasks}
            onTasksChange={handleTasksChange}
            onEdit={setEditingTask}
            onDelete={setDeletingTask}
            onAddTask={() => setShowAddModal(true)}
          />
        )}
      </main>

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
        influencers={sampleInfluencers}
      />

      <EditTaskDrawer
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        influencers={sampleInfluencers}
      />

      <DeleteConfirmDialog
        isOpen={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
      />
    </div>
  )
}
