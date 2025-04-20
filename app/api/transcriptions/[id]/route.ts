import { NextRequest, NextResponse } from 'next/server';
import { getTranscriptionById } from '@/lib/localData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await the params in Next.js 13+
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    // Get the transcription using the id variable
    const transcription = getTranscriptionById(id);
    
    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: transcription 
    });
    
  } catch (error) {
    console.error('Error fetching transcription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcription' },
      { status: 500 }
    );
  }
} 