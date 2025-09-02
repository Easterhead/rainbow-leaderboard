// Global variables for the timer
let countdownInterval;
let lastRefreshTime;
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds (changed from 60 minutes)

// Function to fetch data from our server that runs Playwright
function fetchLeaderboardData() {
    const loadingContainer = document.querySelector('.loading-container');
    const leaderboardTable = document.querySelector('.leaderboard table');
    
    // Show loading animation, hide table
    loadingContainer.style.display = 'flex';
    leaderboardTable.style.display = 'none';
    
    // Set up a 2-minute timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes
    
    // Call our backend server that runs the Playwright script
    return fetch('http://localhost:3000/api/leaderboard', {
        signal: controller.signal
    })
        .then(response => {
            clearTimeout(timeoutId); // Clear the timeout
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Data successfully fetched, update last refresh time
            lastRefreshTime = new Date().getTime();
            
            // Store in localStorage to persist between page reloads
            localStorage.setItem('lastRefreshTime', lastRefreshTime);
            
            // Start/restart the countdown timer
            startCountdownTimer();
            
            // Hide loading animation, show table
            loadingContainer.style.display = 'none';
            leaderboardTable.style.display = 'table';
            
            return data;
        })
        .catch(error => {
            clearTimeout(timeoutId); // Clear the timeout on error too
            throw error;
        });
}

// Function to render the leaderboard
function renderLeaderboard(data) {
    const tableBody = document.querySelector('.leaderboard tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    
    // Sort by points (highest first)
    const sortedData = [...data].sort((a, b) => b.points - a.points);
    
    // Add rows to the table
    sortedData.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.points}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to show error message with sad unicorn
function showErrorMessage() {
    const tableBody = document.querySelector('.leaderboard tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    
    // Create a single row with a sad unicorn message
    const errorRow = document.createElement('tr');
    errorRow.innerHTML = `
        <td colspan="2" class="error-message">
            <div class="sad-unicorn">🦄😢</div>
            <p>Oh no! Couldn't fetch the leaderboard data.</p>
            <p>Please try again in a few minutes.</p>
        </td>
    `;
    tableBody.appendChild(errorRow);
}

// Function to start the countdown timer
function startCountdownTimer() {
    // Clear any existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Update the timer immediately once
    updateCountdown();
    
    // Then update every second
    countdownInterval = setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const lastRefresh = localStorage.getItem('lastRefreshTime') || now;
        const nextRefreshTime = parseInt(lastRefresh) + REFRESH_INTERVAL;
        
        // Time remaining in milliseconds
        const timeRemaining = nextRefreshTime - now;
        
        if (timeRemaining <= 0) {
            // Time's up! Refresh the data
            clearInterval(countdownInterval);
            fetchLeaderboardData()
                .then(renderLeaderboard)
                .catch(error => {
                    console.error('Error refreshing data:', error);
                    showErrorMessage();
                });
            return;
        }
        
        // Calculate minutes and seconds
        const minutes = Math.floor(timeRemaining / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Update the display
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Add visual effects when time is running low
        if (minutes === 0 && seconds <= 30) {
            document.querySelector('.countdown').classList.add('urgent');
        } else {
            document.querySelector('.countdown').classList.remove('urgent');
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have a saved refresh time
    lastRefreshTime = localStorage.getItem('lastRefreshTime');
    
    if (lastRefreshTime) {
        const now = new Date().getTime();
        const nextRefreshTime = parseInt(lastRefreshTime) + REFRESH_INTERVAL;
        
        // If it's been more than an hour since the last refresh, fetch new data
        if (now >= nextRefreshTime) {
            fetchLeaderboardData()
                .then(renderLeaderboard)
                .catch(error => {
                    console.error('Error loading initial data:', error);
                    showErrorMessage();
                });
        } else {
            // Otherwise, start the countdown and use cached data if available
            startCountdownTimer();
            
            // Try to load cached data
            const cachedData = false; //localStorage.getItem('leaderboardData');
            if (cachedData) {
                renderLeaderboard(JSON.parse(cachedData));
            } else {
                // If no cached data, fetch new data anyway
                fetchLeaderboardData()
                    .then(data => {
                        renderLeaderboard(data);
                        localStorage.setItem('leaderboardData', JSON.stringify(data));
                    })
                    .catch(error => {
                        console.error('Error loading initial data:', error);
                        showErrorMessage();
                    });
            }
        }
    } else {
        // First visit, fetch data
        fetchLeaderboardData()
            .then(data => {
                renderLeaderboard(data);
                localStorage.setItem('leaderboardData', JSON.stringify(data));
            })
            .catch(error => {
                console.error('Error loading initial data:', error);
                showErrorMessage();
            });
    }
});