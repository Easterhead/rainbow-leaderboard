/**
 * Rainbow Leaderboard Configuration
 * Update these values at the beginning of each month
 */
const config = {
  // Current month and year
  currentMonth: "September",
  currentYear: "2025",
  
  // Wattpad chapter details
  chapterId: "1573385572",
  chapterUrl: "https://www.wattpad.com/1573385572-rainbow-bookclub-september-2025",
  
  // API configuration
  apiBaseUrl: "https://rainbow-leaderboard.vercel.app/api",
  localApiUrl: "http://localhost:3000/api",
  
  // Refresh interval in milliseconds (10 minutes)
  refreshInterval: 10 * 60 * 1000
};

// Export for Node.js (backend)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}