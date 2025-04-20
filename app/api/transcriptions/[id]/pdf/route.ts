import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transcription from '@/lib/models/transcription';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get the transcription by ID
    const transcription = await Transcription.findById(params.id);
    
    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription not found' },
        { status: 404 }
      );
    }
    
    // Convert transcription to PDF format (in a real implementation, you would use 
    // a library like jsPDF, PDFKit, or html-pdf to generate a real PDF)
    const htmlContent = `
      <html>
        <head>
          <title>${transcription.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            h1 { color: #333; }
            .section { margin-bottom: 30px; }
            .label { font-weight: bold; margin-bottom: 10px; }
            .content { padding: 10px; background: #f9f9f9; border-radius: 5px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>${transcription.title}</h1>
          <p>Patient ID: ${transcription.patientId}</p>
          <p>Date: ${new Date(transcription.createdAt).toLocaleString()}</p>
          <p>Duration: ${transcription.duration}</p>
          
          <div class="section">
            <div class="label">Transcription:</div>
            <div class="content">${transcription.transcription.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="section">
            <div class="label">Clinical Notes:</div>
            <div class="content">${transcription.notes.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="footer">
            Medical Transcription and Notes - Generated on ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `;
    
    // For the purposes of this demo, we'll return HTML with appropriate headers
    // to simulate a PDF download
    // In a production environment, you would use a proper PDF generation library
    
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="transcription-${params.id}.html"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
} 