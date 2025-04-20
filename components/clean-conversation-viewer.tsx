"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import { format } from "date-fns"

interface Message {
  timestamp: string
  speaker: "human" | "ai"
  message: string
}

interface ConversationData {
  patientId: string
  patientName: string
  conversation: Message[]
}

export function CleanConversationViewer({ patientId }: { patientId: string }) {
  const [conversation, setConversation] = useState<ConversationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/clean-conversation?patientId=${patientId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversation')
        }
        
        const data = await response.json()
        setConversation(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch conversation')
      } finally {
        setLoading(false)
      }
    }

    fetchConversation()
  }, [patientId])

  if (loading) {
    return <div className="p-4">Loading conversation...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  if (!conversation || conversation.conversation.length === 0) {
    return <div className="p-4">No conversation found for this patient.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation with {conversation.patientName}</CardTitle>
        <CardDescription>Patient ID: {conversation.patientId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversation.conversation.map((message, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 ${
                message.speaker === "ai" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <Avatar className="h-8 w-8">
                {message.speaker === "ai" ? (
                  <Bot className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Avatar>
              <div 
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.speaker === "ai" 
                    ? "bg-primary/10" 
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(message.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 