import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Get patient ID from query params
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    // Define the path to the transcript file
    const transcriptPath = path.join(process.cwd(), 'backend/api/data/transcripts', `${patientId}.json`);

    // Check if the transcript file exists
    if (!fs.existsSync(transcriptPath)) {
      return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });
    }

    // Read the transcript file
    const transcriptData = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'));

    // Return the transcript data
    return NextResponse.json({
      patientId,
      transcript: transcriptData
    });
  } catch (error) {
    console.error('Error reading transcript:', error);
    return NextResponse.json({ error: 'Failed to read transcript' }, { status: 500 });
  }
} 