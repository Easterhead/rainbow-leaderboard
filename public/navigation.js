/**
 * Navigation functionality for Rainbow Leaderboard
 * Handles navigation between pages
 */

/**
 * Navigates to the report reading page
 */
function navigateToReportReading() {
    window.location.href = 'report-reading.html';
}

/**
 * Initialize navigation event listeners
 */
function initializeNavigation() {
    const reportButton = document.querySelector('.report-reading-button');
    if (reportButton) {
        reportButton.addEventListener('click', navigateToReportReading);
    }
}

// Initialize navigation when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateToReportReading
    };
}