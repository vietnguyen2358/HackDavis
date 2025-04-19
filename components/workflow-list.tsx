"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, MessageSquare, Phone, User, ClipboardList } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useDataFetch } from "@/hooks/use-data-fetch"
import { memo, useMemo } from "react"
import { CardSkeleton, Skeleton } from "@/components/ui/skeleton"

interface WorkflowListProps {
  status: "active" | "completed" | "template"
}

// Mock data for demonstration - in a real app, this would come from the API
const mockData = {
  active: [
    {
      id: 1,
      name: "Patient Check-in: Emma Thompson",
      type: "Check-in",
      progress: 75,
      startTime: "10:30 AM",
      icon: "User",
      iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
    },
    {
      id: 2,
      name: "Appointment Scheduling: Michael Chen",
      type: "Scheduling",
      progress: 45,
      startTime: "11:15 AM",
      icon: "Calendar",
      iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
    },
    {
      id: 3,
      name: "Documentation: Post-Surgery Notes",
      type: "Documentation",
      progress: 30,
      startTime: "12:00 PM",
      icon: "FileText",
      iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
    },
  ],
  completed: [
    {
      id: 4,
      name: "Patient Follow-up: James Wilson",
      type: "Follow-up",
      completedTime: "Yesterday, 3:45 PM",
      duration: "12 min",
      icon: "Phone",
      iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
    },
    {
      id: 5,
      name: "Paperwork: Insurance Forms",
      type: "Paperwork",
      completedTime: "Yesterday, 2:30 PM",
      duration: "8 min",
      icon: "FileText",
      iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
    },
    {
      id: 6,
      name: "Appointment Reminders: Batch Send",
      type: "Communication",
      completedTime: "Yesterday, 10:15 AM",
      duration: "5 min",
      icon: "MessageSquare",
      iconColor: "text-amber-500 bg-amber-100 dark:bg-amber-900",
    },
  ],
  template: [
    {
      id: 7,
      name: "New Patient Onboarding",
      type: "Template",
      estimatedTime: "15 min",
      lastUsed: "2 days ago",
      icon: "User",
      iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
    },
    {
      id: 8,
      name: "Monthly Check-up Reminder",
      type: "Template",
      estimatedTime: "5 min",
      lastUsed: "Yesterday",
      icon: "Calendar",
      iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
    },
    {
      id: 9,
      name: "Insurance Verification",
      type: "Template",
      estimatedTime: "10 min",
      lastUsed: "3 days ago",
      icon: "FileText",
      iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
    },
  ]
};

// A map to convert string icon names to the actual component
const iconMap = {
  User,
  Calendar,
  FileText,
  MessageSquare,
  Phone
};

const WorkflowItem = memo(({ workflow, status }: { 
  workflow: any, 
  status: "active" | "completed" | "template" 
}) => {
  // Get the icon component from the map
  const IconComponent = iconMap[workflow.icon as keyof typeof iconMap];
  
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border">
      <div className={`p-2 rounded-full ${workflow.iconColor}`}>
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{workflow.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{workflow.type}</Badge>
              {status === "active" && (
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> Started {workflow.startTime}
                </span>
              )}
              {status === "completed" && (
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> {workflow.completedTime} • {workflow.duration}
                </span>
              )}
              {status === "template" && (
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> Est. {workflow.estimatedTime} • Last used {workflow.lastUsed}
                </span>
              )}
            </div>
          </div>
          {status === "active" && (
            <Button variant="outline" size="sm">
              View
            </Button>
          )}
          {status === "completed" && (
            <Button variant="outline" size="sm">
              Details
            </Button>
          )}
          {status === "template" && (
            <Button variant="outline" size="sm">
              Use
            </Button>
          )}
        </div>
        {status === "active" && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{workflow.progress}%</span>
            </div>
            <Progress value={workflow.progress} className="h-2" />
          </div>
        )}
      </div>
    </div>
  );
});

WorkflowItem.displayName = 'WorkflowItem';

export function WorkflowList({ status }: WorkflowListProps) {
  // In a real app, we would fetch from an API endpoint
  // For demo purposes, using our mockData but simulating with our data fetch hook
  const apiUrl = useMemo(() => `/api/workflows/${status}`, [status]);
  
  // Using our new data fetch hook with mock data for demonstration
  const { data, isLoading, error } = useDataFetch(
    null, // We're not actually fetching in this example
    { 
      initialData: mockData[status],
      cacheTime: 5 * 60 * 1000, // 5 minutes cache
      refetchOnWindowFocus: true,
    }
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <div className="flex items-start gap-4 p-4">
              <Skeleton variant="circular" className="h-10 w-10" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="h-5 w-3/4" />
                <div className="flex gap-2 items-center">
                  <Skeleton variant="rounded" className="h-6 w-20" />
                  <Skeleton variant="text" className="h-4 w-32" />
                </div>
                {status === "active" && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between">
                      <Skeleton variant="text" className="h-3 w-16" />
                      <Skeleton variant="text" className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                )}
              </div>
              <Skeleton variant="rounded" className="h-9 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-destructive border border-destructive/20 rounded-lg bg-destructive/5">
        <p className="font-medium mb-1">Failed to load workflows</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  // If no data
  if (!data || data.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center border rounded-lg text-center">
        <div className="p-3 bg-primary/5 rounded-full mb-3">
          <ClipboardList className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-medium mb-1">No workflows found</h3>
        <p className="text-sm text-muted-foreground mb-4">There are no {status} workflows at the moment.</p>
        <Button size="sm" variant="outline">Create Workflow</Button>
      </div>
    );
  }

  // Render workflows
  return (
    <div className="space-y-4">
      {data.map((workflow: any) => (
        <WorkflowItem 
          key={workflow.id} 
          workflow={workflow} 
          status={status} 
        />
      ))}
    </div>
  );
}
