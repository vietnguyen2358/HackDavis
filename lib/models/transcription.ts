import mongoose, { Schema } from 'mongoose';

// Define the schema for transcriptions
const transcriptionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  transcription: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: String,
    default: '0 min',
  },
  type: {
    type: String,
    enum: ['transcription', 'notes', 'forms'],
    default: 'transcription',
  }
});

// Create and export the model
export const Transcription = mongoose.models.Transcription || 
  mongoose.model('Transcription', transcriptionSchema);

export default Transcription; 