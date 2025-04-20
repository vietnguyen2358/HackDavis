import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import appointmentRoutes from '../api/google-calander/routes/calanderRoutes.js';

dotenv.config()

const app=express()

app.use(express.json())

app.use('/appointment', appointmentRoutes);
const dbUri = `mongodb+srv://vietnguyen2358:${process.env.MONGODB_PASSWORD}@patient.imvx6w9.mongodb.net/patient?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 5000;

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ Mongoose connected to MongoDB');
    // Start server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongoose connection error:', err);
  });
  