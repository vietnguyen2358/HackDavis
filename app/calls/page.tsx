import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CallsList } from "@/components/calls-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { CallStats } from "@/components/call-stats"
import { CallSimulator } from "@/components/call-simulator"

export default function CallsPage() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Call Center"
        description="AI-powered call management and transcription"
        actions={
          <Button asChild>
            <Link href="/new-job">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Call
            </Link>
          </Button>
        }
      />

      <CallStats />

      <Card>
        <CardHeader>
          <CardTitle>Call Simulator</CardTitle>
          <CardDescription>Simulate an AI-handled patient call</CardDescription>
        </CardHeader>
        <CardContent>
          <CallSimulator />
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Calls</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Calls</TabsTrigger>
          <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>Recently handled patient calls</CardDescription>
            </CardHeader>
            <CardContent>
              <CallsList type="recent" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Calls</CardTitle>
              <CardDescription>Upcoming automated patient calls</CardDescription>
            </CardHeader>
            <CardContent>
              <CallsList type="scheduled" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transcripts">
          <Card>
            <CardHeader>
              <CardTitle>Call Transcripts</CardTitle>
              <CardDescription>Transcribed patient conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <CallsList type="transcripts" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
