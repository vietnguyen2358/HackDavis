// backend/api/mongodb/importPatients.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { uploadPatients } from "./mongodb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function importPatients() {
  const dataPath = path.join(__dirname, "../data", "ehr.json");
  const ehrData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const patients = ehrData.patients;

  const insertedCount = await uploadPatients(patients);
  console.log(`Inserted ${insertedCount} patients.`);
}

importPatients().catch(err => {
  console.error("Error importing patients:", err);
  process.exit(1);
});
