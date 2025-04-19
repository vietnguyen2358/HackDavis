import { Card, CardContent } from "@/components/ui/card"
import { PhoneCall, PhoneIncoming, PhoneOutgoing, Clock } from "lucide-react"

export function CallStats() {
  const stats = [
    {
      title: "Total Calls",
      value: "128",
      icon: PhoneCall,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Incoming Calls",
      value: "76",
      icon: PhoneIncoming,
      color: "text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "Outgoing Calls",
      value: "52",
      icon: PhoneOutgoing,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-900 dark:text-amber-300",
    },
    {
      title: "Average Duration",
      value: "4:12",
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
