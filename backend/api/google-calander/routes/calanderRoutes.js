import express from 'express';  // Use import instead of require
import { createCalendarEvent } from '../utils/googleCalander.js';  // Use import for named import
import Appointment from '../models/appointmentModel.js';  // Use import for Appointment model
import {uploadPatientAppointmentInfo} from "../../mongodb/mongodb.js"
const router = express.Router();

router.post("/make-appointment",async(req,res)=>{
    try{
        const patientData=req.body;
        console.log(patientData)
        const newPatient=new Appointment(patientData);
        console.log(newPatient)
        await newPatient.save();

        const upsertedCount = await uploadPatientAppointmentInfo([patientData]);  // Pass the data as an array
        console.log(`${upsertedCount} appointments upserted`);

        const calanderEvent=await createCalendarEvent(patientData)

        res.status(201).json({
            message:'Appointment',
            calanderEvent:calanderEvent.htmlLink,
            patient:newPatient
        });

    }catch(err){
        console.log(err)
        res.status(500).json({
            "error_message":"Failed to schedule appointment "
        })
    }
})
export default router