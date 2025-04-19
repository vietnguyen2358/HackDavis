import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, FileText, MessageSquare, Phone, User } from "lucide-react"

export function UpcomingAIJobs() {
  const jobs = [
    {
      id: 1,
      name: "Patient Check-in: Emma Thompson",
      type: "Check-in",
      progress: 75,
      startTime: "10:30 AM",
      status: "In Progress",
      icon: User,
      iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
    },
    {
      id: 2,
      name: "Appointment Scheduling: Michael Chen",
      type: "Scheduling",
      progress: 45,
      startTime: "11:15 AM",
      status: "In Progress",
      icon: Calendar,
      iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
    },
    {
      id: 3,
      name: "Documentation: Post-Surgery Notes",
      type: "Documentation",
      progress: 30,
      startTime: "12:00 PM",
      status: "In Progress",
      icon: FileText,
      iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
    },
    {
      id: 4,
      name: "Patient Follow-up: James Wilson",
      type: "Follow-up",
      progress: 0,
      startTime: "2:30 PM",
      status: "Upcoming",
      icon: Phone,
      iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
    },
  ]

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${job.iconColor}`}>
              <job.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{job.name}</p>
              <p className="text-sm text-muted-foreground">
                {job.startTime} - {job.type}
              </p>
              {job.progress > 0 && (
                <Progress value={job.progress} className="w-32 h-1 mt-1" />
              )}
            </div>
          </div>
          <Badge variant={job.status === "In Progress" ? "default" : "outline"}>
            {job.status}
          </Badge>
        </div>
      ))}
    </div>
  )
} 