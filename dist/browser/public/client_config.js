/**
 * Rainbow Leaderboard Configuration
 * Update these values month values at beginning of each month
 */
const clientConfig = {
    // Dates/content
    currentMonth: "September",
    currentYear: "2025",
    // API endpoints
    apiBaseUrl: "https://rainbow-leaderboard.vercel.app/api",
    localApiUrl: "http://localhost:3000/api",
    // Misc
    refreshInterval: 10 * 60 * 1000
};
// Expose config to the window object in browser environment
// This ensures the config is available globally in the browser
window.client_config = clientConfig;
export default clientConfig;
//# sourceMappingURL=client_config.js.map