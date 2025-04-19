import { NextResponse } from 'next/server'
import { getPatients } from '../../../backend/api/mongodb/db'

export async function GET() {
  try {
    const patients = await getPatients()
    console.log('Fetched patients from MongoDB:', patients)
    
    // Extract just the id and name from each patient
    const patientList = patients.map(patient => ({
      id: patient.id,
      name: patient.name
    }))
    console.log('Processed patients:', patientList)
    
    return NextResponse.json(patientList)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
} 