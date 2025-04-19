const mongoose=require('mongoose');
const patientSchema=new mongoose.Schema({
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
})
const Patient=mongoose.model('Patient',patientSchema)
model.export=Patient