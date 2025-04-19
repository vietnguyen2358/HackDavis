import { NextResponse } from 'next/server'
import ehrData from '../../../backend/api/data/ehr.json'

export async function GET() {
  try {
    console.log('Fetching patients from EHR data:', ehrData.patients)
    // Extract just the id and name from each patient
    const patients = ehrData.patients.map(patient => ({
      id: patient.id,
      name: patient.name
    }))
    console.log('Processed patients:', patients)
    
    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
} 