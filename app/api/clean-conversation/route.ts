import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Read the EHR data
    const ehrPath = path.join(process.cwd(), 'backend/api/data/ehr.json');
    const ehrData = JSON.parse(fs.readFileSync(ehrPath, 'utf8'));

    // Get patient ID from query params
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    // Find the patient
    const patient = ehrData.patients.find((p: any) => p.id === patientId);

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Clean and format the conversation
    const cleanedConversation = patient.conversation?.map((msg: any) => ({
      speaker: msg.speaker,
      message: msg.message,
      timestamp: msg.timestamp
    })) || [];

    // Return only the cleaned conversation data
    return NextResponse.json({
      patientId: patient.id,
      patientName: patient.name,
      conversation: cleanedConversation
    });
  } catch (error) {
    console.error('Error reading conversation:', error);
    return NextResponse.json({ error: 'Failed to read conversation' }, { status: 500 });
  }
} 