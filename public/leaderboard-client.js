// Global variables for the timer
let countdownInterval;
let lastRefreshTime;
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

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
    
    // Determine if we're running locally or in production
    // Include check for file:// protocol which is used when opening HTML directly
    const isLocalhost = 
        window.location.protocol === 'file:' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('192.168.');
    
    // Use local URL in development, production URL in cloud
    const apiUrl = isLocalhost 
        ? `${client_config.localApiUrl}/leaderboard`
        : `${client_config.apiBaseUrl}/leaderboard`;
    
    console.log(`Fetching data from: ${apiUrl}`);
    
    // Call our API endpoint
    return fetch(apiUrl, {
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
            console.error('Error fetching data:', error);
            
            // Show error message in the UI
            showErrorMessage();
            
            throw error;
        });
}

// Function to render the leaderboard with the data
function renderLeaderboard(data) {
    const tbody = document.querySelector('.leaderboard tbody');
    tbody.innerHTML = ''; // Clear existing content
    
    // Sort data by points (highest first)
    const sortedData = [...data].sort((a, b) => b.points - a.points);
    // Create a rainbow gradient with enough colors for all entries
    const hueIncrement = 360 / (sortedData.length || 1);

    // Render each entry
    sortedData.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Set rainbow background based on position, but with less intensity
        // Changed from gradient to solid color with lower opacity
        const hue = index * hueIncrement;
        row.style.background = `hsla(${hue}, 100%, 90%, 0.3)`;
        
        // Add medal/trophy for top 3
        let medal = '';
        if (index === 0) {
            medal = '🏆 '; // Gold trophy for 1st place
        } else if (index === 1) {
            medal = '🥈 '; // Silver medal for 2nd place
        } else if (index === 2) {
            medal = '🥉 '; // Bronze medal for 3rd place
        }
        
        // Create the cells
        const nameCell = document.createElement('td');
        nameCell.className = 'member-name';
        nameCell.innerHTML = `${medal}${entry.name}`;
        
        const pointsCell = document.createElement('td');
        pointsCell.className = 'member-points';
        pointsCell.textContent = entry.points;
        
        // Add cells to the row
        row.appendChild(nameCell);
        row.appendChild(pointsCell);
        
        // Add the row to the table
        tbody.appendChild(row);
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
    console.log('DOM loaded, initializing...');
    
    // Set the current month from config
    try {
        const currentMonthElement = document.getElementById('current-month');
        if (currentMonthElement && window.client_config) {
            currentMonthElement.textContent = `${client_config.currentMonth} ${client_config.currentYear}`;
        } else if (currentMonthElement) {
            // Fallback if config is not available
            currentMonthElement.textContent = 'September 2025';
        }
    } catch (error) {
        console.error('Error setting month:', error);
    }
    
    // Todo - get this from the backend instead of local storage
    lastRefreshTime = localStorage.getItem('lastRefreshTime');
    
    if (lastRefreshTime) {
        const now = new Date().getTime();
        const nextRefreshTime = parseInt(lastRefreshTime) + REFRESH_INTERVAL;
        
        // If it's been more than the refresh interval since the last refresh, fetch new data
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