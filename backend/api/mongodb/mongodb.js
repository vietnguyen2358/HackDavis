// backend/api/mongodb/mongodb.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: '../../.env' });

const password = process.env.MONGODB_PASSWORD;
// Specify the database name in the URI
const dbName = "patient";
const uri = `mongodb+srv://vietnguyen2358:${password}@patient.imvx6w9.mongodb.net/${dbName}?appName=Patient`;

const client = new MongoClient(uri);

export async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

async function ensureUniqueIndex(collection) {
  try {
    await collection.createIndex({ id: 1 }, { unique: true });
  } catch (err) {
    if (err.codeName !== 'IndexOptionsConflict') {
      throw err;
    }
  }
}

// Safe and efficient upsert-based insertion
export async function uploadPatients(patients) {
  const db = await connectToDatabase();
  const collection = db.collection("patients");
  await ensureUniqueIndex(collection);
  let upserted = 0;
  for (const patient of patients) {
    const result = await collection.updateOne(
      { id: patient.id },
      { $set: patient },
      { upsert: true }
    );
    if (result.upsertedCount > 0) upserted++;
  }
  return upserted;
}

export async function uploadPatientAppointmentInfo(patientsAppointmentInfo){
  const db=await connectToDatabase();
  const collection=db.collection("patientsAppointmentInfo");
  let inserted=0;

  for (const patient of patientsAppointmentInfo) {
    const result = await collection.insertOne({
      patientName: patient.patientName,
      date: new Date(patient.date), // Ensures it's stored as Date
      type: patient.type,
      time: patient.time,
      details: {
        notes: patient.details?.notes || '',
        createdBy: patient.details?.createdBy || ''
      }
    });

    if (result.insertedId) inserted++;
  }

  return inserted;


}