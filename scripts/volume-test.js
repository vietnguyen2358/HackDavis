const { exec } = require('child_process');

// Function to get the current volume
function getVolume() {
  return new Promise((resolve, reject) => {
    exec('osascript -e "output volume of (get volume settings)"', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(parseInt(stdout.trim(), 10));
    });
  });
}

// Variables to track volume changes
let lastVolume = null;
let startTime = Date.now();

// Monitor volume changes
async function monitorVolume() {
  try {
    const currentVolume = await getVolume();
    
    const currentTime = Date.now();
    const elapsedSeconds = ((currentTime - startTime) / 1000).toFixed(1);
    
    // First time, just store the volume
    if (lastVolume === null) {
      console.log(`[${elapsedSeconds}s] Initial volume: ${currentVolume}`);
    } else if (currentVolume > lastVolume) {
      console.log(`[${elapsedSeconds}s] Volume UP: ${lastVolume} -> ${currentVolume}`);
    } else if (currentVolume < lastVolume) {
      console.log(`[${elapsedSeconds}s] Volume DOWN: ${lastVolume} -> ${currentVolume}`);
    }
    
    lastVolume = currentVolume;
  } catch (error) {
    console.error('Error getting volume:', error);
  }
}

console.log('Volume monitor started. Press volume up/down keys and watch for changes.');
console.log('Press Ctrl+C to exit.');

// Check volume every 200ms (same interval as your hook)
setInterval(monitorVolume, 200); 