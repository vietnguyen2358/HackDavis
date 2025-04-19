import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  animated?: boolean
  variant?: "default" | "rounded" | "circular" | "text"
}

export function Skeleton({ 
  className, 
  animated = true, 
  variant = "default",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-primary/5 dark:bg-primary/10",
        animated && "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.8s_infinite] after:bg-gradient-to-r after:from-transparent after:via-primary/10 after:to-transparent",
        variant === "default" && "rounded-md",
        variant === "rounded" && "rounded-full",
        variant === "circular" && "rounded-full aspect-square",
        variant === "text" && "h-4 w-full max-w-[16rem] rounded-sm",
        className
      )}
      {...props}
    />
  )
}

// Specialized skeleton loaders
export function CardSkeleton() {
  return (
    <div className="p-6 border rounded-lg shadow-sm space-y-4">
      <Skeleton variant="text" className="h-7 w-3/4" />
      <Skeleton variant="text" className="h-4 w-1/2" />
      <div className="pt-4 space-y-3">
        <Skeleton className="h-28 w-full" />
        <div className="flex justify-between gap-4">
          <Skeleton variant="text" className="h-4 w-1/3" />
          <Skeleton variant="rounded" className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}

export function UserSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3">
      <Skeleton variant="circular" className="h-10 w-10" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-32" />
        <Skeleton variant="text" className="h-3 w-24" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-3">
      {Array(columns).fill(null).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={`h-4 ${index === 0 ? 'w-16' : index === columns - 1 ? 'w-24 ml-auto' : 'w-full'}`}
        />
      ))}
    </div>
  )
}
