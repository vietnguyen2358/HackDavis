import WebSocket from "ws";
import Twilio from "twilio";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPatientById, getSystemPrompt } from './mongodb/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure transcripts directory exists
const transcriptsDir = path.join(__dirname, 'data', 'transcripts');
if (!fs.existsSync(transcriptsDir)) {
  fs.mkdirSync(transcriptsDir, { recursive: true });
}

export function registerOutboundRoutes(fastify) {
  // Check for required environment variables
  const { 
    ELEVENLABS_API_KEY, 
    ELEVENLABS_AGENT_ID,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER
  } = process.env;

  if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error("Missing required environment variables");
    throw new Error("Missing required environment variables");
  }

  // Initialize Twilio client
  const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  // Helper function to get signed URL for authenticated conversations
  async function getSignedUrl() {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ELEVENLABS_AGENT_ID}`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get signed URL: ${response.statusText}`);
      }

      const data = await response.json();
      return data.signed_url;
    } catch (error) {
      throw error;
    }
  }

  // Helper function to save transcript
  function saveTranscript(patientId, message) {
    try {
      const transcriptPath = path.join(transcriptsDir, `${patientId}.json`);
      
      // Create or load existing transcript
      let transcript = [];
      if (fs.existsSync(transcriptPath)) {
        transcript = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'));
      }
      
      // Add timestamp to message
      const messageWithTimestamp = {
        ...message,
        timestamp: new Date().toISOString()
      };
      
      // Add message to transcript
      transcript.push(messageWithTimestamp);
      
      // Save updated transcript
      fs.writeFileSync(transcriptPath, JSON.stringify(transcript, null, 2));
    } catch (error) {
      console.error("Error saving transcript:", error);
    }
  }

  // Helper function to reset transcript
  function resetTranscript(patientId) {
    try {
      const transcriptPath = path.join(transcriptsDir, `${patientId}.json`);
      
      // Create a new empty transcript with call start timestamp
      const transcript = [{
        type: "system",
        content: "Call started",
        timestamp: new Date().toISOString()
      }];
      
      // Save the reset transcript
      fs.writeFileSync(transcriptPath, JSON.stringify(transcript, null, 2));
      console.log(`Transcript reset for patient ID: ${patientId}`);
    } catch (error) {
      console.error("Error resetting transcript:", error);
    }
  }

  // Route to initiate outbound calls
  fastify.post("/outbound-call", async (request, reply) => {
    const { patientId, jobType, additionalNotes } = request.body;

    if (!patientId) {
      return reply.code(400).send({ error: "Patient ID is required" });
    }

    try {
      // Find patient in MongoDB
      const patient = await getPatientById(patientId);
      if (!patient) {
        return reply.code(404).send({ error: "Patient not found" });
      }

      // Get the system prompt from MongoDB
      const systemPrompt = await getSystemPrompt();

      // Create a custom prompt based on the job type and patient info
      let customPrompt = `${systemPrompt.role}\n\n`;
      customPrompt += `Communication Style:\n${systemPrompt.communicationStyle.join('\n')}\n\n`;
      customPrompt += `Responsibilities:\n${systemPrompt.responsibilities.join('\n')}\n\n`;
      customPrompt += `Guidelines:\n${systemPrompt.guidelines.join('\n')}\n\n`;
      
      // Add patient-specific information
      customPrompt += `Patient Information:\n`;
      customPrompt += `Name: ${patient.name}\n`;
      customPrompt += `Age: ${patient.age}\n`;
      customPrompt += `Gender: ${patient.gender}\n`;
      customPrompt += `Medical History: ${patient.medicalHistory.conditions.join(', ')}\n`;
      customPrompt += `Medications: ${patient.medicalHistory.medications.join(', ')}\n`;
      customPrompt += `Allergies: ${patient.medicalHistory.allergies.join(', ')}\n\n`;

      // Add job-specific information
      const appointment = patient.appointments[0]; // Get the most recent appointment
      switch(jobType) {
        case 'checkup':
          customPrompt += `${systemPrompt.callTypes.checkup}\n`;
          customPrompt += `Last appointment: ${appointment.type} on ${appointment.date}\n`;
          customPrompt += `Notes: ${appointment.notes}\n`;
          break;
        case 'appointment':
          customPrompt += `${systemPrompt.callTypes.appointment}\n`;
          customPrompt += `Appointment type: ${appointment.type}\n`;
          customPrompt += `Date: ${appointment.date}\n`;
          customPrompt += `Notes: ${appointment.notes}\n`;
          break;
        case 'reminder':
          customPrompt += `${systemPrompt.callTypes.reminder}\n`;
          customPrompt += `Appointment type: ${appointment.type}\n`;
          customPrompt += `Date: ${appointment.date}\n`;
          customPrompt += `Notes: ${appointment.notes}\n`;
          break;
        default:
          customPrompt += `Please assist the patient with their healthcare needs.\n`;
      }

      // Add additional notes if provided
      if (additionalNotes) {
        customPrompt += `\nAdditional Notes:\n${additionalNotes}\n\n`;
      }

      // Add patient preferences
      customPrompt += `\nPatient Preferences:\n`;
      customPrompt += `Preferred contact time: ${patient.preferences.contactTime}\n`;
      customPrompt += `Language: ${patient.preferences.language}\n\n`;

      // Add first message
      customPrompt += `First Message: ${systemPrompt.firstMessage}\n`;

      const call = await twilioClient.calls.create({
        from: TWILIO_PHONE_NUMBER,
        to: patient.phone,
        url: `https://${request.headers.host}/outbound-call-twiml?prompt=${encodeURIComponent(customPrompt)}&patient=${encodeURIComponent(JSON.stringify(patient))}`
      });

      reply.send({ 
        success: true, 
        message: "Call initiated", 
        callSid: call.sid,
        patient: {
          id: patient.id,
          name: patient.name,
          phone: patient.phone
        }
      });
    } catch (error) {
      console.error("Error initiating call:", error);
      reply.code(500).send({ 
        success: false, 
        error: "Failed to initiate call" 
      });
    }
  });

  // TwiML route for outbound calls
  fastify.all("/outbound-call-twiml", async (request, reply) => {
    const prompt = request.query.prompt || '';
    const patient = request.query.patient ? JSON.parse(decodeURIComponent(request.query.patient)) : null;
    const systemPrompt = ehrData.systemPrompt;

    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Connect>
          <Stream url="wss://${request.headers.host}/outbound-media-stream">
            <Parameter name="prompt" value="${prompt}" />
            <Parameter name="patient" value="${encodeURIComponent(JSON.stringify(patient))}" />
            <Parameter name="systemPrompt" value="${encodeURIComponent(JSON.stringify(systemPrompt))}" />
          </Stream>
        </Connect>
        <Gather input="speech" speechTimeout="auto" speechModel="phone_call" enhanced="true" speechThreshold="0.7">
          <Say>Please speak after the tone.</Say>
        </Gather>
      </Response>`;

    reply.type("text/xml").send(twimlResponse);
  });

  // WebSocket route for handling media streams
  fastify.register(async (fastifyInstance) => {
    fastifyInstance.get("/outbound-media-stream", { websocket: true }, (ws, req) => {
      let streamSid = null;
      let callSid = null;
      let elevenLabsWs = null;
      let customParameters = null;
      let currentPrompt = null;
      let systemPromptData = null;
      let patientId = null;

      ws.on('error', console.error);

      const setupElevenLabs = async () => {
        try {
          const signedUrl = await getSignedUrl();
          elevenLabsWs = new WebSocket(signedUrl);

          elevenLabsWs.on("open", () => {
            const initialConfig = {
              type: "conversation_initiation_client_data",
              conversation_config_override: {
                agent: {
                  prompt: { 
                    prompt: currentPrompt || "You are a healthcare assistant.",
                    context: {
                      patient: customParameters?.patient || {}
                    }
                  },
                  first_message: systemPromptData?.firstMessage || "Hello! This is MediConnect AI calling from HealthAssist. I'm reaching out regarding your upcoming healthcare appointment. Is this a good time to talk for a moment?"
                },
              }
            };
            elevenLabsWs.send(JSON.stringify(initialConfig));
          });

          elevenLabsWs.on("message", (data) => {
            try {
              const message = JSON.parse(data);

              switch (message.type) {
                case "user_transcript":
                  console.log("\n👤 User Raw Message:", JSON.stringify(message, null, 2));
                  // Save user transcript
                  if (patientId) {
                    saveTranscript(patientId, {
                      type: "user",
                      content: message.text,
                      raw: message
                    });
                  }
                  break;

                case "agent_response":
                  console.log("🤖 AI Raw Message:", JSON.stringify(message, null, 2));
                  // Save AI response
                  if (patientId) {
                    saveTranscript(patientId, {
                      type: "ai",
                      content: message.text,
                      raw: message
                    });
                  }
                  break;

                case "audio":
                  if (streamSid) {
                    if (message.audio?.chunk) {
                      const audioData = {
                        event: "media",
                        streamSid,
                        media: {
                          payload: message.audio.chunk
                        }
                      };
                      ws.send(JSON.stringify(audioData));
                    } else if (message.audio_event?.audio_base_64) {
                      const audioData = {
                        event: "media",
                        streamSid,
                        media: {
                          payload: message.audio_event.audio_base_64
                        }
                      };
                      ws.send(JSON.stringify(audioData));
                    }
                  }
                  break;

                case "interruption":
                  if (streamSid) {
                    ws.send(JSON.stringify({ 
                      event: "clear",
                      streamSid 
                    }));
                  }
                  break;

                case "ping":
                  if (message.ping_event?.event_id) {
                    elevenLabsWs.send(JSON.stringify({
                      type: "pong",
                      event_id: message.ping_event.event_id
                    }));
                  }
                  break;
              }
            } catch (error) {
              console.error("Error processing message:", error);
            }
          });

          elevenLabsWs.on("error", (error) => {
            console.error("WebSocket error:", error);
          });

          elevenLabsWs.on("close", () => {});
        } catch (error) {
          console.error("Setup error:", error);
        }
      };

      setupElevenLabs();

      ws.on("message", (message) => {
        try {
          const msg = JSON.parse(message);

          switch (msg.event) {
            case "start":
              streamSid = msg.start.streamSid;
              callSid = msg.start.callSid;
              customParameters = msg.start.customParameters;
              currentPrompt = customParameters?.prompt;
              
              // Extract patient ID from parameters
              if (customParameters?.patient) {
                try {
                  const patientData = JSON.parse(decodeURIComponent(customParameters.patient));
                  patientId = patientData.id;
                  console.log(`Starting call with patient ID: ${patientId}`);
                  
                  // Reset transcript when a new call starts
                  resetTranscript(patientId);
                } catch (e) {
                  console.error("Error parsing patient data:", e);
                }
              }
              
              if (customParameters?.systemPrompt) {
                try {
                  systemPromptData = JSON.parse(decodeURIComponent(customParameters.systemPrompt));
                } catch (e) {
                  console.error("Error parsing system prompt:", e);
                }
              }
              break;

            case "media":
              if (elevenLabsWs?.readyState === WebSocket.OPEN) {
                const audioMessage = {
                  user_audio_chunk: Buffer.from(msg.media.payload, "base64").toString("base64")
                };
                elevenLabsWs.send(JSON.stringify(audioMessage));
              }
              break;

            case "stop":
              if (elevenLabsWs?.readyState === WebSocket.OPEN) {
                elevenLabsWs.close();
              }
              break;
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      });

      ws.on("close", () => {
        if (elevenLabsWs?.readyState === WebSocket.OPEN) {
          elevenLabsWs.close();
        }
      });
    });
  });
}