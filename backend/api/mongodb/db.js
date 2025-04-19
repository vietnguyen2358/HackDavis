import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: '../../../.env' });

const password = process.env.MONGODB_PASSWORD;
const dbName = "patient";
const uri = `mongodb+srv://vietnguyen2358:${password}@patient.imvx6w9.mongodb.net/${dbName}?appName=Patient`;

let client = null;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName);
}

export async function getPatients() {
  const db = await connectToDatabase();
  return db.collection("patients").find({}).toArray();
}

export async function getPatientById(id) {
  const db = await connectToDatabase();
  return db.collection("patients").findOne({ id });
}

export async function getPatientByName(name) {
  const db = await connectToDatabase();
  return db.collection("patients").findOne({ name });
}

export async function getSystemPrompt() {
  const db = await connectToDatabase();
  return db.collection("systemPrompt").findOne({});
}

export async function updatePatient(id, updates) {
  const db = await connectToDatabase();
  
  try {
    console.log(`Updating patient with id: ${id}`);
    console.log('Clean updates:', updates);
    
    // First check if the patient exists
    const existingPatient = await db.collection("patients").findOne({ id });
    if (!existingPatient) {
      console.error(`Patient with id ${id} not found`);
      return null;
    }
    
    // Perform the update
    const result = await db.collection("patients").updateOne(
      { id },
      { $set: updates }
    );
    
    if (result.matchedCount === 0) {
      console.error('No document was updated');
      return null;
    }
    
    // Fetch the updated document
    const updatedPatient = await db.collection("patients").findOne({ id });
    console.log('Update successful:', updatedPatient);
    return updatedPatient;
  } catch (error) {
    console.error('Error in updatePatient:', error);
    throw error;
  }
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
  }
} 