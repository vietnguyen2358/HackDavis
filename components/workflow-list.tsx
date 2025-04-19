import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, MessageSquare, Phone, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface WorkflowListProps {
  status: "active" | "completed" | "template"
}

export function WorkflowList({ status }: WorkflowListProps) {
  // Different data based on status
  const getWorkflows = () => {
    if (status === "active") {
      return [
        {
          id: 1,
          name: "Patient Check-in: Emma Thompson",
          type: "Check-in",
          progress: 75,
          startTime: "10:30 AM",
          icon: User,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
        },
        {
          id: 2,
          name: "Appointment Scheduling: Michael Chen",
          type: "Scheduling",
          progress: 45,
          startTime: "11:15 AM",
          icon: Calendar,
          iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
        },
        {
          id: 3,
          name: "Documentation: Post-Surgery Notes",
          type: "Documentation",
          progress: 30,
          startTime: "12:00 PM",
          icon: FileText,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
        },
      ]
    } else if (status === "completed") {
      return [
        {
          id: 4,
          name: "Patient Follow-up: James Wilson",
          type: "Follow-up",
          completedTime: "Yesterday, 3:45 PM",
          duration: "12 min",
          icon: Phone,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
        },
        {
          id: 5,
          name: "Paperwork: Insurance Forms",
          type: "Paperwork",
          completedTime: "Yesterday, 2:30 PM",
          duration: "8 min",
          icon: FileText,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
        },
        {
          id: 6,
          name: "Appointment Reminders: Batch Send",
          type: "Communication",
          completedTime: "Yesterday, 10:15 AM",
          duration: "5 min",
          icon: MessageSquare,
          iconColor: "text-amber-500 bg-amber-100 dark:bg-amber-900",
        },
      ]
    } else {
      return [
        {
          id: 7,
          name: "New Patient Onboarding",
          type: "Template",
          estimatedTime: "15 min",
          lastUsed: "2 days ago",
          icon: User,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
        },
        {
          id: 8,
          name: "Monthly Check-up Reminder",
          type: "Template",
          estimatedTime: "5 min",
          lastUsed: "Yesterday",
          icon: Calendar,
          iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
        },
        {
          id: 9,
          name: "Insurance Verification",
          type: "Template",
          estimatedTime: "10 min",
          lastUsed: "3 days ago",
          icon: FileText,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
        },
      ]
    }
  }

  const workflows = getWorkflows()

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <div key={workflow.id} className="flex items-start gap-4 p-4 rounded-lg border">
          <div className={`p-2 rounded-full ${workflow.iconColor}`}>
            <workflow.icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{workflow.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{workflow.type}</Badge>
                  {status === "active" && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> Started {workflow.startTime}
                    </span>
                  )}
                  {status === "completed" && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {workflow.completedTime} • {workflow.duration}
                    </span>
                  )}
                  {status === "template" && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> Est. {workflow.estimatedTime} • Last used {workflow.lastUsed}
                    </span>
                  )}
                </div>
              </div>
              {status === "active" && (
                <Button variant="outline" size="sm">
                  View
                </Button>
              )}
              {status === "completed" && (
                <Button variant="outline" size="sm">
                  Details
                </Button>
              )}
              {status === "template" && (
                <Button variant="outline" size="sm">
                  Use
                </Button>
              )}
            </div>
            {status === "active" && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{workflow.progress}%</span>
                </div>
                <Progress value={workflow.progress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
