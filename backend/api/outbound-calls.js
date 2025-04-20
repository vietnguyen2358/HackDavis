import WebSocket from "ws";
import Twilio from "twilio";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure transcripts directory exists
const transcriptsDir = path.join(__dirname, 'data', 'transcripts');
if (!fs.existsSync(transcriptsDir)) {
  fs.mkdirSync(transcriptsDir, { recursive: true });
}

// Create a directory for temporary prompts
const promptsDir = path.join(__dirname, 'data', 'prompts');
if (!fs.existsSync(promptsDir)) {
  fs.mkdirSync(promptsDir, { recursive: true });
}

// In-memory store for temporary session data
const sessionData = new Map();

// Load EHR data - use the correct path
const ehrFilePath = path.join(__dirname, 'data', 'ehr.json');
let ehrData = null;

try {
  if (fs.existsSync(ehrFilePath)) {
    ehrData = JSON.parse(fs.readFileSync(ehrFilePath, 'utf8'));
    console.log('Loaded EHR data from file');
  } else {
    console.error('EHR file not found at:', ehrFilePath);
  }
} catch (error) {
  console.error('Error loading EHR data:', error);
}

export function registerOutboundRoutes(fastify) {
  // Check for required environment variables
  const { 
    ELEVENLABS_API_KEY, 
    ELEVENLABS_AGENT_ID,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    NGROK_URL
  } = process.env;

  if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error("Missing required environment variables");
    throw new Error("Missing required environment variables");
  }

  if (!NGROK_URL) {
    console.warn("NGROK_URL environment variable is not set. Outbound calls may not work correctly.");
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
      
      // Log that we saved the transcript
      console.log(`Transcript saved for patient ${patientId}:`, JSON.stringify(messageWithTimestamp, null, 2));
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
    console.log("[Debug] Received outbound call request:", JSON.stringify(request.body, null, 2));
    const { patientId, jobType, number } = request.body;

    if (!patientId) {
      console.log("[Debug] Missing patient ID in request");
      return reply.code(400).send({ error: "Patient ID is required" });
    }

    try {
      // Find patient in EHR
      console.log("[Debug] Looking for patient in EHR data, patientId:", patientId);
      console.log("[Debug] EHR data available:", !!ehrData);
      if (ehrData) {
        console.log("[Debug] EHR patients count:", ehrData.patients?.length || 0);
      }
      
      const patient = ehrData?.patients?.find(p => p.id === patientId);
      if (!patient) {
        console.log("[Debug] Patient not found in EHR data");
        return reply.code(404).send({ error: "Patient not found" });
      }
      
      console.log("[Debug] Found patient in EHR:", patient.name);

      // Use phone number from request if available, otherwise from patient data
      const phoneNumber = number || patient.phone;
      
      if (!phoneNumber) {
        return reply.code(400).send({ error: "Phone number is required" });
      }

      console.log("[Debug] Using phone number:", phoneNumber);
      
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
      console.log("[Debug] Host header:", request.headers.host);
      console.log("[Debug] Request protocol:", request.protocol);
      
      // Get ngrok URL from environment variable or use hardcoded fallback
      const ngrokUrl = process.env.NGROK_URL || "https://4c14-128-120-27-122.ngrok-free.app";
      console.log("[Debug] Using ngrok URL:", ngrokUrl);

      // Create a unique session ID for this call
      const sessionId = crypto.randomUUID();
      
      // Store the prompt and patient data in session
      sessionData.set(sessionId, {
        prompt: customPrompt,
        patient: patient,
        timestamp: Date.now()
      });
      
      // Also save to a file as backup
      fs.writeFileSync(
        path.join(promptsDir, `${sessionId}.json`), 
        JSON.stringify({ prompt: customPrompt, patient })
      );
      
      console.log("[Debug] Created session:", sessionId);

      // Use ngrok URL if available, otherwise fallback to request host
      const baseUrl = ngrokUrl || `https://${request.headers.host}`;
      // Use a much shorter URL with just the session ID
      const twimlUrl = `${baseUrl}/outbound-call-twiml?sessionId=${sessionId}`;
      console.log("[Debug] TwiML URL:", twimlUrl);

      try {
        const call = await twilioClient.calls.create({
          from: TWILIO_PHONE_NUMBER,
          to: phoneNumber,
          url: twimlUrl
        });
        
        console.log("[Debug] Twilio call created:", call.sid);

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
        // Log detailed error information
        if (error.message) console.error("Error message:", error.message);
        if (error.code) console.error("Error code:", error.code);
        if (error.stack) console.error("Error stack:", error.stack);
        
        reply.code(500).send({ 
          success: false, 
          error: "Failed to initiate call",
          details: error.message 
        });
      }
    } catch (error) {
      console.error("Error initiating outbound call:", error);
      // Log detailed error information
      if (error.message) console.error("Error message:", error.message);
      if (error.code) console.error("Error code:", error.code);
      if (error.stack) console.error("Error stack:", error.stack);
      
      reply.code(500).send({ 
        success: false, 
        error: "Failed to initiate call",
        details: error.message 
      });
    }
  });

  // TwiML route for outbound calls
  fastify.all("/outbound-call-twiml", async (request, reply) => {
    // Get the session ID from the query params
    const sessionId = request.query.sessionId;
    let prompt = '';
    let patient = null;
    
    if (sessionId) {
      // Try to get data from in-memory session first
      const session = sessionData.get(sessionId);
      if (session) {
        prompt = session.prompt;
        patient = session.patient;
        console.log(`[Debug] Found session ${sessionId} in memory`);
      } else {
        // Fall back to file if not in memory
        try {
          const sessionFile = path.join(promptsDir, `${sessionId}.json`);
          if (fs.existsSync(sessionFile)) {
            const data = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
            prompt = data.prompt;
            patient = data.patient;
            console.log(`[Debug] Loaded session ${sessionId} from file`);
          }
        } catch (error) {
          console.error(`[Debug] Error loading session ${sessionId} from file:`, error);
        }
      }
    } else {
      // For backward compatibility
      prompt = request.query.prompt || '';
      patient = request.query.patient ? JSON.parse(decodeURIComponent(request.query.patient)) : null;
    }
    
    const systemPrompt = ehrData.systemPrompt;

    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Connect>
          <Stream url="wss://${request.headers.host}/outbound-media-stream">
            <Parameter name="sessionId" value="${sessionId || ''}" />
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
      let patientId = null;  // Add this to store patient ID
      let sessionId = null;  // Add this to store the session ID

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
              // Log the raw data for debugging
              console.log("Raw message:", data.toString());
              
              // Try to parse the message
              const message = JSON.parse(data);
              
              // Log the complete message object
              console.log("Complete message:", JSON.stringify(message, null, 2));
              
              // Just log the raw text content directly
              if (message.type === "user_transcript" && message.text) {
                console.log("\n👤 User:", message.text);
              } else if (message.type === "agent_response" && message.text) {
                console.log("\n🤖 AI:", message.text);
              } else {
                // If we don't have text, log the entire message
                console.log("\n📝 Message:", JSON.stringify(message, null, 2));
              }
              
              // Handle audio data
              if (message.type === "audio" && streamSid) {
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
              
              // Handle interruption
              if (message.type === "interruption" && streamSid) {
                ws.send(JSON.stringify({ 
                  event: "clear",
                  streamSid 
                }));
              }
              
              // Handle ping
              if (message.type === "ping" && message.ping_event?.event_id) {
                elevenLabsWs.send(JSON.stringify({
                  type: "pong",
                  event_id: message.ping_event.event_id
                }));
              }
            } catch (error) {
              // If there's an error parsing, just log the raw data
              console.log("Raw message (parse error):", data.toString());
            }
          });

          elevenLabsWs.on("error", (error) => {
            console.error("WebSocket error:", error);
          });

          elevenLabsWs.on("close", (code, reason) => {
            console.log("WebSocket closed");
          });
        } catch (error) {
          console.error("Setup error:", error);
        }
      };

      // Set up ElevenLabs connection
      setupElevenLabs();

      // Handle messages from Twilio
      ws.on("message", (message) => {
        try {
          const msg = JSON.parse(message);

          switch (msg.event) {
            case "start":
              streamSid = msg.start.streamSid;
              callSid = msg.start.callSid;
              customParameters = msg.start.customParameters;
              
              // Get the session ID from parameters
              sessionId = customParameters?.sessionId;
              
              if (sessionId) {
                console.log(`[Debug] Got session ID: ${sessionId}`);
                
                // Load prompt and patient data from session
                const session = sessionData.get(sessionId);
                if (session) {
                  currentPrompt = session.prompt;
                  patientId = session.patient.id;
                  console.log(`[Debug] Loaded session from memory: ${sessionId}`);
                  
                  // Reset transcript when a new call starts
                  resetTranscript(patientId);
                } else {
                  // Try to load from file
                  try {
                    const sessionFile = path.join(promptsDir, `${sessionId}.json`);
                    if (fs.existsSync(sessionFile)) {
                      const data = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
                      currentPrompt = data.prompt;
                      patientId = data.patient.id;
                      console.log(`[Debug] Loaded session from file: ${sessionId}`);
                      
                      // Reset transcript when a new call starts
                      resetTranscript(patientId);
                    }
                  } catch (error) {
                    console.error(`[Debug] Error loading session from file: ${error}`);
                  }
                }
              } else {
                // For backward compatibility
                currentPrompt = customParameters?.prompt;  // Store the prompt
              
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
              }
              
              // Parse the system prompt if it exists
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

      // Handle WebSocket closure
      ws.on("close", () => {
        if (elevenLabsWs?.readyState === WebSocket.OPEN) {
          elevenLabsWs.close();
        }
      });
    });
  });
}