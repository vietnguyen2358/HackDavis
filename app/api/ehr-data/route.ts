import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to the ehr.json file
    const ehrFilePath = path.join(process.cwd(), 'backend', 'api', 'data', 'ehr.json');
    
    // Check if file exists
    if (!fs.existsSync(ehrFilePath)) {
      console.error('EHR file not found at:', ehrFilePath);
      return NextResponse.json(
        { error: 'EHR data file not found' },
        { status: 404 }
      );
    }
    
    // Read the file
    const ehrData = JSON.parse(fs.readFileSync(ehrFilePath, 'utf8'));
    
    return NextResponse.json(ehrData);
  } catch (error) {
    console.error('Error reading EHR data:', error);
    return NextResponse.json(
      { error: 'Failed to read EHR data' },
      { status: 500 }
    );
  }
} 