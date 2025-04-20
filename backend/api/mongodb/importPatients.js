// backend/api/mongodb/importPatients.js
import { uploadPatients } from "./mongodb.js";
import { initialData } from "./initialData.js";
import { v4 as uuidv4 } from 'uuid';

async function importPatients() {
  try {
    let patients = initialData.patients;
    // Ensure every patient has a unique id
    patients = patients.map(patient => {
      if (!patient.id) {
        return { ...patient, id: uuidv4() };
      }
      return patient;
    });
    const insertedCount = await uploadPatients(patients);
    console.log(`Inserted ${insertedCount} patients.`);
  } catch (err) {
    console.error("Error importing patients:", err);
    process.exit(1);
  }
}

importPatients();
