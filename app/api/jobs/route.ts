import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const JOBS_FILE = path.join(process.cwd(), 'backend/api/data/jobs.json')

// Define job interface
interface Job {
  id: string
  patientId: string
  patientName: string
  jobType: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Failed'
  startTime: string
  progress: number
  notes?: string
}

// Ensure the jobs file exists
if (!fs.existsSync(JOBS_FILE)) {
  fs.writeFileSync(JOBS_FILE, JSON.stringify([], null, 2))
}

export async function GET() {
  try {
    const jobsData = fs.readFileSync(JOBS_FILE, 'utf-8')
    const jobs = JSON.parse(jobsData) as Job[]
    
    // Sort jobs by status priority: In Progress > Scheduled > Completed > Failed
    const sortedJobs = jobs.sort((a, b) => {
      const statusPriority: Record<string, number> = {
        'In Progress': 0,
        'Scheduled': 1,
        'Completed': 2,
        'Failed': 3
      }
      return statusPriority[a.status] - statusPriority[b.status]
    })
    
    return NextResponse.json(sortedJobs)
  } catch (error) {
    console.error('Error reading jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientId, patientName, jobType, notes } = body

    // Read existing jobs
    const jobsData = fs.readFileSync(JOBS_FILE, 'utf-8')
    const jobs = JSON.parse(jobsData) as Job[]

    // Create new job
    const newJob: Job = {
      id: `J${Date.now()}`,
      patientId,
      patientName,
      jobType,
      notes,
      status: 'Scheduled',
      startTime: new Date().toISOString(),
      progress: 0
    }

    // Add new job to the list
    jobs.push(newJob)

    // Save updated jobs
    fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2))

    return NextResponse.json(newJob)
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { jobId, status, progress } = body

    // Read existing jobs
    const jobsData = fs.readFileSync(JOBS_FILE, 'utf-8')
    const jobs = JSON.parse(jobsData) as Job[]

    // Find and update the job
    const jobIndex = jobs.findIndex((job) => job.id === jobId)
    if (jobIndex === -1) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Update job status and progress
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      status: status || jobs[jobIndex].status,
      progress: progress !== undefined ? progress : jobs[jobIndex].progress
    }

    // Save updated jobs
    fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2))

    return NextResponse.json(jobs[jobIndex])
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
} 