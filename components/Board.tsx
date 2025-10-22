"use client"

import type { Task, Status } from "@/types"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Column } from "./Column"

interface BoardProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onAddTask?: () => void
}

const COLUMNS: { title: string; status: Status }[] = [
  { title: "Backlog", status: "Backlog" },
  { title: "In Progress", status: "In Progress" },
  { title: "Awaiting Approval", status: "Awaiting Approval" },
  { title: "Done", status: "Done" },
]

export function Board({ tasks, onTasksChange, onEdit, onDelete, onAddTask }: BoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const task = tasks.find((t) => t.id === draggableId)
    if (!task) return

    const newTasks = tasks.map((t) => (t.id === draggableId ? { ...t, status: destination.droppableId as Status } : t))

    onTasksChange(newTasks)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-6 px-1 snap-x snap-mandatory">
        {COLUMNS.map((column, index) => (
          <div key={column.status} className="snap-start animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <Column
              title={column.title}
              status={column.status}
              tasks={tasks.filter((t) => t.status === column.status)}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddTask={column.status === 'Backlog' ? onAddTask : undefined}
            />
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
