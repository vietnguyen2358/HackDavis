import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Store the last volume level in memory (server-side state)
let lastVolume: number | null = null;

export async function GET() {
  try {
    // Only run on macOS
    if (process.platform !== 'darwin') {
      return NextResponse.json({ error: 'This endpoint only works on macOS' }, { status: 400 });
    }

    // Execute AppleScript to get current volume
    const { stdout } = await execPromise('osascript -e "output volume of (get volume settings)"');
    const currentVolume = parseInt(stdout.trim(), 10);
    
    let volumeChange = 'none';
    
    // Detect volume change direction
    if (lastVolume !== null) {
      if (currentVolume > lastVolume) {
        volumeChange = 'up';
      } else if (currentVolume < lastVolume) {
        volumeChange = 'down';
      }
    }
    
    // Update last volume
    lastVolume = currentVolume;
    
    return NextResponse.json({
      volume: currentVolume,
      change: volumeChange
    });
  } catch (error) {
    console.error('Error checking system volume:', error);
    return NextResponse.json({ error: 'Failed to check system volume' }, { status: 500 });
  }
} 