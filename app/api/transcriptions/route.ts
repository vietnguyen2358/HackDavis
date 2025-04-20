import { NextRequest, NextResponse } from 'next/server';
import { getAllTranscriptions, saveTranscription } from '@/lib/localData';

// Save a new transcription
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();
    const { title, patientId, transcription, notes, duration } = data;
    
    // Validate required fields
    if (!title || !patientId || !transcription) {
      return NextResponse.json(
        { error: 'Title, patientId, and transcription are required' },
        { status: 400 }
      );
    }
    
    // Create a new transcription using our local data utility
    const newTranscription = saveTranscription({
      title,
      patientId,
      transcription,
      notes: notes || '',
      duration: duration || '0 min',
      type: 'transcription',
    });
    
    return NextResponse.json({ 
      success: true, 
      data: newTranscription 
    });
    
  } catch (error) {
    console.error('Error saving transcription:', error);
    return NextResponse.json(
      { error: 'Failed to save transcription' },
      { status: 500 }
    );
  }
}

// Get all transcriptions
export async function GET() {
  try {
    // Get all transcriptions from our local data
    const transcriptions = getAllTranscriptions();
    
    return NextResponse.json({ 
      success: true, 
      data: transcriptions 
    });
    
  } catch (error) {
    console.error('Error fetching transcriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcriptions' },
      { status: 500 }
    );
  }
} 