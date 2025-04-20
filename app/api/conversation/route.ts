import { NextResponse } from 'next/server';
import { getPatientByName, getSystemPrompt } from '../../../backend/api/mongodb/db';

export async function POST(req: Request) {
  try {
    const { messages, patientName } = await req.json();

    // Get patient data from MongoDB
    const patient = await getPatientByName(patientName);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Get system prompt from MongoDB
    const systemPromptData = await getSystemPrompt();
    if (!systemPromptData) {
      return NextResponse.json({ error: 'System prompt not found' }, { status: 404 });
    }

    // Create a custom prompt based on the patient info
    let customPrompt = `${systemPromptData.role}\n\n`;
    customPrompt += `Communication Style:\n${systemPromptData.communicationStyle.join('\n')}\n\n`;
    customPrompt += `Responsibilities:\n${systemPromptData.responsibilities.join('\n')}\n\n`;
    customPrompt += `Guidelines:\n${systemPromptData.guidelines.join('\n')}\n\n`;

    // Add patient-specific information
    customPrompt += `Patient Information:\n`;
    customPrompt += `Name: ${patient.name}\n`;
    customPrompt += `Age: ${patient.age}\n`;
    customPrompt += `Gender: ${patient.gender}\n`;
    customPrompt += `Medical History:\n`;
    customPrompt += `- Conditions: ${patient.medicalHistory.conditions.join(', ')}\n`;
    customPrompt += `- Medications: ${patient.medicalHistory.medications.join(', ')}\n`;
    customPrompt += `- Allergies: ${patient.medicalHistory.allergies.join(', ')}\n`;
    customPrompt += `Appointments:\n`;
    patient.appointments.forEach((appt: any) => {
      customPrompt += `- ${appt.type} on ${appt.date} (${appt.status})\n`;
      if (appt.notes) customPrompt += `  Notes: ${appt.notes}\n`;
    });
    customPrompt += `Preferences:\n`;
    customPrompt += `- Language: ${patient.preferences.language}\n`;
    customPrompt += `- Contact Time: ${patient.preferences.contactTime}\n`;
    customPrompt += `- Reminder Type: ${patient.preferences.reminderType}\n`;

    // Add conversation history if available
    if (patient.notes && patient.notes.length > 0) {
      customPrompt += `\nPrevious Conversation Notes:\n`;
      patient.notes.forEach((note: any) => {
        customPrompt += `- ${new Date(note.timestamp).toLocaleString()}: ${note.content}\n`;
      });
    }

    // Add first message
    customPrompt += `\nFirst Message: ${systemPromptData.firstMessage}\n`;

    // Prepare the messages array for the API
    const apiMessages = [
      {
        role: 'system',
        content: customPrompt,
      },
      ...messages,
    ];

    // Call the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error.message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in conversation route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 