"use client"

import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function WorkflowMetrics() {
  const data = [
    {
      name: "Mon",
      tasks: 24,
      time: 12,
    },
    {
      name: "Tue",
      tasks: 18,
      time: 9,
    },
    {
      name: "Wed",
      tasks: 32,
      time: 16,
    },
    {
      name: "Thu",
      tasks: 26,
      time: 13,
    },
    {
      name: "Fri",
      tasks: 42,
      time: 21,
    },
    {
      name: "Sat",
      tasks: 16,
      time: 8,
    },
    {
      name: "Sun",
      tasks: 12,
      time: 6,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 col-span-3">
      <h3 className="text-sm font-medium mb-1">Weekly Workflow Activity</h3>
<div className="h-[400px] w-full">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart 
      data={data}
      margin={{ top: 10, right: 20, left: 5, bottom: 5 }}
    >
      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip
                formatter={(value, name) => [value, name === "tasks" ? "Tasks" : "Hours Saved"]}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Tasks"
              />
              <Line
                type="monotone"
                dataKey="time"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Hours Saved"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
