import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivities } from "@/components/recent-activities"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import { AutomationMetrics } from "@/components/automation-metrics"
import { PageHeader } from "@/components/page-header"
import { NewJobModal } from "@/components/new-job-modal"

export default function Dashboard() {
  return (
    <div className="flex flex-col p-6 space-y-6 w-full max-w-full">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your clinic's performance and AI automation metrics"
        actions={<NewJobModal />}
      />

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Card className="w-full shadow-sm">
          <CardHeader>
            <CardTitle>Automation Metrics</CardTitle>
            <CardDescription>Time saved through AI automation</CardDescription>
          </CardHeader>
          <CardContent>
            <AutomationMetrics />
          </CardContent>
        </Card>

        <Card className="w-full shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Next 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingAppointments />
          </CardContent>
        </Card>
      </div>

      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest automated workflows and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivities />
        </CardContent>
      </Card>
    </div>
  )
}
