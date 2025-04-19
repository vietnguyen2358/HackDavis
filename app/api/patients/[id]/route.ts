import { NextResponse } from 'next/server'
import { getPatientById, updatePatient } from '../../../../backend/api/mongodb/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const patient = await getPatientById(id)
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate that the patient exists before updating
    const existingPatient = await getPatientById(id)
    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    
    // Remove _id field from updates to avoid MongoDB error
    const { _id, ...cleanBody } = body
    
    // Log the update attempt
    console.log(`Attempting to update patient ${id} with:`, cleanBody)
    
    const updatedPatient = await updatePatient(id, cleanBody)
    
    if (!updatedPatient) {
      return NextResponse.json(
        { error: 'Failed to update patient' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    )
  }
} 