import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { transcription } = data;
    
    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would call Gemini API or another AI model
    // For now, we'll create a simple mock response
    const notesContent = generateMockNotes(transcription);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      success: true, 
      notes: notesContent
    });
    
  } catch (error) {
    console.error('Error generating notes:', error);
    return NextResponse.json(
      { error: 'Failed to generate notes' },
      { status: 500 }
    );
  }
}

function generateMockNotes(transcription: string): string {
  // A simple mock function to generate clinical notes
  const sentences = transcription.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = transcription.split(/\s+/).length;
  
  // Basic structure for clinical notes
  return `CLINICAL NOTES
  
Patient presents with ${sentences.length > 0 ? sentences[0].toLowerCase() : 'symptoms described in the transcription'}.

Assessment:
- Patient history recorded in transcript (${wordCount} words)
- Key points extracted from conversation
${sentences.slice(0, 3).map(s => `- ${s.trim()}`).join('\n')}

Plan:
1. Follow up in 2 weeks
2. Medication as discussed
3. Refer to specialist if symptoms persist

These notes were automatically generated from the transcription and should be reviewed for accuracy.`;
} 