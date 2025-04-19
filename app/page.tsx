import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivities } from "@/components/recent-activities"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import { AutomationMetrics } from "@/components/automation-metrics"
import { PageHeader } from "@/components/page-header"

export default function Dashboard() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader title="Dashboard" description="Overview of your clinic's performance and AI automation metrics" />

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automation Metrics</CardTitle>
            <CardDescription>Time saved through AI automation</CardDescription>
          </CardHeader>
          <CardContent>
            <AutomationMetrics />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Next 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingAppointments />
          </CardContent>
        </Card>
      </div>

      <Card>
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
