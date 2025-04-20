"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, User, Clock } from "lucide-react"
import { format } from "date-fns"

interface TranscriptMessage {
  type: "user" | "ai" | "system"
  content: string
  timestamp: string
  raw?: any
}

interface TranscriptData {
  patientId: string
  transcript: TranscriptMessage[]
}

export function TranscriptViewer({ patientId }: { patientId: string }) {
  const [transcript, setTranscript] = useState<TranscriptData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/transcripts?patientId=${patientId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch transcript')
        }
        
        const data = await response.json()
        setTranscript(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transcript')
      } finally {
        setLoading(false)
      }
    }

    fetchTranscript()
  }, [patientId])

  if (loading) {
    return <div className="p-4">Loading transcript...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  if (!transcript || transcript.transcript.length === 0) {
    return <div className="p-4">No transcript found for this patient.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Transcript</CardTitle>
        <CardDescription>Patient ID: {patientId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transcript.transcript.map((message, index) => {
            // Extract the actual message content from raw data
            let messageContent = message.content;
            if (message.raw) {
              if (message.raw.agent_response_event?.agent_response) {
                messageContent = message.raw.agent_response_event.agent_response;
              } else if (message.raw.user_transcription_event?.user_transcript) {
                messageContent = message.raw.user_transcription_event.user_transcript;
              }
            }

            // Skip system messages or show them differently
            if (message.type === "system") {
              return (
                <div key={index} className="text-center text-sm text-muted-foreground py-2">
                  {message.content} - {format(new Date(message.timestamp), "MMM d, yyyy h:mm a")}
                </div>
              )
            }

            return (
              <div 
                key={index} 
                className={`flex items-start gap-3 ${
                  message.type === "ai" ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.type === "ai" ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Avatar>
                <div 
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.type === "ai" 
                      ? "bg-primary/10" 
                      : "bg-muted"
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {message.type === "ai" ? "Elenelabs" : "Bro"}
                  </div>
                  <div className="whitespace-pre-wrap">
                    {messageContent}
                  </div>
                  {message.timestamp && (
                    <div className="text-xs text-gray-500 mt-1">
                      {format(new Date(message.timestamp), "MMM d, yyyy h:mm a")}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 