import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function UpcomingAppointments() {
  const appointments = [
    {
      id: 1,
      patientName: "Emma Thompson",
      time: "10:00 AM",
      type: "Check-up",
      status: "Confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ET",
    },
    {
      id: 2,
      patientName: "Michael Chen",
      time: "11:30 AM",
      type: "Follow-up",
      status: "Pending",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    {
      id: 3,
      patientName: "Sophia Rodriguez",
      time: "1:15 PM",
      type: "Consultation",
      status: "Confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SR",
    },
    {
      id: 4,
      patientName: "James Wilson",
      time: "2:45 PM",
      type: "Check-up",
      status: "Confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JW",
    },
  ]

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.patientName} />
              <AvatarFallback>{appointment.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{appointment.patientName}</p>
              <p className="text-sm text-muted-foreground">
                {appointment.time} - {appointment.type}
              </p>
            </div>
          </div>
          <Badge variant={appointment.status === "Confirmed" ? "default" : "outline"}>{appointment.status}</Badge>
        </div>
      ))}
    </div>
  )
}
