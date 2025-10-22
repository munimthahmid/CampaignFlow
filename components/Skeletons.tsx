export function TaskCardSkeleton() {
  return (
    <div className="bg-card rounded-lg p-4 border border-border space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-muted rounded-full" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-muted rounded w-16" />
        <div className="h-5 bg-muted rounded w-16" />
      </div>
    </div>
  )
}

export function ColumnSkeleton() {
  return (
    <div className="flex-shrink-0 w-80 space-y-3">
      <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[...Array(4)].map((_, i) => (
        <ColumnSkeleton key={i} />
      ))}
    </div>
  )
}
