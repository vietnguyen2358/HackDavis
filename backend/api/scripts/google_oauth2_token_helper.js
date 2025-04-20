// Helper script to generate Google OAuth2 access and refresh tokens for server-to-server use
// Usage: node scripts/google_oauth2_token_helper.js
import { google } from "googleapis";
import readline from "readline";
import dotenv from "dotenv";
dotenv.config({ path: '../../.env' });

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth2callback"; // You can add this URI in your Google Cloud Console

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events"
];

function getAccessToken() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", async (code) => {
    rl.close();
    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log("\nAdd the following lines to your .env file:");
      if (tokens.access_token) console.log(`GOOGLE_ACCESS_TOKEN=${tokens.access_token}`);
      if (tokens.refresh_token) console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
      process.exit(0);
    } catch (err) {
      console.error("Error retrieving access token", err);
      process.exit(1);
    }
  });
}

getAccessToken();
