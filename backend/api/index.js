import Fastify from "fastify";
import dotenv from "dotenv";
import path from "path";
import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import { MongoClient } from "mongodb";
import { createCalendarEvent } from './google-calander/utils/googleCalander.js';
import { connectToDatabase } from "./mongodb/mongodb.js";
import { registerInboundRoutes } from './inbound-calls.js';
import { registerOutboundRoutes } from './outbound-calls.js';
import { v4 as uuidv4 } from 'uuid';
import fastifyCors from '@fastify/cors';
// Load environment variables from .env file in HackDavis root directory
dotenv.config({ path: path.join(process.cwd(), '..', '..', '.env') });

// Initialize Fastify server
const fastify = Fastify({
  logger: true // Enable logging
});

await fastify.register(fastifyCors, {
  // You can customize options here, for example:
  origin: true // or origin: 'http://localhost:3000'
});

fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

const PORT = process.env.PORT || 8000;

// MongoDB connection info available through connectToDatabase()
const dbName = "patient";

console.log('STARTING index.js - should see this on every server start');

// Root route for health check
fastify.get("/", async (_, reply) => {
  reply.send({ message: "Server is running" });
});

console.log('Registering /appointment routes...');

// Ensure the unique index on (patientName, date, time) exists (one-time setup, safe to call multiple times)
(async () => {
  const db = await connectToDatabase();
  await db.collection('appointments').createIndex(
    { patientName: 1, date: 1, time: 1 },
    { unique: true }
  );
})();

// Register /appointment routes (converted from Express to Fastify)
fastify.post('/appointment/make-appointment', async (request, reply) => {
  try {
    const patientData = request.body;
    // Ensure a unique id is present
    if (!patientData.id) {
      patientData.id = uuidv4();
    }
    
    // Use native MongoDB driver instead of Mongoose
    const db = await connectToDatabase();
    const appointmentsCollection = db.collection("appointments");
    
    // Add validation for required fields
    if (!patientData.patientName || !patientData.date || !patientData.type || !patientData.time) {
      return reply.code(400).send({
        error_message: 'Missing required fields',
        details: 'patientName, date, type, and time are required'
      });
    }
    
    // Check for existing appointment with same patientName, date, and time
    const existing = await appointmentsCollection.findOne({
      patientName: patientData.patientName,
      date: new Date(patientData.date),
      time: patientData.time
    });
    if (existing) {
      return reply.code(409).send({
        error_message: 'Duplicate appointment',
        details: 'An appointment for this patient at this date and time already exists.',
        appointment: existing
      });
    }
    
    // Format the appointment document
    const appointmentDoc = {
      id: patientData.id,
      patientName: patientData.patientName,
      date: new Date(patientData.date),
      type: patientData.type,
      time: patientData.time,
      details: {
        notes: patientData.details?.notes || '',
        createdBy: patientData.details?.createdBy || ''
      },
      createdAt: new Date()
    };
    
    // Insert the appointment
    const result = await appointmentsCollection.insertOne(appointmentDoc);

    // Create calendar event
    const calanderEvent = await createCalendarEvent(patientData);

    reply.code(201).send({
      message: 'Appointment created successfully',
      calanderEvent: calanderEvent.htmlLink,
      patient: appointmentDoc
    });
  } catch (err) {
    console.log('Error scheduling appointment:', err);
    reply.code(500).send({
      error_message: 'Failed to schedule appointment',
      details: err && err.message ? err.message : err
    });
  }
});

fastify.get('/appointment/get-patients-appointments/:date', async (request, reply) => {
  const dateString = request.params.date;
  if (!dateString) {
    return reply.code(400).send({ error: 'Missing date url variable' });
  }
  try {
    // Use native MongoDB driver instead of Mongoose
    const db = await connectToDatabase();
    const appointmentsCollection = db.collection("appointments");
    
    // Create a Date object for the start of the day
    const startDate = new Date(dateString);
    startDate.setHours(0, 0, 0, 0);
    
    // Create a Date object for the end of the day
    const endDate = new Date(dateString);
    endDate.setHours(23, 59, 59, 999);
    
    // Find appointments for the specified date
    const patientsByDate = await appointmentsCollection.find({
      date: { $gte: startDate, $lte: endDate }
    }).toArray();
    
    reply.send(patientsByDate);
  } catch (err) {
    console.log('Error getting appointments by date:', err);
    reply.code(500).send({ 
      error: 'Error getting the patients info by date',
      details: err.message
    });
  }
});

fastify.get('/appointment/get-patients-appointments-details/:id', async (request, reply) => {
  try {
    const appointmentId = request.params.id;
    
    // Use native MongoDB driver instead of Mongoose
    const db = await connectToDatabase();
    const appointmentsCollection = db.collection("appointments");
    
    // Find appointment by ID
    const appointment = await appointmentsCollection.findOne({ id: appointmentId });
    
    if (!appointment) {
      return reply.code(404).send({ message: 'Appointment not found' });
    }
    
    reply.send(appointment);
  } catch (err) {
    console.log('Error getting appointment details:', err);
    reply.code(500).send({ 
      error: 'Error getting the appointment info by id',
      details: err.message
    });
  }
});

// Mock doctors data
const mockDoctors = [
  { id: "1", name: "Dr. Bruce Wayne", specialty: "Oncology", referralRequired: true },
  { id: "2", name: "Dr. Stephen Strange", specialty: "Neurology", referralRequired: true },
  { id: "3", name: "Dr. Meredith Grey", specialty: "General Surgery", referralRequired: false },
  { id: "4", name: "Dr. Gregory House", specialty: "Diagnostics", referralRequired: true },
  { id: "5", name: "Dr. Lisa Cuddy", specialty: "Endocrinology", referralRequired: false },
  { id: "6", name: "Dr. Cristina Yang", specialty: "Cardiothoracic Surgery", referralRequired: true },
  { id: "7", name: "Dr. Miranda Bailey", specialty: "General Surgery", referralRequired: false },
  { id: "8", name: "Dr. Derek Shepherd", specialty: "Neurosurgery", referralRequired: true },
  { id: "9", name: "Dr. Jean Watson", specialty: "Family Medicine", referralRequired: false },
  { id: "10", name: "Dr. Leonard McCoy", specialty: "Internal Medicine", referralRequired: false }
];

// Add /doctors endpoint
fastify.get('/doctors', async (request, reply) => {
  try {
    // For now, return mock data
    reply.send(mockDoctors);
  } catch (err) {
    console.log('Error getting doctors:', err);
    reply.code(500).send({ 
      error: 'Error getting doctors list',
      details: err.message
    });
  }
});

console.log('Finished registering /appointment routes.');

// Start the Fastify server
const start = async () => {
  try {
    // Register route handlers
    await registerInboundRoutes(fastify);
    await registerOutboundRoutes(fastify);

    // Start listening
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`[Server] Listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

start();