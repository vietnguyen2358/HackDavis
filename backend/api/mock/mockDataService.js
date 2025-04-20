import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockDataPath = path.join(__dirname, 'ehr.json');

// Read mock data from JSON file
function readMockData() {
  try {
    const data = fs.readFileSync(mockDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mock data:', error);
    throw error;
  }
}

// Get all patients
export async function getPatients() {
  const data = readMockData();
  return data.patients;
}

// Get patient by ID
export async function getPatientById(id) {
  const data = readMockData();
  return data.patients.find(patient => patient.id === id);
}

// Get patient by name
export async function getPatientByName(name) {
  const data = readMockData();
  return data.patients.find(patient => patient.name === name);
}

// Get system prompt
export async function getSystemPrompt() {
  const data = readMockData();
  return data.systemPrompt;
}

// Update patient
export async function updatePatient(id, updates) {
  const data = readMockData();
  const patientIndex = data.patients.findIndex(patient => patient.id === id);
  
  if (patientIndex === -1) {
    return null;
  }
  
  data.patients[patientIndex] = {
    ...data.patients[patientIndex],
    ...updates
  };
  
  // Write updated data back to file
  fs.writeFileSync(mockDataPath, JSON.stringify(data, null, 2));
  return data.patients[patientIndex];
} 