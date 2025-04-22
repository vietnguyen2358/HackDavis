# MedScribe

## Overview

MedScribe is a powerful healthcare AI-Agent platform that helps medical professionals streamline their workflow, reduce administrative burden, and focus more on patient care. The application leverages AI to manage transcriptions, automate documentation, and optimize scheduling.

## Features

- **AI-Powered Transcription**: Automatically transcribe patient conversations and medical notes
- **Smart Documentation**: Generate and organize medical documentation with AI assistance
- **Dashboard Analytics**: Track metrics and visualize workflow efficiency
- **Patient Management**: Maintain comprehensive patient records
- **Calendar Integration**: Manage appointments and schedules efficiently
- **Workflow Automation**: Streamline repetitive tasks and administrative processes

## Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, ShadCN, Framer Motion
- **Backend**: ElevenLabs, Google Gemini, Twilio, Node.js, MongoDB Atlas, Fastify, ngrok
- **Hardware**: Meta Ray-Ban Glasses
- **AI Integration**: Google Generative AI

![Architecture Diagram](https://cdn.discordapp.com/attachments/1347445504807796766/1363530836808569032/image.png?ex=6807b00c&is=68065e8c&hm=4d696fa892b8928d518c237fe06f2ebf1eb3a9bc82ea7c05ea485761e502c0c8&)


## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd mediscribe-ai
   ```

2. Install dependencies
   ```
   npm install
   # or
   pnpm install
   ```

3. Create a `.env` file in the root directory with required environment variables:
   ```
   # Example .env file
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   GOOGLE_AI_API_KEY=your_api_key_here
   ```

4. Start the development server
   ```
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

- `/app`: Main application routes and pages
  - `/api`: API routes for backend functionality
  - `/dashboard`: Dashboard views and components
  - `/patients`: Patient management interface
  - `/calendar`: Calendar and scheduling tools

- `/components`: Reusable React components
- `/lib`: Utility functions and shared code
- `/public`: Static assets
- `/styles`: Global CSS and styling configurations
- `/data`: Local data storage (for development)

## API Endpoints

### Transcriptions

- `GET /api/transcriptions`: Retrieve all transcriptions
- `POST /api/transcriptions`: Create a new transcription
- `GET /api/transcriptions/[id]`: Get a specific transcription by ID

### Patients

- `GET /api/patients`: Retrieve all patients
- `POST /api/patients`: Create a new patient record

### Appointments

- `GET /api/appointments`: Retrieve all appointments
- `POST /api/appointments`: Create a new appointment

## Development

### Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production application
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint for code quality
- `npm run test`: Execute Jest tests

## Performance Considerations

The application includes a low-bandwidth mode for users with slower connections, which can be toggled in the UI. This mode disables resource-intensive animations and visual effects.

