import { NextResponse } from 'next/server'
import { getPatientByName, updatePatient } from '../../../backend/api/mongodb/db'

export async function POST(req: Request) {
  try {
    const { patientName, content } = await req.json()

    // Get patient data from MongoDB
    const patient = await getPatientByName(patientName)
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // Create new note
    const newNote = {
      id: Date.now(),
      content,
      timestamp: new Date().toISOString(),
      author: 'AI Agent'
    }

    // Add note to patient's notes array
    const notes = patient.notes || []
    notes.push(newNote)

    // Update patient in MongoDB
    const updatedPatient = await updatePatient(patient.id, { notes })
    if (!updatedPatient) {
      return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 })
    }

    return NextResponse.json({ success: true, note: newNote })
  } catch (error) {
    console.error('Error saving conversation:', error)
    return NextResponse.json(
      { error: 'Failed to save conversation' },
      { status: 500 }
    )
  }
} 