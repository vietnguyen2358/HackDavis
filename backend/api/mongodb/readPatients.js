import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: '../../../.env' });

const password = process.env.MONGODB_PASSWORD;
const dbName = "patient";
const uri = `mongodb+srv://vietnguyen2358:${password}@patient.imvx6w9.mongodb.net/${dbName}?appName=Patient`;

async function readPatients() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db(dbName);
    const collection = db.collection("patients");
    
    // Read all patients
    const patients = await collection.find({}).toArray();
    console.log("\nTotal patients found:", patients.length);
    
    // Display patient information
    patients.forEach((patient, index) => {
      console.log(`\nPatient ${index + 1}:`);
      console.log("ID:", patient.id);
      console.log("Name:", patient.name);
      console.log("Phone:", patient.phone);
      console.log("Age:", patient.age);
      console.log("Gender:", patient.gender);
      console.log("Medical History:");
      console.log("  Conditions:", patient.medicalHistory.conditions.join(", "));
      console.log("  Medications:", patient.medicalHistory.medications.join(", "));
      console.log("  Allergies:", patient.medicalHistory.allergies.join(", "));
      console.log("Appointments:", patient.appointments.length);
      patient.appointments.forEach((apt, i) => {
        console.log(`  ${i + 1}. ${apt.type} on ${apt.date} (${apt.status})`);
      });
    });
    
  } catch (error) {
    console.error("Error reading patients:", error);
  } finally {
    await client.close();
    console.log("\nMongoDB connection closed");
  }
}

// Run the function
readPatients().catch(console.error); 