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
    const prompt = `As a medical professional, please convert the following patient consultation transcription into a detailed SOAP note format. 
    
    Please maintain medical terminology and professional language. If any section lacks information from the transcription, indicate "Not discussed" or "Not assessed".

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