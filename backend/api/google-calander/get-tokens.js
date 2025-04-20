import dotenv from 'dotenv';
import path from 'path';

// Use import.meta.url to get the current directory in ES modules
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { google } from "googleapis";
import readline from 'readline';

// Replace these with your actual credentials or load from .env
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
});

console.log('Authorize this app by visiting this URL:\n', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\nEnter the code from that page here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Your tokens:\n');
    console.log(tokens); // <-- access_token and refresh_token
    rl.close();
  } catch (err) {
    console.error('❌ Error retrieving tokens:', err);
    rl.close();
  }
});
