import WebSocket from "ws";
import Twilio from "twilio";
import fs from 'fs';
import path from 'path';

// Load EHR data
const ehrData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'ehr.json'), 'utf8'));

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
      console.log("[Debug] Attempting to get signed URL from ElevenLabs");
      console.log("[Debug] Using Agent ID:", ELEVENLABS_AGENT_ID);
      
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
        console.error("[Debug] Failed to get signed URL. Status:", response.status);
        console.error("[Debug] Response text:", await response.text());
        throw new Error(`Failed to get signed URL: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("[Debug] Successfully got signed URL");
      return data.signed_url;
    } catch (error) {
      console.error("[Debug] Error getting signed URL:", error);
      throw error;
    }
  }

  // Route to initiate outbound calls
  fastify.post("/outbound-call", async (request, reply) => {
    const { patientId, jobType } = request.body;

    if (!patientId) {
      return reply.code(400).send({ error: "Patient ID is required" });
    }

    try {
      // Find patient in EHR
      const patient = ehrData.patients.find(p => p.id === patientId);
      if (!patient) {
        return reply.code(404).send({ error: "Patient not found" });
      }

      // Get the system prompt
      const systemPrompt = ehrData.systemPrompt;

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

      // Add patient preferences
      customPrompt += `\nPatient Preferences:\n`;
      customPrompt += `Preferred contact time: ${patient.preferences.contactTime}\n`;
      customPrompt += `Language: ${patient.preferences.language}\n\n`;

      // Add first message
      customPrompt += `First Message: ${systemPrompt.firstMessage}\n`;

      console.log("[Debug] Initiating call with prompt:", customPrompt);

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
        },
        prompt: customPrompt
      });
    } catch (error) {
      console.error("Error initiating outbound call:", error);
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
      </Response>`;

    reply.type("text/xml").send(twimlResponse);
  });

  // WebSocket route for handling media streams
  fastify.register(async (fastifyInstance) => {
    fastifyInstance.get("/outbound-media-stream", { websocket: true }, (ws, req) => {
      console.info("[Server] Twilio connected to outbound media stream");

      // Variables to track the call
      let streamSid = null;
      let callSid = null;
      let elevenLabsWs = null;
      let customParameters = null;
      let currentPrompt = null;  // Add this to store the prompt
      let systemPromptData = null;  // Add this to store the system prompt

      // Handle WebSocket errors
      ws.on('error', console.error);

      // Set up ElevenLabs connection
      const setupElevenLabs = async () => {
        try {
          console.log("[Debug] Setting up ElevenLabs connection");
          console.log("[Debug] Using API Key:", ELEVENLABS_API_KEY ? "Present" : "Missing");
          console.log("[Debug] Using Agent ID:", ELEVENLABS_AGENT_ID);
          
          const signedUrl = await getSignedUrl();
          console.log("[Debug] Got signed URL:", signedUrl);
          
          elevenLabsWs = new WebSocket(signedUrl);

          elevenLabsWs.on("open", () => {
            console.log("[ElevenLabs] Connected to Conversational AI");
            console.log("[ElevenLabs] Sending initial configuration");

            // Send initial configuration with prompt and first message
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

            console.log("[ElevenLabs] Initial config:", JSON.stringify(initialConfig));
            elevenLabsWs.send(JSON.stringify(initialConfig));
          });

          elevenLabsWs.on("message", (data) => {
            try {
              const message = JSON.parse(data);
              console.log("[ElevenLabs] Received message type:", message.type);
              console.log("[ElevenLabs] Full message:", JSON.stringify(message));

              switch (message.type) {
                case "conversation_initiation_metadata":
                  console.log("[ElevenLabs] Received initiation metadata:", JSON.stringify(message));
                  break;

                case "user_transcript":
                  console.log("[ElevenLabs] Received user transcript:", message.text);
                  // If the user asks about their data, we can send it to ElevenLabs
                  if (message.text.toLowerCase().includes("my information") || 
                      message.text.toLowerCase().includes("my data") ||
                      message.text.toLowerCase().includes("my medical history")) {
                    const contextMessage = {
                      type: "context_update",
                      context: {
                        patient: {
                          id: patient.id,
                          name: patient.name,
                          age: patient.age,
                          gender: patient.gender,
                          medicalHistory: patient.medicalHistory,
                          appointments: patient.appointments,
                          preferences: patient.preferences
                        }
                      }
                    };
                    elevenLabsWs.send(JSON.stringify(contextMessage));
                  }
                  break;

                case "agent_response":
                  console.log("[ElevenLabs] Received agent response:", message.text);
                  break;

                case "audio":
                  console.log("[ElevenLabs] Received audio response");
                  if (streamSid) {
                    if (message.audio?.chunk) {
                      console.log("[ElevenLabs] Using audio.chunk format");
                      const audioData = {
                        event: "media",
                        streamSid,
                        media: {
                          payload: message.audio.chunk
                        }
                      };
                      ws.send(JSON.stringify(audioData));
                    } else if (message.audio_event?.audio_base_64) {
                      console.log("[ElevenLabs] Using audio_event.audio_base_64 format");
                      const audioData = {
                        event: "media",
                        streamSid,
                        media: {
                          payload: message.audio_event.audio_base_64
                        }
                      };
                      ws.send(JSON.stringify(audioData));
                    }
                  } else {
                    console.log("[ElevenLabs] Received audio but no StreamSid yet");
                  }
                  break;

                case "interruption":
                  console.log("[ElevenLabs] Received interruption event");
                  if (streamSid) {
                    ws.send(JSON.stringify({ 
                      event: "clear",
                      streamSid 
                    }));
                  }
                  break;

                case "ping":
                  console.log("[ElevenLabs] Received ping, sending pong");
                  if (message.ping_event?.event_id) {
                    elevenLabsWs.send(JSON.stringify({
                      type: "pong",
                      event_id: message.ping_event.event_id
                    }));
                  }
                  break;

                default:
                  console.log(`[ElevenLabs] Unhandled message type: ${message.type}`, JSON.stringify(message));
              }
            } catch (error) {
              console.error("[ElevenLabs] Error processing message:", error);
            }
          });

          elevenLabsWs.on("error", (error) => {
            console.error("[ElevenLabs] WebSocket error:", error);
          });

          elevenLabsWs.on("close", (code, reason) => {
            console.log(`[ElevenLabs] Disconnected with code ${code}, reason: ${reason}`);
          });
        } catch (error) {
          console.error("[ElevenLabs] Setup error:", error);
        }
      };

      // Set up ElevenLabs connection
      setupElevenLabs();

      // Handle messages from Twilio
      ws.on("message", (message) => {
        try {
          const msg = JSON.parse(message);
          console.log(`[Twilio] Received event: ${msg.event}`);

          switch (msg.event) {
            case "start":
              streamSid = msg.start.streamSid;
              callSid = msg.start.callSid;
              customParameters = msg.start.customParameters;
              currentPrompt = customParameters?.prompt;  // Store the prompt
              
              // Parse the system prompt if it exists
              if (customParameters?.systemPrompt) {
                try {
                  systemPromptData = JSON.parse(decodeURIComponent(customParameters.systemPrompt));
                  console.log("[Debug] Loaded system prompt:", systemPromptData);
                } catch (e) {
                  console.error("[Debug] Error parsing system prompt:", e);
                }
              }
              
              console.log(`[Twilio] Stream started - StreamSid: ${streamSid}, CallSid: ${callSid}`);
              console.log('[Twilio] Start parameters:', customParameters);
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
              console.log(`[Twilio] Stream ${streamSid} ended`);
              if (elevenLabsWs?.readyState === WebSocket.OPEN) {
                elevenLabsWs.close();
              }
              break;

            default:
              console.log(`[Twilio] Unhandled event: ${msg.event}`);
          }
        } catch (error) {
          console.error("[Twilio] Error processing message:", error);
        }
      });

      // Handle WebSocket closure
      ws.on("close", () => {
        console.log("[Twilio] Client disconnected");
        if (elevenLabsWs?.readyState === WebSocket.OPEN) {
          elevenLabsWs.close();
        }
      });
    });
  });
}