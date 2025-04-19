import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, MessageSquare, Phone } from "lucide-react"

export function PatientsList() {
  const patients = [
    {
      id: 1,
      name: "Emma Thompson",
      email: "emma.thompson@example.com",
      phone: "(555) 123-4567",
      nextAppointment: "Tomorrow, 10:00 AM",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ET",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "(555) 234-5678",
      nextAppointment: "In 3 days",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      email: "sophia.rodriguez@example.com",
      phone: "(555) 345-6789",
      nextAppointment: "Next week",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SR",
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "(555) 456-7890",
      nextAppointment: "None scheduled",
      status: "Inactive",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JW",
    },
    {
      id: 5,
      name: "Olivia Martinez",
      email: "olivia.martinez@example.com",
      phone: "(555) 567-8901",
      nextAppointment: "Tomorrow, 2:30 PM",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "OM",
    },
  ]

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div key={patient.id} className="flex items-start gap-4 p-4 rounded-lg border">
          <Avatar className="h-12 w-12">
            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
            <AvatarFallback>{patient.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{patient.name}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1">
                  <span className="text-xs text-muted-foreground">{patient.email}</span>
                  <span className="text-xs text-muted-foreground">{patient.phone}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{patient.nextAppointment}</span>
                  </div>
                  <Badge variant={patient.status === "Active" ? "default" : "outline"} className="w-fit">
                    {patient.status}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
