import { NextResponse } from 'next/server'
import { getPatients } from '../../../backend/api/mongodb/db'

export async function GET() {
  try {
    const patients = await getPatients()
    console.log('Fetched patients from MongoDB:', patients)
    
    // Return the complete patient data
    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
} 