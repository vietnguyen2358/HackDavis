import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageHeaderProps {
  title: string
  description: string
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>
      {actions && (
        <div className="flex-shrink-0 mt-3 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  )
}
