const http = require('http');
const { scrapeWattpadData } = require('./wattpad-scraper');

const PORT = 3000;

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

  // Only handle GET requests to /api/leaderboard
  if (req.method === 'GET' && req.url === '/api/leaderboard') {
    try {
      console.log('Scraping started...');
      const data = await scrapeWattpadData();
      console.log('Scraping completed successfully');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to scrape data' }));
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Leaderboard API available at http://localhost:${PORT}/api/leaderboard`);
});