import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, Calendar } from "lucide-react"

interface CommunicationListProps {
  type: "outgoing" | "incoming" | "templates"
}

export function CommunicationList({ type }: CommunicationListProps) {
  const getItems = () => {
    if (type === "outgoing") {
      return [
        {
          id: 1,
          title: "Appointment Reminder",
          recipient: "Emma Thompson",
          date: "Today, 9:30 AM",
          method: "SMS",
          status: "Sent",
          icon: MessageSquare,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
        },
        {
          id: 2,
          title: "Follow-up Call",
          recipient: "Michael Chen",
          date: "Today, 10:15 AM",
          method: "Phone",
          status: "Completed",
          icon: Phone,
          iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
        },
        {
          id: 3,
          title: "Appointment Rescheduling",
          recipient: "James Wilson",
          date: "Yesterday, 2:30 PM",
          method: "SMS",
          status: "Sent",
          icon: Calendar,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
        },
      ]
    } else if (type === "incoming") {
      return [
        {
          id: 1,
          title: "Appointment Question",
          sender: "Emma Thompson",
          date: "Today, 8:45 AM",
          method: "SMS",
          status: "Handled",
          icon: MessageSquare,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
        },
        {
          id: 2,
          title: "Medication Inquiry",
          sender: "Michael Chen",
          date: "Today, 9:20 AM",
          method: "Phone",
          status: "Escalated",
          icon: Phone,
          iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
        },
        {
          id: 3,
          title: "Insurance Question",
          sender: "James Wilson",
          date: "Yesterday, 1:15 PM",
          method: "SMS",
          status: "Handled",
          icon: MessageSquare,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
        },
      ]
    } else {
      return [
        {
          id: 1,
          title: "Appointment Reminder",
          type: "SMS Template",
          lastUsed: "Today",
          icon: MessageSquare,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
        },
        {
          id: 2,
          title: "Follow-up Call Script",
          type: "Call Template",
          lastUsed: "Yesterday",
          icon: Phone,
          iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
        },
        {
          id: 3,
          title: "Appointment Rescheduling",
          type: "SMS Template",
          lastUsed: "3 days ago",
          icon: Calendar,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
        },
      ]
    }
  }

  const items = getItems()

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border">
          <div className={`p-2 rounded-full ${item.iconColor}`}>
            <item.icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {type === "outgoing" && (
                    <>
                      <span className="text-xs text-muted-foreground">
                        To: {item.recipient} • {item.date}
                      </span>
                      <Badge variant="outline">{item.method}</Badge>
                      <Badge>{item.status}</Badge>
                    </>
                  )}
                  {type === "incoming" && (
                    <>
                      <span className="text-xs text-muted-foreground">
                        From: {item.sender} • {item.date}
                      </span>
                      <Badge variant="outline">{item.method}</Badge>
                      <Badge variant={item.status === "Escalated" ? "destructive" : "default"}>{item.status}</Badge>
                    </>
                  )}
                  {type === "templates" && (
                    <>
                      <Badge variant="outline">{item.type}</Badge>
                      <span className="text-xs text-muted-foreground">Last used: {item.lastUsed}</span>
                    </>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm">
                {type === "templates" ? "Use" : "View"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
