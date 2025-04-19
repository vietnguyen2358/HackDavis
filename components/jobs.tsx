"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bot, CheckCircle2, Clock, FileText, Loader2 } from "lucide-react"

interface Job {
  _id: string
  name: string
  type: string
  progress: number
  startTime: string
  status: 'pending' | 'in_progress' | 'completed'
  patientName?: string
  notes?: string
}

export function UpcomingAIJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs')
        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }
        const data = await response.json()
        
        // Sort jobs by status priority: in_progress > pending > completed
        const sortedJobs = data.sort((a: Job, b: Job) => {
          const statusPriority = {
            'in_progress': 0,
            'pending': 1,
            'completed': 2
          }
          return statusPriority[a.status] - statusPriority[b.status]
        })
        
        setJobs(sortedJobs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job._id} className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt={job.name} />
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{job.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{job.startTime}</span>
                <Badge variant="outline">{job.type}</Badge>
                {job.status === 'in_progress' && (
                  <Badge variant="secondary">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    In Progress
                  </Badge>
                )}
                {job.status === 'completed' && (
                  <Badge variant="default">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Completed
                  </Badge>
                )}
                {job.status === 'pending' && (
                  <Badge variant="outline">
                    <Clock className="mr-1 h-3 w-3" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {job.status === 'in_progress' && (
            <div className="w-32">
              <Progress value={job.progress} className="h-2" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 