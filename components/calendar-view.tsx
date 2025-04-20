"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Sample appointments data
  const appointments = [
    {
      id: 1,
      patientName: "Emma Thompson",
      time: "10:00 AM",
      type: "Check-up",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ET",
    },
    {
      id: 2,
      patientName: "Michael Chen",
      time: "11:30 AM",
      type: "Follow-up",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    {
      id: 3,
      patientName: "Sophia Rodriguez",
      time: "1:15 PM",
      type: "Consultation",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SR",
    },
    {
      id: 4,
      patientName: "James Wilson",
      time: "2:45 PM",
      type: "Check-up",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JW",
    },
    {
      id: 5,
      patientName: "Olivia Martinez",
      time: "4:00 PM",
      type: "Follow-up",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "OM",
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* Calendar Card - make it full width on smaller screens */}
      <Card className="p-4 lg:col-span-1 overflow-hidden">
        <div className="flex justify-center">
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={setDate} 
            className="max-w-full overflow-x-auto rounded-md border" 
          />
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Appointment Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Check-up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Follow-up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm">Consultation</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Appointments Card */}
      <Card className="p-4 lg:col-span-2 overflow-hidden">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-lg font-medium">
            {date?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)]">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="flex items-center justify-between p-3 rounded-lg border flex-wrap gap-3 sm:flex-nowrap"
            >
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
              <div className="flex items-center gap-2 ml-auto">
                <Badge
                  className={
                    appointment.type === "Check-up"
                      ? "bg-blue-500"
                      : appointment.type === "Follow-up"
                        ? "bg-green-500"
                        : "bg-purple-500"
                  }
                >
                  {appointment.type}
                </Badge>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
