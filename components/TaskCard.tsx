"use client"

import type { Task } from "@/types"
import { formatRelativeDate, getPriorityColor, getPlatformIcon } from "@/lib/utils"
import { Draggable } from "@hello-pangea/dnd"
import { Edit2, Trash2 } from "lucide-react"
import Image from "next/image"

interface TaskCardProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-card rounded-lg p-4 border border-border transition-all ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-accent" : "hover:shadow-md"
          }`}
        >
          <div className="space-y-3">
            {/* Title */}
            <h4 className="font-semibold text-foreground text-sm leading-snug">{task.title}</h4>

            {/* Influencer */}
            <div className="flex items-center gap-2">
              {task.influencer.avatarUrl && (
                <Image
                  src={task.influencer.avatarUrl || "/placeholder.svg"}
                  alt={task.influencer.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{task.influencer.name}</p>
                <p className="text-xs text-muted-foreground truncate">{task.influencer.handle}</p>
              </div>
            </div>

            {/* Platform & Priority */}
            <div className="flex gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                {getPlatformIcon(task.influencer.platform)} {task.influencer.platform}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>

            {/* Due Date */}
            {task.dueDate && <p className="text-xs text-muted-foreground">{formatRelativeDate(task.dueDate)}</p>}

            {/* Assignees */}
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex items-center gap-1">
                {task.assignees.slice(0, 2).map((assignee) => (
                  <Image
                    key={assignee.id}
                    src={assignee.avatarUrl || ""}
                    alt={assignee.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full"
                  />
                ))}
                {task.assignees.length > 2 && (
                  <span className="text-xs text-muted-foreground">+{task.assignees.length - 2}</span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => onDelete(task)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
