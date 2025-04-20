import { NextResponse } from 'next/server'
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { targetUrl, data, ehrData: clientEhrData } = body

    console.log('Proxy request details:', {
      targetUrl,
      data,
      hasEhrData: !!clientEhrData
    })

    if (!targetUrl || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate the data structure
    if (!data.patientId || !data.jobType || !data.jobId) {
      return NextResponse.json(
        { error: 'Missing required fields in job data' },
        { status: 400 }
      )
    }

    // Use client-provided EHR data or load from file
    let ehrData = clientEhrData;
    if (!ehrData) {
      try {
        const ehrFilePath = path.join(process.cwd(), 'backend', 'api', 'data', 'ehr.json');
        if (fs.existsSync(ehrFilePath)) {
          ehrData = JSON.parse(fs.readFileSync(ehrFilePath, 'utf8'));
          console.log('Loaded EHR data from file for outbound call');
          
          // Find the patient in the EHR data
          const patient = ehrData.patients.find((p: any) => p.id === data.patientId);
          if (patient) {
            console.log('Found patient in EHR data:', patient);
            // Add patient details from EHR to the data
            data.patientDetails = {
              phone: patient.phone,
              age: patient.age,
              gender: patient.gender,
              medicalHistory: patient.medicalHistory,
              preferences: patient.preferences
            };
          } else {
            console.warn('Patient not found in EHR data');
          }
        } else {
          console.error('EHR file not found at:', ehrFilePath);
        }
      } catch (error) {
        console.error('Error loading EHR data from file:', error);
      }
    } else {
      console.log('Using client-provided EHR data for outbound call');
    }

    // Add EHR data to the request
    const requestData = {
      ...data,
      ehrData
    };

    // If we have a phone number in the data, make sure it's at the top level
    if (data.number) {
      requestData.number = data.number;
    } else if (data.patientDetails && data.patientDetails.phone) {
      requestData.number = data.patientDetails.phone;
    }

    console.log('Making request to:', targetUrl)
    console.log('Request data:', JSON.stringify(requestData, null, 2))
    
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      })

      console.log('Response status:', response.status)
      const responseText = await response.text()
      console.log('Response text:', responseText)

      if (!response.ok) {
        let errorMessage = 'Backend server error'
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorData.message || responseText
          console.error('Error details:', errorData)
          
          // If we have details about why the call failed, include them
          if (errorData.details) {
            console.error('Error details:', errorData.details)
            errorMessage = `${errorMessage}: ${errorData.details}`
          }
        } catch {
          errorMessage = responseText
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status }
        )
      }

      try {
        const responseData = JSON.parse(responseText)
        return NextResponse.json(responseData)
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        return NextResponse.json(
          { error: 'Invalid JSON response from server' },
          { status: 500 }
        )
      }
    } catch (error) {
      console.error('Error in fetch operation:', error)
      return NextResponse.json(
        { error: 'Network error connecting to backend' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in proxy-outbound-call:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 