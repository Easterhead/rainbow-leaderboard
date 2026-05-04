/**
 * Rainbow Leaderboard Configuration
 * Update these values at the beginning of each month
 */
const config = {
  
  // Wattpad chapter details
  chapterId: "1625732958",
  chapterUrl: "https://www.wattpad.com/1625732958-rainbow-bookclub-may-2026",
    
  // Refresh interval in milliseconds (10 minutes)
  refreshInterval: 10 * 60 * 1000
};

// Export for Node.js (backend)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}