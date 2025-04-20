import { NextRequest, NextResponse } from 'next/server';
import { getTranscriptionById } from '@/lib/localData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In Next.js 13+, params is an object that must be properly awaited
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    // Now use the id to get the transcription
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