import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientsList } from "@/components/patients-list"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function PatientsPage() {
  return (
    <div className="flex flex-col p-6 space-y-6 bg-background mobile-nav-spacing">
      <PageHeader
        title="Patients"
        description="Manage patient records and interactions"
        actions={
          <Button asChild>
            <Link href="/new-job">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Patient
            </Link>
          </Button>
        }
      />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search patients..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Sort</Button>
      </div>

      <Card className="border-muted/50 shadow-sm">
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>View and manage patient information</CardDescription>
        </CardHeader>
        <CardContent>
          <PatientsList />
        </CardContent>
      </Card>
    </div>
  )
}
