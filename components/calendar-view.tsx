"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

// Interface matching the appointment structure in JSON/API
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName?: string;
  doctorName?: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
}

// Helper to format YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch appointments when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return

    const fetchAppointments = async () => {
      setLoading(true)
      setError(null)
      try {
        const dateString = formatDate(selectedDate)
        // Fetch appointments for the selected date
        const response = await fetch(`/api/appointments?date=${dateString}`)
        if (!response.ok) {
          throw new Error("Failed to fetch appointments for the selected date")
        }
        const data = await response.json()
        setAppointments(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching appointments:", err)
        setError(err instanceof Error ? err.message : "Failed to load appointments")
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [selectedDate]) // Re-fetch when selectedDate changes

  // Function to handle date selection from the calendar
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  // Function to change date using buttons
  const changeDate = (days: number) => {
    setSelectedDate(prevDate => {
      if (!prevDate) return new Date()
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + days)
      return newDate
    })
  }

  // Get initials for AvatarFallback
  const getInitials = (name?: string) => {
    return name ? name.split(' ').map(n => n[0]).join('') : '?'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-4 md:col-span-1">
        <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} className="rounded-md border" />

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

      <Card className="p-4 md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {error && (
          <div className="p-4 text-red-500 text-center">Error: {error}</div>
        )}
        {!loading && !error && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-center text-muted-foreground">No appointments scheduled for this date.</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(appointment.patientName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.patientName || "Unknown Patient"}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time} - {appointment.type}
                      </p>
                      {appointment.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {appointment.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
