// Script to populate the doctors collection in MongoDB
// Usage: node scripts/populateDoctors.js
import { connectToDatabase } from '../mongodb/mongodb.js';

const doctors = [
  { name: "Dr. Bruce Wayne", specialty: "Oncology", referralRequired: true },
  { name: "Dr. Stephen Strange", specialty: "Neurology", referralRequired: true },
  { name: "Dr. Meredith Grey", specialty: "General Surgery", referralRequired: false },
  { name: "Dr. Gregory House", specialty: "Diagnostics", referralRequired: true },
  { name: "Dr. Lisa Cuddy", specialty: "Endocrinology", referralRequired: false },
  { name: "Dr. Cristina Yang", specialty: "Cardiothoracic Surgery", referralRequired: true },
  { name: "Dr. Miranda Bailey", specialty: "General Surgery", referralRequired: false },
  { name: "Dr. Derek Shepherd", specialty: "Neurosurgery", referralRequired: true },
  { name: "Dr. Jean Watson", specialty: "Family Medicine", referralRequired: false },
  { name: "Dr. Leonard McCoy", specialty: "Internal Medicine", referralRequired: false }
];

async function populateDoctors() {
  // Specify the doctor table by passing dbName to connectToDatabase
  const db = await connectToDatabase("doctor");
  const collection = db.collection('doctors');
  // Remove all existing doctors (optional, comment out if you want to keep existing)
  await collection.deleteMany({});
  const result = await collection.insertMany(doctors);
  console.log(`Inserted ${result.insertedCount} doctors.`);
}

populateDoctors().then(() => {
  console.log('Doctors collection populated.');
  process.exit(0);
}).catch(err => {
  console.error('Error populating doctors:', err);
  process.exit(1);
});
