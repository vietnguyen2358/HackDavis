import { NextResponse } from 'next/server'
import { getPatientByName } from '../../../backend/api/mongodb/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { personName, jobType, notes } = body

    // Find the patient in MongoDB
    const patient = await getPatientByName(personName)
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Here you would typically save the job to a database
    // For now, we'll just return a success response
    const job = {
      id: `J${Date.now()}`,
      patientId: patient.id,
      patientName: personName,
      jobType,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    // TODO: Save job to database
    console.log('Created job:', job)

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
} 