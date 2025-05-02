// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Tracking endpoint
app.post('/api/track', (req, res) => {
  const events = Array.isArray(req.body) ? req.body : [req.body];
  
  // Log received events
  console.log('Received tracking events:');
  events.forEach((event, index) => {
    console.log(`Event ${index + 1}: ${event.eventType}`);
    console.log(JSON.stringify(event, null, 2));
    console.log('-------------------');
  });
  
  // Send success response
  res.status(200).json({ 
    success: true, 
    message: `Processed ${events.length} events` 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock tracking server running on http://localhost:${PORT}`);
});
