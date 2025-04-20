import { google } from "googleapis";  // Use import instead of require
const {OAuth2}=google.auth;

const CLIENT_ID=process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET

const oauth2Client=new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET
)

oauth2Client.setCredentials({
    access_token:"your-access-token",
    refresh_token:''
})

function parseTimeTo24Hour(timeStr){
    const [_, hour, minute, period] = timeStr.match(/(\d+):(\d+)\s?(am|pm)/i) || [];
  let hrs = parseInt(hour);
  const mins = parseInt(minute);
  if (period.toLowerCase() === "pm" && hrs !== 12) hrs += 12;
  if (period.toLowerCase() === "am" && hrs === 12) hrs = 0;
  return { hrs, mins };
}

const calendar=google.calendar({version:'v3',auth:oauth2Client})

const createCalendarEvent=async (patient)=>{
    const {patientName,date,time,type,details,}=patient
    const {hrs,mins}=parseTimeTo24Hour(time)
    const startDateTime = new Date(date);
    startDateTime.setHours(hrs, mins, 0);

    const event={
        summary: `${type} - ${patientName}`,
        description: details?.notes || "Patient Appointment",
        start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "America/Los_Angeles"
        },
        end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "America/Los_Angeles"
        }
    };
    try{
        const response=await calendar.events.insert({
            calendarId:'primary',
            resource:event
        })
        
        console.log(`Event created:${response.data}`)
        return response.data
    }catch(error){
        console.log("Failed to create event: ", error.message)
        return error
    }
}

export { createCalendarEvent };  // Use export for named export
