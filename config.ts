/**
 * Rainbow Leaderboard Configuration
 * Update these values at the beginning of each month
 */

interface Config {
  // Wattpad chapter details
  chapterId: string;
  chapterUrl: string;
  
  // Refresh interval in milliseconds
  refreshInterval: number;
}

const config: Config = {
  // Wattpad chapter details
  chapterId: "1573385572",
  chapterUrl: "https://www.wattpad.com/1573385572-rainbow-bookclub-september-2025",
  
  // Refresh interval in milliseconds (10 minutes)
  refreshInterval: 10 * 60 * 1000
};

// Export for Node.js (backend)
export default config;
