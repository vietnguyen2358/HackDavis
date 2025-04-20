import fs from 'fs';
import path from 'path';

// Define the path to our JSON data file
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'transcriptions.json');

// Define the structure of a transcription
export interface Transcription {
  _id: string;
  title: string;
  patientId: string;
  transcription: string;
  notes: string;
  duration: string;
  type: string;
  createdAt: string;
}

// Ensure the data directory exists
export function ensureDataDirectoryExists() {
  const dataDir = path.join(process.cwd(), 'data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ transcriptions: [] }));
  }
}

// Read all transcriptions
export function getAllTranscriptions(): Transcription[] {
  ensureDataDirectoryExists();
  
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData.transcriptions || [];
  } catch (error) {
    console.error('Error reading transcriptions file:', error);
    return [];
  }
}

// Save a new transcription
export function saveTranscription(transcription: Omit<Transcription, '_id' | 'createdAt'>): Transcription {
  ensureDataDirectoryExists();
  
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const jsonData = JSON.parse(data);
    const transcriptions = jsonData.transcriptions || [];
    
    const newTranscription: Transcription = {
      ...transcription,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    transcriptions.push(newTranscription);
    
    fs.writeFileSync(
      DATA_FILE_PATH,
      JSON.stringify({ transcriptions }, null, 2)
    );
    
    return newTranscription;
  } catch (error) {
    console.error('Error saving transcription:', error);
    throw new Error('Failed to save transcription');
  }
}

// Get a transcription by ID
export function getTranscriptionById(id: string): Transcription | null {
  ensureDataDirectoryExists();
  
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const jsonData = JSON.parse(data);
    const transcriptions = jsonData.transcriptions || [];
    
    const transcription = transcriptions.find((t: Transcription) => t._id === id);
    return transcription || null;
  } catch (error) {
    console.error('Error getting transcription by ID:', error);
    return null;
  }
} 