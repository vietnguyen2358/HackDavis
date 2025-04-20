"use client"

import { Suspense, lazy, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { PageHeader } from "@/components/page-header"
import { NewJobModal } from "@/components/new-job-modal"
import { UpcomingAIJobs } from "@/components/upcoming-ai-jobs"
import { WorkflowMetrics } from "@/components/workflow-metrics"
import { CardSkeleton, Skeleton, TableRowSkeleton } from "@/components/ui/skeleton"

// Lazy load components that aren't needed immediately
const RecentActivities = lazy(() => import("@/components/recent-activities").then(mod => ({ default: mod.RecentActivities })))
const UpcomingAppointments = lazy(() => import("@/components/upcoming-appointments").then(mod => ({ default: mod.UpcomingAppointments })))
const AutomationMetrics = lazy(() => import("@/components/automation-metrics").then(mod => ({ default: mod.AutomationMetrics })))

// Skeleton loaders for dashboard components
function MetricsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
      <div className="h-[200px] w-full bg-background-muted rounded-md flex items-center justify-center">
        <Skeleton className="h-[180px] w-[90%] rounded-md" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}

function ActivitiesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRowSkeleton key={i} columns={3} />
      ))}
    </div>
  )
}

function UpcomingJobsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-md p-3 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/2" />
          <div className="flex mt-2 justify-between items-center">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
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
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <CardSkeleton key={i} />
            ))}
          </div>
        }>
          <DashboardStats />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-screen-2xl mx-auto w-full">
        <Card className="w-full shadow-sm lg:col-span-2 card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">Weekly Workflow Activity</CardTitle>
            <CardDescription>Task completion and time saved metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<MetricsSkeleton />}>
              <WorkflowMetrics />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="w-full shadow-sm card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">AI Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<UpcomingJobsSkeleton />}>
              {mounted ? <UpcomingAIJobs /> : <UpcomingJobsSkeleton />}
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
          <Suspense fallback={<ActivitiesSkeleton />}>
            {mounted ? <RecentActivities /> : <ActivitiesSkeleton />}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
} 