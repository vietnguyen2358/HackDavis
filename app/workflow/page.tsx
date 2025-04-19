import { PageHeader } from "@/components/page-header"
import { WorkflowList } from "@/components/workflow-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkflowMetrics } from "@/components/workflow-metrics"

export default function WorkflowPage() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Workflow Automation"
        description="Manage and monitor automated workflows"
        actions={
          <Button asChild>
            <Link href="/new-job">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Workflow
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Workflow Metrics</CardTitle>
          <CardDescription>Performance and efficiency metrics for automated workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkflowMetrics />
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Workflows</CardTitle>
              <CardDescription>Currently running automated tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkflowList status="active" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Workflows</CardTitle>
              <CardDescription>Recently completed automated tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkflowList status="completed" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>Reusable workflow templates for common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkflowList status="template" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
