"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bot, CheckCircle2, Clock, FileText, Loader2 } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

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

// Number of jobs to display per page
const JOBS_PER_PAGE = 5;

export function UpcomingAIJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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
        // Calculate total pages
        setTotalPages(Math.max(1, Math.ceil(sortedJobs.length / JOBS_PER_PAGE)))
        // Reset to page 1 if current page would be out of bounds
        if (currentPage > Math.ceil(sortedJobs.length / JOBS_PER_PAGE)) {
          setCurrentPage(1)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [currentPage])

  // Get current page jobs
  const getCurrentPageJobs = () => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    const endIndex = startIndex + JOBS_PER_PAGE;
    return jobs.slice(startIndex, endIndex);
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

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

  const currentJobs = getCurrentPageJobs();

  return (
    <div className="space-y-4">
      {/* Jobs list with fixed height */}
      <div className="space-y-4 min-h-[350px]">
        {currentJobs.map((job) => (
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-6 border-t pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePreviousPage} 
                  className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    isActive={currentPage === index + 1} 
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={handleNextPage} 
                  className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
} 