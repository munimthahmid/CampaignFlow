"use client"

import type { Task, Status } from "@/types"
import { Droppable } from "@hello-pangea/dnd"
import { TaskCard } from "./TaskCard"
import { EmptyState } from "./EmptyState"

interface ColumnProps {
  title: string
  status: Status
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onAddTask?: () => void
}

const getColumnColor = (status: Status) => {
  switch (status) {
    case "Backlog":
      return "from-slate-500/20 to-slate-600/20"
    case "In Progress":
      return "from-blue-500/20 to-cyan-500/20"
    case "Awaiting Approval":
      return "from-amber-500/20 to-yellow-500/20"
    case "Done":
      return "from-green-500/20 to-emerald-500/20"
    default:
      return "from-purple-500/20 to-pink-500/20"
  }
}

const getColumnAccent = (status: Status) => {
  switch (status) {
    case "Backlog":
      return "bg-slate-500"
    case "In Progress":
      return "bg-blue-500"
    case "Awaiting Approval":
      return "bg-amber-500"
    case "Done":
      return "bg-green-500"
    default:
      return "bg-purple-500"
  }
}

export function Column({ title, status, tasks, onEdit, onDelete, onAddTask }: ColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col glass-card rounded-2xl border border-border/50 p-5 h-fit max-h-[calc(100vh-200px)] relative overflow-hidden">
      {/* Top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getColumnColor(status)}`} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${getColumnAccent(status)} animate-pulse`} />
          <h3 className="font-bold text-foreground text-base">{title}</h3>
        </div>
        <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full gradient-accent text-xs font-bold text-white shadow-lg">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 overflow-y-auto pr-1 transition-all duration-300 rounded-xl ${
              snapshot.isDraggingOver ? "bg-accent/10 border-2 border-dashed border-accent/50 p-2" : ""
            }`}
          >
            {tasks.length === 0 ? (
              status === 'Backlog' ? (
                <EmptyState
                  title="No tasks"
                  description="Add a task to get started"
                  onAction={onAddTask}
                  actionLabel="Add Task"
                  variant="column"
                />
              ) : (
                <EmptyState
                  title="No tasks"
                  description="Move tasks here from other stages"
                  variant="column"
                />
              )
            ) : (
              tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} onEdit={onEdit} onDelete={onDelete} />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
