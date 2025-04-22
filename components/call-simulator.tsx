"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function CallSimulator() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [callStage, setCallStage] = useState(0)
  const [progress, setProgress] = useState(0)

  const toggleCall = () => {
    if (!isCallActive) {
      setIsCallActive(true)
      setCallStage(0)
      setTranscript("")
      setProgress(0)

      // Simulate call progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsCallActive(false)
            return 100
          }
          return prev + 1
        })
      }, 200)

      // Simulate call stages
      const stages = [
        {
          time: 1000,
          text: "AI: Hello, this is MedScribe calling on behalf of City Medical Clinic. Is this Emma Thompson?\n\nPatient: Yes, this is Emma.",
          stage: 1,
        },
        {
          time: 5000,
          text: "\n\nAI: Great, Emma. I'm calling to remind you about your appointment with Dr. Johnson tomorrow at 10:00 AM. Are you still planning to attend?\n\nPatient: Yes, I'll be there.",
          stage: 2,
        },
        {
          time: 10000,
          text: "\n\nAI: Excellent. Please remember to bring your insurance card and arrive 15 minutes early to complete any necessary paperwork. Do you have any questions about your appointment?\n\nPatient: No, I don't have any questions.",
          stage: 3,
        },
        {
          time: 15000,
          text: "\n\nAI: Perfect. If anything changes or if you need to reschedule, please call us at least 24 hours in advance. We look forward to seeing you tomorrow at 10:00 AM. Have a great day!\n\nPatient: Thank you, goodbye.",
          stage: 4,
        },
      ]

      stages.forEach((stage) => {
        setTimeout(() => {
          setTranscript((prev) => prev + stage.text)
          setCallStage(stage.stage)
        }, stage.time)
      })
    } else {
      setIsCallActive(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={isCallActive ? "destructive" : "default"} onClick={toggleCall}>
            {isCallActive ? (
              <>
                <PhoneOff className="mr-2 h-4 w-4" />
                End Call
              </>
            ) : (
              <>
                <Phone className="mr-2 h-4 w-4" />
                Simulate Call
              </>
            )}
          </Button>

          {isCallActive && (
            <Badge variant="outline" className="animate-pulse flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              Call in Progress
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled={!isCallActive}>
            <Mic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled={!isCallActive}>
            <MicOff className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isCallActive && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Call Progress</span>
            <span>{callStage}/4 stages</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <Card className="p-4">
        <h3 className="text-sm font-medium mb-2">Live Call Transcript</h3>
        <div className="h-[300px] overflow-y-auto border rounded-md p-3 bg-muted/30">
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {transcript || "Call transcript will appear here..."}
          </pre>
        </div>
      </Card>
    </div>
  )
}
