# API Documentation

## Outbound Call API

### Endpoint
```
POST ${NGROK_URL}/outbound-call
```

### Request Body
```json
{
    "number": "+16505346538",
    "patientId": "P001",
    "jobType": "checkup"
}
```

### Parameters
- `number` (string): The phone number to call (in E.164 format with country code)
- `patientId` (string): The unique identifier for the patient in the EHR system
- `jobType` (string): The type of call to make. Valid values are:
  - `checkup`: For follow-up checkups
  - `appointment`: For scheduling appointments
  - `reminder`: For appointment reminders

### Example Request
```bash
curl -X POST \
  ${NGROK_URL}/outbound-call \
  -H 'Content-Type: application/json' \
  -d '{
    "number": "+16505346538",
    "patientId": "P001",
    "jobType": "checkup"
  }'
```

### Success Response
```json
{
  "success": true,
  "message": "Call initiated",
  "callSid": "CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "patient": {
    "id": "P001",
    "name": "John Smith",
    "phone": "+16505346538"
  },
  "prompt": "Custom prompt used for the conversation..."
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Patient ID is required"
}
```

#### 404 Not Found
```json
{
  "error": "Patient not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to initiate call"
}
```

### Notes
- The API uses Twilio for making phone calls
- The conversation is handled by ElevenLabs AI
- The system will use patient data from the EHR to personalize the conversation
- The call will be initiated immediately when the API is called
- The response includes a `callSid` which can be used to track the call status 