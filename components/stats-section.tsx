"use client"

import { CountNumber } from "@/components/ui/animated"

type Stat = {
  id: string
  label: string
  value: number
  prefix?: string
  suffix?: string
}

export function StatsSection({
  stats,
  className = "",
}: {
  stats: Stat[]
  className?: string
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ${className}`}>
      {stats.map((stat) => (
        <div 
          key={stat.id}
          className="backdrop-blur-md bg-white/5 dark:bg-gray-900/20 
            border border-white/10 dark:border-gray-800/30 rounded-xl p-6
            flex flex-col items-start space-y-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <CountNumber
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            className="font-tiempos text-4xl md:text-5xl font-sf font-bold text-primary"
          />
          <span className="text-base text-muted-foreground font-medium">{stat.label}</span>
        </div>
      ))}
    </div>
  )
} 