import { Calendar, FileText, MessageSquare, Phone } from "lucide-react"

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      type: "Call Transcription",
      description: "AI transcribed call with patient John Doe",
      time: "10 minutes ago",
      icon: Phone,
      iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
    },
    {
      id: 2,
      type: "Appointment Scheduled",
      description: "AI scheduled follow-up for Emma Thompson",
      time: "25 minutes ago",
      icon: Calendar,
      iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
    },
    {
      id: 3,
      type: "Documentation Completed",
      description: "AI completed paperwork for Michael Chen",
      time: "1 hour ago",
      icon: FileText,
      iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
    },
    {
      id: 4,
      type: "Patient Reminder",
      description: "AI sent appointment reminder to 12 patients",
      time: "2 hours ago",
      icon: MessageSquare,
      iconColor: "text-amber-500 bg-amber-100 dark:bg-amber-900",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border">
          <div className={`p-2 rounded-full ${activity.iconColor}`}>
            <activity.icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{activity.type}</p>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
