const http = require('http');
const { fetchWattpadData } = require('./wattpad-api');  // Import the new function

const PORT = 3000;

// Store the data in memory
let cachedData = null;
let lastFetchTime = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds (changed from 60 minutes)

const server = http.createServer(async (req, res) => {
  // Set CORS headers to allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse query parameters
  const url = new URL(req.url, `http://${req.headers.host}`);
  const forceRefresh = url.searchParams.get('refresh') === 'true';

  // Only handle GET requests to /api/leaderboard
  if (req.method === 'GET' && url.pathname === '/api/leaderboard') {
    try {
      const currentTime = new Date().getTime();
      const needsRefresh = forceRefresh || 
                          !cachedData || 
                          !lastFetchTime || 
                          (currentTime - lastFetchTime > CACHE_DURATION);
      
      if (needsRefresh) {
        console.log('Fetching fresh data from Wattpad API...');
        cachedData = await fetchWattpadData();
        lastFetchTime = currentTime;
        console.log(`Data refreshed at ${new Date().toLocaleTimeString()}`);
      } else {
        console.log('Serving cached data...');
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cachedData));
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch data' }));
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Increase the server timeout to 2 minutes (120,000 ms)
server.timeout = 120000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Leaderboard API available at http://localhost:${PORT}/api/leaderboard`);
  console.log(`Server timeout set to ${server.timeout}ms`);
});