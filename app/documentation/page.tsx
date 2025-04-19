import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentationList } from "@/components/documentation-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { LiveTranscription } from "@/components/live-transcription"

export default function DocumentationPage() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Documentation Support"
        description="AI-powered transcription and note-taking"
        actions={
          <Button asChild>
            <Link href="/new-job">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Transcription
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Live Transcription & Notes</CardTitle>
          <CardDescription>Record and transcribe patient consultations in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <LiveTranscription />
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Transcriptions</TabsTrigger>
          <TabsTrigger value="notes">Generated Notes</TabsTrigger>
          <TabsTrigger value="forms">Completed Forms</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transcriptions</CardTitle>
              <CardDescription>Recently transcribed patient conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentationList type="transcription" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Generated Notes</CardTitle>
              <CardDescription>AI-generated clinical notes from conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentationList type="notes" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="forms">
          <Card>
            <CardHeader>
              <CardTitle>Completed Forms</CardTitle>
              <CardDescription>Forms and paperwork automatically filled by AI</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentationList type="forms" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
