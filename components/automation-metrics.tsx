"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function AutomationMetrics() {
  const data = [
    {
      name: "Patient Check-ins",
      hours: 24,
    },
    {
      name: "Appointment Scheduling",
      hours: 32,
    },
    {
      name: "Documentation",
      hours: 18,
    },
    {
      name: "Follow-ups",
      hours: 16,
    },
    {
      name: "Paperwork",
      hours: 38,
    },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
          <Tooltip formatter={(value) => [`${value} hours`, "Time Saved"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
          <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
