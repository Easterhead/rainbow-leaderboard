const config = require('../config');
const { fetchWattpadData } = require('../backend/wattpad-api');

// This file contains the vercel endpoint api/leaderboard (the path and file names are the magic)

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
    // Fetch fresh data from Wattpad API
    console.log('Fetching fresh data from Wattpad API...');
    const leaderboardData = await fetchWattpadData();
    console.log(`Data fetched at ${new Date().toLocaleTimeString()}`);
    
    // Return the data
    return res.status(200).json(leaderboardData);
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
};