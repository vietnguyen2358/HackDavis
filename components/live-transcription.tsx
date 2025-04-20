"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

// Add type definitions for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionError) => any) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function LiveTranscription() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [currentPatientId, setCurrentPatientId] = useState("P001") // Default to P001 for now

  const startRecording = async () => {
    try {
      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setIsRecording(true)
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        throw new Error("Speech recognition not supported in this browser")
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognitionRef.current = recognition
      
      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("")
        setTranscription(transcript)

        // If this is a final result, send it to update patient notes
        if (event.results[event.results.length - 1].isFinal) {
          try {
            const response = await fetch("/api/update-patient-notes", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                patientId: currentPatientId,
                transcription: transcript
              }),
            })

            if (!response.ok) {
              throw new Error("Failed to update patient notes")
            }
          } catch (error) {
            console.error("Error updating patient notes:", error)
            toast({
              title: "Error",
              description: "Failed to save transcription to patient notes",
              variant: "destructive",
            })
          }
        }
      }

      recognition.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error:", event.error)
        stopRecording()
      }
      
      recognition.start()
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    
    // Stop the recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    // Stop the audio stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Process the transcription to generate notes
    if (transcription) {
      generateNotes(transcription)
    }
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const generateNotes = async (text: string) => {
    setIsProcessing(true)
    try {
      // Call your Gemini API endpoint here
      const response = await fetch("/api/generate-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcription: text }),
      })

      if (!response.ok) throw new Error("Failed to generate notes")
      
      const data = await response.json()
      setNotes(data.notes)
      
      toast({
        title: "Success",
        description: "Clinical notes generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate clinical notes",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Transcription</h3>
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <p className="text-sm text-muted-foreground">
              {transcription || "Click the microphone button to start recording..."}
            </p>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Clinical Notes</h3>
            {isProcessing && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Clinical notes will appear here..."
              className="min-h-[250px] resize-none"
            />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
} 