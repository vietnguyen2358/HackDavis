import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Cache for EHR data
let ehrDataCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute cache

export async function GET() {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (ehrDataCache && (now - lastFetchTime < CACHE_DURATION)) {
      console.log('Returning cached EHR data');
      return NextResponse.json(ehrDataCache);
    }

    // If no cache or cache expired, fetch fresh data
    console.log('Fetching fresh EHR data');
    const ehrFilePath = path.join(process.cwd(), 'backend', 'api', 'data', 'ehr.json');
    
    try {
      const fileContent = await fs.readFile(ehrFilePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      // Update cache
      ehrDataCache = data;
      lastFetchTime = now;
      
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error reading EHR data file:', error);
      return NextResponse.json(
        { error: 'Failed to read EHR data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in EHR data API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 