// backend/api/mongodb/importPatients.js
import { uploadPatients } from "./mongodb.js";
import { initialData } from "./initialData.js";

async function importPatients() {
  try {
    const patients = initialData.patients;
    const insertedCount = await uploadPatients(patients);
    console.log(`Inserted ${insertedCount} patients.`);
  } catch (err) {
    console.error("Error importing patients:", err);
    process.exit(1);
  }
}

importPatients();
