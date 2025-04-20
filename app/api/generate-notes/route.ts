import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { transcription } = await request.json()

    if (!transcription) {
      return NextResponse.json(
        { error: "Transcription is required" },
        { status: 400 }
      )
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Create a comprehensive prompt for clinical notes
    const prompt = `You are a medical professional. Your task is to convert the following patient consultation transcription into a comprehensive SOAP note for the patient's medical record.

    Please:
    - Carefully extract and organize all relevant information from the transcription into the correct SOAP sections (Subjective, Objective, Assessment, Plan).
    - Use clear, concise, and professional medical terminology.
    - Do not fabricate or assume information that is not present.
    - If any section is missing or not discussed in the transcription, clearly indicate "Not discussed" or "Not assessed" for that section.
    - Format your output with clear section headers as shown below.

    Return the SOAP note in this structure:

    Subjective:
    [Patient-reported symptoms, history, and concerns.]

    Objective:
    [Clinician's observations, physical exam findings, vitals, lab results.]

    Assessment:
    [Diagnosis, clinical impressions, or summary.]

    Plan:
    [Treatment plan, follow-up, medications, recommendations.]

    Transcription:
    ${transcription}`

    // Generate the response
    const result = await model.generateContent(prompt)
    const response = await result.response
    const notes = response.text()

    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Error generating notes:", error)
    return NextResponse.json(
      { error: "Failed to generate clinical notes" },
      { status: 500 }
    )
  }
} 