import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/db"
import Transcription from "@/lib/models/transcription"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TranscriptionViewer } from "@/components/transcription-viewer"

interface PageProps {
  params: {
    id: string
  }
}

async function getTranscriptionData(id: string) {
  try {
    await connectToDatabase()
    const transcription = await Transcription.findById(id)
    
    if (!transcription) {
      return null
    }
    
    return JSON.parse(JSON.stringify(transcription))
  } catch (error) {
    console.error("Error fetching transcription:", error)
    return null
  }
}

export default async function ViewTranscriptionPage({ params }: PageProps) {
  const transcription = await getTranscriptionData(params.id)
  
  if (!transcription) {
    notFound()
  }
  
  const formattedDate = new Date(transcription.createdAt).toLocaleString()
  
  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title={transcription.title}
        description={`Patient ID: ${transcription.patientId} • ${formattedDate}`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/documentation">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/api/transcriptions/${params.id}/pdf`} target="_blank">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Link>
            </Button>
          </div>
        }
      />
      
      <div className="flex items-center gap-2">
        <Badge>{transcription.duration}</Badge>
        <Badge variant="outline">Transcription</Badge>
      </div>
      
      <Tabs defaultValue="transcription" className="w-full">
        <TabsList>
          <TabsTrigger value="transcription">Transcription</TabsTrigger>
          <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcription">
          <Card>
            <CardHeader>
              <CardTitle>Live Transcription</CardTitle>
              <CardDescription>Full transcript of the recorded conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <TranscriptionViewer content={transcription.transcription} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
              <CardDescription>AI-generated clinical notes from the conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <TranscriptionViewer content={transcription.notes} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 