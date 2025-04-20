import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// Define interfaces for better type safety
interface Patient {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty?: string; // Optional based on your data
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName?: string; // Store for convenience?
  doctorName?: string; // Store for convenience?
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
}

interface CalendarData {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
}

const dataFilePath = path.join(process.cwd(), 'data', 'calendar-data.json');

// Helper function to read data (consider moving to a shared utils file)
async function readData(): Promise<CalendarData> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(jsonData) as CalendarData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { patients: [], doctors: [], appointments: [] };
    }
    console.error('Error reading data file:', error);
    throw new Error('Failed to read calendar data');
  }
}

// Helper function to write data
async function writeData(data: CalendarData): Promise<void> {
  try {
    const jsonData = JSON.stringify(data, null, 2); // Pretty print JSON
    await fs.writeFile(dataFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('Failed to write calendar data');
  }
}

// POST handler to add a new appointment
export async function POST(request: Request) {
  try {
    const newAppointmentData = await request.json();

    // Basic validation (add more robust validation as needed)
    if (!newAppointmentData.patientId || !newAppointmentData.doctorId || !newAppointmentData.date || !newAppointmentData.time) {
      return NextResponse.json({ message: 'Missing required appointment fields' }, { status: 400 });
    }

    const currentData = await readData();

    // Find patient and doctor names (optional, but good for consistency)
    const patient = currentData.patients.find(p => p.id === newAppointmentData.patientId);
    const doctor = currentData.doctors.find(d => d.id === newAppointmentData.doctorId);

    const newAppointment: Appointment = {
      ...newAppointmentData,
      id: uuidv4(), // Generate a unique ID
      patientName: patient ? patient.name : 'Unknown Patient',
      doctorName: doctor ? doctor.name : 'Unknown Doctor',
      status: newAppointmentData.status || 'pending', // Default status
    };

    currentData.appointments.push(newAppointment);
    await writeData(currentData);

    return NextResponse.json(newAppointment, { status: 201 }); // Return the created appointment

  } catch (error) {
    console.error('Error in POST /api/appointments:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// GET handler to retrieve appointments (optional, but useful)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Example: allow filtering by date

    const data = await readData();
    let appointments = data.appointments;

    if (date) {
      appointments = appointments.filter(app => app.date === date);
    }

    // Sort by status: in_progress > pending > completed (Example)
    const statusPriority = {
      in_progress: 0,
      pending: 1,
      completed: 2,
    };
    appointments.sort((a, b) => (statusPriority[a.status as keyof typeof statusPriority] ?? 99) - (statusPriority[b.status as keyof typeof statusPriority] ?? 99));


    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error in GET /api/appointments:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 