import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarView } from "@/components/calendar-view"
import { NewUpcomingAppointmentModal } from "@/components/new-upcoming-appointment-modal";
import Link from "next/link"
import { CalendarStats } from "@/components/calendar-stats"
import { UpcomingAppointments } from "@/components/UpcomingAppointments"

export default function CalendarPage() {
  return (
    <div className="flex flex-col p-4 md:p-6 space-y-6 w-full max-w-full mobile-nav-spacing">
      <PageHeader
        title="Calendar Management"
        description="AI-powered appointment scheduling and optimization"
        actions={
          <NewUpcomingAppointmentModal />
        }
      />

      <CalendarStats />

      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Appointment Calendar</CardTitle>
            <CardDescription>View and manage upcoming appointments</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Week</Button>
            <Button variant="outline" size="sm">Month</Button>
            <Button variant="default" size="sm">Day</Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto">
          <CalendarView />
        </CardContent>
      </Card>
    </div>
  )
}
