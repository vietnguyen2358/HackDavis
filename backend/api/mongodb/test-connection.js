import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: '../../../.env' });

const password = process.env.MONGODB_PASSWORD;
const dbName = "patient";
const uri = `mongodb+srv://vietnguyen2358:${password}@patient.imvx6w9.mongodb.net/${dbName}?appName=Patient`;

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    // Test database access
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Test patient collection
    const patientsCollection = db.collection("patients");
    const patientCount = await patientsCollection.countDocuments();
    console.log(`\nTotal patients in database: ${patientCount}`);
    
    // Get one patient as sample
    const samplePatient = await patientsCollection.findOne({});
    if (samplePatient) {
      console.log('\nSample patient data:');
      console.log(JSON.stringify(samplePatient, null, 2));
    }
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the test
testConnection().catch(console.error); 