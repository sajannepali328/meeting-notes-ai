chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'EVENT_DETECTED') {
    sendToBackend(request.payload);
  }
  return true; 
});

async function sendToBackend(payload) {
  try {
    const textContent = typeof payload === 'string' ? payload : JSON.stringify(payload);

    const response = await fetch('http://localhost:8001/api/notes/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      // Correctly stringify the JSON payload for fetch
      body: JSON.stringify({
        raw_text: textContent
      })
    });

    const result = await response.json();
    console.log('[Background] API success:', result);
  } catch (error) {
    console.error('[Background] API error:', error);
  }
}