import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentationList } from "@/components/documentation-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { LiveTranscription } from "@/components/live-transcription"

export default function DocumentationPage() {
  return (
    <div className="flex flex-col p-6 space-y-6 bg-background mobile-nav-spacing">
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

      <Card className="border-muted/50">
        <CardHeader>
          <CardTitle>Transcriptions</CardTitle>
          <CardDescription>All transcriptions sorted by date (newest first)</CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentationList />
        </CardContent>
      </Card>
    </div>
  )
}
