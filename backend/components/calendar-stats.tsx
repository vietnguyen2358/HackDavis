import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, UserCheck, UserX } from "lucide-react"

export function CalendarStats() {
  const stats = [
    {
      title: "Today's Appointments",
      value: "12",
      icon: Calendar,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Filled Cancellations",
      value: "3",
      icon: UserCheck,
      color: "text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "No-Shows Prevented",
      value: "5",
      icon: UserX,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-900 dark:text-amber-300",
    },
    {
      title: "Hours Optimized",
      value: "8.5",
      icon: Clock,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-900 dark:text-purple-300",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
