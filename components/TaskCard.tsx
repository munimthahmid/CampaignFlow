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
          className={`group glass-card rounded-xl p-4 border border-border/50 transition-all duration-300 cursor-grab active:cursor-grabbing relative overflow-hidden ${
            snapshot.isDragging
              ? "shadow-elegant ring-2 ring-accent/50 scale-105 rotate-2"
              : "hover:shadow-lg hover:-translate-y-1"
          }`}
        >
          {/* Gradient accent bar */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${
            task.priority === "High"
              ? "bg-gradient-to-b from-red-500 to-orange-500"
              : task.priority === "Medium"
              ? "bg-gradient-to-b from-yellow-500 to-amber-500"
              : "bg-gradient-to-b from-blue-500 to-cyan-500"
          }`} />

          <div className="space-y-3 pl-2">
            {/* Title */}
            <h4 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{task.title}</h4>

            {/* Influencer */}
            <div className="flex items-center gap-2.5">
              {task.influencer.avatarUrl && (
                <div className="relative">
                  <Image
                    src={task.influencer.avatarUrl || "/placeholder.svg"}
                    alt={task.influencer.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full ring-2 ring-accent/20"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-accent rounded-full flex items-center justify-center">
                    {getPlatformIcon(task.influencer.platform, "w-2 h-2 text-white")}
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{task.influencer.name}</p>
                <p className="text-xs text-muted-foreground truncate">{task.influencer.handle}</p>
              </div>
            </div>

            {/* Platform & Priority */}
            <div className="flex gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                {getPlatformIcon(task.influencer.platform, "w-3 h-3")}
                <span>{task.influencer.platform}</span>
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                task.priority === "High"
                  ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                  : task.priority === "Medium"
                  ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              }`}>
                {task.priority}
              </span>
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{formatRelativeDate(task.dueDate)}</span>
              </div>
            )}

            {/* Assignees */}
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex -space-x-2">
                  {task.assignees.slice(0, 3).map((assignee, idx) => (
                    <Image
                      key={assignee.id}
                      src={assignee.avatarUrl || ""}
                      alt={assignee.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full ring-2 ring-background"
                      style={{ zIndex: 10 - idx }}
                    />
                  ))}
                </div>
                {task.assignees.length > 3 && (
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    +{task.assignees.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 transition-all duration-300 cursor-pointer hover-lift"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task)
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 transition-all duration-300 cursor-pointer hover-lift"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
