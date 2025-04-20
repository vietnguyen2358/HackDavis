import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { patientId, message, speaker } = await request.json()

    if (!patientId || !message || !speaker) {
      return NextResponse.json(
        { error: "Patient ID, message, and speaker are required" },
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

    // Initialize conversation array if it doesn't exist
    if (!ehrData.patients[patientIndex].conversation) {
      ehrData.patients[patientIndex].conversation = []
    }

    // Add new message to conversation
    const newMessage = {
      id: Date.now(),
      content: message,
      timestamp: new Date().toISOString(),
      speaker: speaker // 'human' or 'ai'
    }

    ehrData.patients[patientIndex].conversation.push(newMessage)

    // Write back to file
    fs.writeFileSync(ehrPath, JSON.stringify(ehrData, null, 2))

    return NextResponse.json({ success: true, message: newMessage })
  } catch (error) {
    console.error('Error saving conversation:', error)
    return NextResponse.json(
      { error: "Failed to save conversation" },
      { status: 500 }
    )
  }
} 