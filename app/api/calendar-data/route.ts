import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define expected data structure (adjust if your JSON structure is different)
interface CalendarData {
  patients: any[]; // Use more specific types if known
  doctors: any[];
  appointments: any[];
}

const dataFilePath = path.join(process.cwd(), 'data', 'calendar-data.json');

async function readData(): Promise<CalendarData> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    // Basic check if jsonData is empty or whitespace
    if (!jsonData || jsonData.trim() === '') {
        console.warn('calendar-data.json is empty or whitespace. Returning default structure.');
        return { patients: [], doctors: [], appointments: [] };
    }
    return JSON.parse(jsonData) as CalendarData;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    // If file doesn't exist, return default structure
    if (nodeError.code === 'ENOENT') {
      console.warn('calendar-data.json not found. Returning default structure.');
      return { patients: [], doctors: [], appointments: [] };
    }
    // If it's a JSON parsing error
    if (error instanceof SyntaxError) {
        console.error('Error parsing calendar-data.json:', error);
        // Decide how to handle: return default or throw specific error
        // Returning default might hide issues, but prevents full crash
        return { patients: [], doctors: [], appointments: [] }; 
    }
    // Otherwise, rethrow unknown errors
    console.error('Error reading data file:', error);
    throw new Error('Failed to read calendar data');
  }
}

export async function GET() {
  console.log("GET /api/calendar-data requested"); // Add log
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/calendar-data:', error);
    // Ensure error is an instance of Error for message property
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
} 