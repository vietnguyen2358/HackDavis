import { PageHeader } from "@/components/page-header"
import { NewJobForm } from "@/components/new-job-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewJobPage() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader title="Create New Job" description="Create a new automated task for the AI assistant" />

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Fill in the details for the new automated task</CardDescription>
        </CardHeader>
        <CardContent>
          <NewJobForm />
        </CardContent>
      </Card>
    </div>
  )
}
