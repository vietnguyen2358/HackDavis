"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Play, Square } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TranscriptionDemo() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [notes, setNotes] = useState("")

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // Simulate transcription with a timer
      let progress = 0
      const transcriptParts = [
        "Doctor: Hello Mrs. Johnson, how are you feeling today?",
        "\nPatient: I've been having some pain in my lower back for the past week.",
        "\nDoctor: I see. Can you describe the pain? Is it sharp or dull?",
        "\nPatient: It's more of a dull ache, but it gets worse when I bend over.",
        "\nDoctor: And does the pain radiate to other areas?",
        "\nPatient: Sometimes down my left leg.",
        "\nDoctor: Have you taken any medication for it?",
        "\nPatient: Just some over-the-counter ibuprofen, but it only helps a little.",
        "\nDoctor: I'd like to examine your back. We might need to order an MRI to get a better look.",
      ]

      const noteParts = [
        "SUBJECTIVE:\n- Patient reports lower back pain for 1 week",
        "\n- Pain described as dull ache",
        "\n- Pain worsens with bending",
        "\n- Radiation of pain down left leg",
        "\n- Minimal relief with OTC ibuprofen",
        "\n\nOBJECTIVE:\n- Examination of lower back pending",
        "\n\nASSESSMENT:\n- Suspected lumbar radiculopathy",
        "\n\nPLAN:\n- Consider MRI of lumbar spine",
        "\n- Evaluate for physical therapy referral",
        "\n- Follow-up in 2 weeks",
      ]

      const interval = setInterval(() => {
        if (progress < transcriptParts.length) {
          setTranscription((prev) => prev + transcriptParts[progress])
          progress++
        } else {
          clearInterval(interval)
        }
      }, 1000)

      // Simulate note generation
      let noteProgress = 0
      setTimeout(() => {
        const noteInterval = setInterval(() => {
          if (noteProgress < noteParts.length) {
            setNotes((prev) => prev + noteParts[noteProgress])
            noteProgress++
          } else {
            clearInterval(noteInterval)
          }
        }, 1000)
      }, 3000)
    } else {
      // Reset for demo purposes
      setTranscription("")
      setNotes("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={isRecording ? "destructive" : "default"} size="sm" onClick={toggleRecording}>
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Demo
              </>
            )}
          </Button>

          {isRecording && (
            <Badge variant="outline" className="animate-pulse flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              Recording
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled={!isRecording}>
            <Mic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled={!isRecording}>
            <MicOff className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2">Live Transcription</h3>
          <div className="h-[300px] overflow-y-auto border rounded-md p-3 bg-muted/30">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {transcription || "Transcription will appear here..."}
            </pre>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2">Generated Clinical Notes</h3>
          <div className="h-[300px] overflow-y-auto border rounded-md p-3 bg-muted/30">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {notes || "AI-generated notes will appear here..."}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  )
}
