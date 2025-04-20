import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { patientId, transcription } = await request.json()

    if (!patientId || !transcription) {
      return NextResponse.json(
        { error: "Patient ID and transcription are required" },
        { status: 400 }
      )
    }

    // Read the EHR data
    const ehrPath = path.join(process.cwd(), 'backend', 'api', 'data', 'ehr.json')
    const ehrData = JSON.parse(fs.readFileSync(ehrPath, 'utf8'))

    // Find the patient
    const patientIndex = ehrData.patients.findIndex((p: any) => p.id === patientId)
    if (patientIndex === -1) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      )
    }

    // Initialize notes array if it doesn't exist
    if (!ehrData.patients[patientIndex].notes) {
      ehrData.patients[patientIndex].notes = []
    }

    // Add new note
    const newNote = {
      id: Date.now(),
      content: transcription,
      timestamp: new Date().toISOString(),
      author: "AI Agent"
    }

    ehrData.patients[patientIndex].notes.push(newNote)

    // Write back to file
    fs.writeFileSync(ehrPath, JSON.stringify(ehrData, null, 2))

    return NextResponse.json({ success: true, note: newNote })
  } catch (error) {
    console.error('Error updating patient notes:', error)
    return NextResponse.json(
      { error: "Failed to update patient notes" },
      { status: 500 }
    )
  }
} 