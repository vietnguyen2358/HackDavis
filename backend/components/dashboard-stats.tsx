import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList, Clock, MessageSquare, Users } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Total Patients",
      value: "1,284",
      description: "+12% from last month",
      icon: Users,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Hours Saved",
      value: "128",
      description: "This month through automation",
      icon: Clock,
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "Automated Tasks",
      value: "842",
      description: "Completed this month",
      icon: ClipboardList,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      title: "Patient Engagements",
      value: "356",
      description: "Automated communications",
      icon: MessageSquare,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
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
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
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
