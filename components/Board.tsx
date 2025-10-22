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
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <Column
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={tasks.filter((t) => t.status === column.status)}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
