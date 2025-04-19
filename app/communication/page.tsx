import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunicationList } from "@/components/communication-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { CommunicationStats } from "@/components/communication-stats"

export default function CommunicationPage() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Patient Communication"
        description="AI-powered patient engagement and follow-ups"
        actions={
          <Button asChild>
            <Link href="/new-job">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Communication
            </Link>
          </Button>
        }
      />

      <CommunicationStats />

      <Tabs defaultValue="outgoing" className="w-full">
        <TabsList>
          <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="outgoing">
          <Card>
            <CardHeader>
              <CardTitle>Outgoing Communications</CardTitle>
              <CardDescription>Automated messages and calls to patients</CardDescription>
            </CardHeader>
            <CardContent>
              <CommunicationList type="outgoing" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="incoming">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Communications</CardTitle>
              <CardDescription>Patient messages and calls handled by AI</CardDescription>
            </CardHeader>
            <CardContent>
              <CommunicationList type="incoming" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Communication Templates</CardTitle>
              <CardDescription>Reusable templates for patient communications</CardDescription>
            </CardHeader>
            <CardContent>
              <CommunicationList type="templates" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
