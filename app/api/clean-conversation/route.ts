import { NextResponse } from 'next/server';
import { getPatientByName, updatePatient } from '../../../backend/api/mongodb/db';

export async function POST(req: Request) {
  try {
    const { patientName } = await req.json();

    // Get patient data from MongoDB
    const patient = await getPatientByName(patientName);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Clear the notes array
    const updatedPatient = await updatePatient(patient.id, { notes: [] });
    if (!updatedPatient) {
      return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cleaning conversation:', error);
    return NextResponse.json(
      { error: 'Failed to clean conversation' },
      { status: 500 }
    );
  }
} 