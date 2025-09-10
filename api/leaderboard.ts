import { VercelRequest, VercelResponse } from '@vercel/node';
import config from '../config';
import { fetchWattpadData } from '../backend/wattpad-api';
import { LeaderboardEntry } from '../types';

// This file contains the vercel endpoint api/leaderboard (the path and file names are the magic)

/**
 * Serverless function handler for /api/leaderboard
 * This can be deployed to platforms like Vercel, Netlify, or AWS Lambda
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
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
    console.log('Using chapterId:', config.chapterId);  // Add this debug line
    const leaderboardData: LeaderboardEntry[] = await fetchWattpadData();
    console.log(`Data fetched at ${new Date().toLocaleTimeString()}. Found ${leaderboardData.length} entries.`);  // Enhanced log
    
    // Return the data
    return res.status(200).json({
      success: true,
      data: leaderboardData,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error handling request:', error instanceof Error ? error.message : String(error));
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch data',
      data: []
    });
  }
}
