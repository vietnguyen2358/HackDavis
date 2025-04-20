import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const appointmentSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    patientName:{
        type:String,
        required:true,
        trim:true
    },
    date:{
        type:Date,
        required:true,
        default:Date.now
    },
    type:{
        type:String,
        enum:["Check-up","Follow-up","Consultation"],
        required:true,
    },
    time:{
        type:String,
        required: true,
        match: /^((0?[1-9]|1[0-2]):[0-5][0-9]\s?(am|pm))$/i
    },
    details:{
        notes:{
            type:String
        },
        createdBy:{
            type:String
        }
    }
});

// Rename model to 'Appointment' to avoid collection name conflicts with 'patients'
const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;