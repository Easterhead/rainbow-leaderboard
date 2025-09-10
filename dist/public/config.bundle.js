/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!*********************************!*\
  !*** ./public/client_config.ts ***!
  \*********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
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
exports["default"] = clientConfig;

})();

/******/ })()
;
//# sourceMappingURL=config.bundle.js.map