"use client"

import { Suspense, lazy } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { PageHeader } from "@/components/page-header"
import { NewJobModal } from "@/components/new-job-modal"
import { UpcomingAIJobs } from "@/components/upcoming-ai-jobs"
import { WorkflowMetrics } from "@/components/workflow-metrics"
// Lazy load components that aren't needed immediately
const RecentActivities = lazy(() => import("@/components/recent-activities").then(mod => ({ default: mod.RecentActivities })))
const UpcomingAppointments = lazy(() => import("@/components/upcoming-appointments").then(mod => ({ default: mod.UpcomingAppointments })))
const AutomationMetrics = lazy(() => import("@/components/automation-metrics").then(mod => ({ default: mod.AutomationMetrics })))

export default function Dashboard() {
  return (
    <div className="flex flex-col p-4 md:p-6 lg:p-8 space-y-8 w-full max-w-full mobile-nav-spacing">
      <div className="max-w-screen-2xl mx-auto w-full">
        <PageHeader 
          title="Dashboard" 
          description="Overview of your clinic's performance and AI automation metrics"
          actions={<NewJobModal />}
        />
      </div>

      <div className="max-w-screen-2xl mx-auto w-full">
        <DashboardStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-screen-2xl mx-auto w-full">
        <Card className="w-full shadow-sm lg:col-span-2 card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">Weekly Workflow Activity</CardTitle>
            <CardDescription>Task completion and time saved metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading metrics...</div>}>
              <WorkflowMetrics />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="w-full shadow-sm card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">Upcoming AI Jobs</CardTitle>
            <CardDescription>Next 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading upcoming AI jobs...</div>}>
              <UpcomingAIJobs />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full shadow-sm max-w-screen-2xl mx-auto card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Recent Activities</CardTitle>
          <CardDescription>Latest automated workflows and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading recent activities...</div>}>
            <RecentActivities />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
} 