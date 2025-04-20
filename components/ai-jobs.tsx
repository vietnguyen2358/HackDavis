import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, FileText, MessageSquare, Phone, User, Loader2, Info } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Job {
  id: string
  patientId: string
  patientName: string
  jobType: string
  status: "Scheduled" | "In Progress" | "Completed" | "Failed"
  startTime: string
  progress: number
  notes?: string
}

export function AIJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs')
        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }
        const data = await response.json()
        setJobs(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
    // Refresh jobs every 5 seconds to show status updates more quickly
    const interval = setInterval(fetchJobs, 5000)
    return () => clearInterval(interval)
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

  if (jobs.length === 0) {
    return (
      <div className="p-4 text-muted-foreground text-center">
        No active jobs at the moment
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              job.jobType === "checkup" ? "text-blue-500 bg-blue-100 dark:bg-blue-900" :
              job.jobType === "appointment" ? "text-green-500 bg-green-100 dark:bg-green-900" :
              job.jobType === "reminder" ? "text-purple-500 bg-purple-100 dark:bg-purple-900" :
              "text-orange-500 bg-orange-100 dark:bg-orange-900"
            }`}>
              {job.jobType === "checkup" ? <User className="h-4 w-4" /> :
               job.jobType === "appointment" ? <Calendar className="h-4 w-4" /> :
               job.jobType === "reminder" ? <MessageSquare className="h-4 w-4" /> :
               <Phone className="h-4 w-4" />}
            </div>
            <div>
              <p className="font-medium">{job.patientName}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(job.startTime).toLocaleTimeString()} - {job.jobType}
              </p>
              {job.progress > 0 && job.status !== "Completed" && (
                <Progress value={job.progress} className="w-32 h-1 mt-1" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {job.notes && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{job.notes}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Badge variant={
              job.status === "In Progress" ? "default" :
              job.status === "Completed" ? "secondary" :
              job.status === "Failed" ? "destructive" :
              "outline"
            }>
              {job.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
} 