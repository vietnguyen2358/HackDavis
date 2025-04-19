import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PhoneIncoming, PhoneOutgoing, FileText } from "lucide-react"

interface CallsListProps {
  type: "recent" | "scheduled" | "transcripts"
}

export function CallsList({ type }: CallsListProps) {
  const getItems = () => {
    if (type === "recent") {
      return [
        {
          id: 1,
          name: "Emma Thompson",
          time: "Today, 10:30 AM",
          duration: "4:12",
          type: "Incoming",
          status: "Completed",
          icon: PhoneIncoming,
          iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "ET",
        },
        {
          id: 2,
          name: "Michael Chen",
          time: "Today, 9:15 AM",
          duration: "2:45",
          type: "Outgoing",
          status: "Completed",
          icon: PhoneOutgoing,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "MC",
        },
        {
          id: 3,
          name: "James Wilson",
          time: "Yesterday, 2:45 PM",
          duration: "5:30",
          type: "Incoming",
          status: "Escalated",
          icon: PhoneIncoming,
          iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "JW",
        },
      ]
    } else if (type === "scheduled") {
      return [
        {
          id: 1,
          name: "Emma Thompson",
          time: "Tomorrow, 10:30 AM",
          purpose: "Appointment Reminder",
          type: "Outgoing",
          icon: PhoneOutgoing,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "ET",
        },
        {
          id: 2,
          name: "Michael Chen",
          time: "Tomorrow, 2:15 PM",
          purpose: "Follow-up",
          type: "Outgoing",
          icon: PhoneOutgoing,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "MC",
        },
        {
          id: 3,
          name: "Sophia Rodriguez",
          time: "In 2 days, 11:00 AM",
          purpose: "Medication Check",
          type: "Outgoing",
          icon: PhoneOutgoing,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "SR",
        },
      ]
    } else {
      return [
        {
          id: 1,
          name: "Emma Thompson",
          time: "Today, 10:30 AM",
          duration: "4:12",
          type: "Transcript",
          icon: FileText,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "ET",
        },
        {
          id: 2,
          name: "Michael Chen",
          time: "Today, 9:15 AM",
          duration: "2:45",
          type: "Transcript",
          icon: FileText,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "MC",
        },
        {
          id: 3,
          name: "James Wilson",
          time: "Yesterday, 2:45 PM",
          duration: "5:30",
          type: "Transcript",
          icon: FileText,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "JW",
        },
      ]
    }
  }

  const items = getItems()

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.name} />
              <AvatarFallback>{item.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{item.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{item.time}</span>
                {type === "recent" && (
                  <>
                    <Badge variant="outline">{item.duration}</Badge>
                    <Badge variant={item.status === "Escalated" ? "destructive" : "default"}>{item.status}</Badge>
                  </>
                )}
                {type === "scheduled" && <Badge variant="outline">{item.purpose}</Badge>}
                {type === "transcripts" && <Badge variant="outline">{item.duration}</Badge>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${item.iconColor}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <Button variant="outline" size="sm">
              {type === "scheduled" ? "Edit" : "View"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
