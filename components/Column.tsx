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

export function Column({ title, status, tasks, onEdit, onDelete, onAddTask }: ColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col bg-background rounded-lg border border-border p-4 h-fit max-h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 overflow-y-auto pr-2 ${snapshot.isDraggingOver ? "bg-accent/5 rounded" : ""}`}
          >
            {tasks.length === 0 ? (
              <EmptyState
                title="No tasks"
                description="Add a task to get started"
                onAction={onAddTask}
                actionLabel="Add Task"
                variant="column"
              />
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
