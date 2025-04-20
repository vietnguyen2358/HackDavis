const fetch = require('node-fetch');

// Function to get volume from API
async function getVolumeFromAPI() {
  try {
    const response = await fetch('http://localhost:3005/api/system-volume');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from API:', error);
    return null;
  }
}

// Test the API
async function testAPI() {
  console.log('Testing system-volume API...');
  console.log('Change your volume up/down to see if the API detects it.');
  console.log('This test will run for 30 seconds.');
  console.log('Press Ctrl+C to exit early.');
  console.log('-----------------------------------------------------');
  
  const startTime = Date.now();
  const runDuration = 30000; // Run for 30 seconds
  
  while (Date.now() - startTime < runDuration) {
    const volumeData = await getVolumeFromAPI();
    
    if (volumeData) {
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[${elapsedTime}s] Volume: ${volumeData.volume}, Change: ${volumeData.change}`);
    }
    
    // Wait before the next request
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('Test complete.');
  process.exit(0);
}

testAPI().catch(console.error); 