import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarView } from "@/components/calendar-view"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { CalendarStats } from "@/components/calendar-stats"

export default function CalendarPage() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Calendar Management"
        description="AI-powered appointment scheduling and optimization"
        actions={
          <Button asChild>
            <Link href="/new-job">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Appointment
            </Link>
          </Button>
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
