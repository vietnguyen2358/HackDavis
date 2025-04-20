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

        const upsertedCount = await uploadPatientAppointmentInfo([patientData]); 

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

router.get("/get-patients-appointments/:date",async(req,res)=>{
    const dateString=req.params.date;

    if(!dateString){
        return res.status(400).json({error:"Missing date url variable"})
    }
    try{
        const patientsByDate=await Appointment.find({
            date:dateString
        });

        console.log(patientsByDate)
        res.json(patientsByDate)

    }catch(err){
        res.status(500).json({error:"Errr with getting the patients info by date"})
    }
});

router.get("/get-patients-appointments-details/:id",async(req,res)=>{
    try{
        const userId=new ObjectId(req.params.id)
        
        const user=await Appointment.findById({_id:userId})

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        console.log(user)
        res.json(user)
    }catch(error){
        res.status(500).json({message:"Unable to find user by their id"})
    }
})
export default router