const config = require('../config');
const { fetchWattpadData } = require('../wattpad-api');

// Use config for cache duration
const CACHE_DURATION = config.refreshInterval;

// Store the data in memory (note: this will reset between function invocations)
let cachedData = null;
let lastFetchTime = null;

/**
 * Serverless function handler for /api/leaderboard
 * This can be deployed to platforms like Vercel, Netlify, or AWS Lambda
 */
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters - different platforms handle this differently
    const forceRefresh = req.query?.refresh === 'true';
    
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
    
    // Return the data as JSON
    return res.status(200).json(cachedData);
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
};