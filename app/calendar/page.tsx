import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarView } from "@/components/calendar-view"
import { NewUpcomingAppointmentModal } from "@/components/new-upcoming-appointment-modal";
import Link from "next/link"
import { CalendarStats } from "@/components/calendar-stats"
import { UpcomingAppointments } from "@/components/UpcomingAppointments"

export default function CalendarPage() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Calendar Management"
        description="AI-powered appointment scheduling and optimization"
        actions={
          <NewUpcomingAppointmentModal />
        }
      />

      <CalendarStats />

      

      <Card>
        <CardHeader>
          <CardTitle>Appointment Calendar</CardTitle>
          <CardDescription>View and manage upcoming appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>
    </div>
  )
}
