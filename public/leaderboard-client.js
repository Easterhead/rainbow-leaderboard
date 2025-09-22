// Storage utility functions to make testing easier
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to storage:', error);
        return false;
    }
}

function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        
        // Try to parse as JSON if it looks like JSON
        if (item.startsWith('{') || item.startsWith('[')) {
            try {
                return JSON.parse(item);
            } catch (e) {
                // If parsing fails, return as string
                return item;
            }
        }
        return item;
    } catch (error) {
        console.error('Error reading from storage:', error);
        return defaultValue;
    }
}

// Function to show loading UI
function showLoadingUI() {
    const loadingContainer = document.querySelector('.loading-container');
    const leaderboardTable = document.querySelector('.leaderboard table');
    
    // Show loading animation, hide table
    loadingContainer.style.display = 'flex';
    leaderboardTable.style.display = 'none';
}

// Function to hide loading UI
function hideLoadingUI() {
    const loadingContainer = document.querySelector('.loading-container');
    const leaderboardTable = document.querySelector('.leaderboard table');
    
    // Hide loading animation, show table
    loadingContainer.style.display = 'none';
    leaderboardTable.style.display = 'table';
}

// API utility function to make testing easier
function fetchApi(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes
    
    const fetchOptions = {
        ...options,
        signal: controller.signal
    };
    
    return fetch(url, fetchOptions)
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            clearTimeout(timeoutId);
            console.error('Error fetching from API:', error);
            throw error;
        });
}

// Function to determine API URL based on environment
function getApiUrl() {
    const isLocalhost = 
        window.location.protocol === 'file:' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('192.168.');
    
    return isLocalhost 
        ? `${client_config.localApiUrl}/leaderboard`
        : `${client_config.apiBaseUrl}/leaderboard`;
}

// Function to fetch data from our api
function fetchLeaderboardData() {
    const apiUrl = getApiUrl();
    console.log(`Fetching data from: ${apiUrl}`);
    
    // Call our API endpoint
    return fetchApi(apiUrl)
        .then(data => data)
        .catch(error => {
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
    
    // Check for Rainbow achievement (60+ points)
    const rainbowUsers = sortedData.filter(user => user.points >= 60);
    
    // Remove any existing rainbow elements
    const existingIndicator = document.querySelector('.rainbow-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    const existingWrapper = document.querySelector('.leaderboard-content-wrapper');
    if (existingWrapper) {
        const table = existingWrapper.querySelector('table');
        const leaderboard = document.querySelector('.leaderboard');
        leaderboard.insertBefore(table, existingWrapper);
        existingWrapper.remove();
    }
    const existingFrame = document.querySelector('.rainbow-frame');
    if (existingFrame) {
        existingFrame.remove();
    }
    
    // Create a rainbow gradient with enough colors for all entries
    const hueIncrement = 360 / (sortedData.length || 1);

    // Render each entry
    sortedData.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Set rainbow background based on position with more vibrant colors
        // Use higher saturation and opacity for more colorful appearance
        const hue = index * hueIncrement;
        row.style.background = `hsla(${hue}, 85%, 80%, 0.5)`;
        
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
        
        // Create avatar element if avatar URL exists
        const avatarHtml = entry.avatar 
            ? `<img src="${entry.avatar}" alt="${entry.name}" class="user-avatar" onerror="this.style.display='none'">` 
            : '';
        
        nameCell.innerHTML = `${avatarHtml}${medal}${entry.name}`;
        
        const pointsCell = document.createElement('td');
        pointsCell.className = 'member-points';
        pointsCell.textContent = entry.points;
        
        // Add emoji cell for achievement status
        const emojiCell = document.createElement('td');
        emojiCell.className = 'member-emoji';
        emojiCell.style.textAlign = 'center';
        emojiCell.style.fontSize = '1.2em';
        emojiCell.textContent = entry.points >= 60 ? '🌈' : '💧';
        
        // Add cells to the row
        row.appendChild(nameCell);
        row.appendChild(pointsCell);
        row.appendChild(emojiCell);
        
        // Add the row to the table
        tbody.appendChild(row);
    });
    
    // Add Rainbow frame and celebration text if there are qualifying users
    if (rainbowUsers.length > 0) {
        setTimeout(() => {
            const table = document.querySelector('.leaderboard table');
            const tbody = table.querySelector('tbody');
            const allRows = tbody.querySelectorAll('tr');
            
            // Add celebration text after the last rainbow user
            let celebrationRow = null;
            if (rainbowUsers.length < sortedData.length) {
                celebrationRow = document.createElement('tr');
                celebrationRow.className = 'rainbow-celebration-row';
                celebrationRow.innerHTML = `
                    <td colspan="3" class="rainbow-celebration-text">
                        🌈 Congratulations! You made Rainbow with 60+ points! 🌈
                    </td>
                `;
                
                // Insert after the last rainbow user
                const lastRainbowRow = allRows[rainbowUsers.length - 1];
                lastRainbowRow.parentNode.insertBefore(celebrationRow, lastRainbowRow.nextSibling);
            }
            
            // Create frame container around just the rainbow section
            const rainbowFrame = document.createElement('div');
            rainbowFrame.className = 'rainbow-frame';
            
            // Get updated rows list (including the celebration row)
            const updatedRows = tbody.querySelectorAll('tr');
            
            // Calculate how many rows to include in frame (rainbow users + celebration)
            const frameRowCount = celebrationRow ? rainbowUsers.length + 1 : rainbowUsers.length;
            
            // Add CSS classes to identify rainbow rows
            for (let i = 0; i < rainbowUsers.length; i++) {
                if (updatedRows[i]) {
                    updatedRows[i].classList.add('rainbow-user-row');
                    if (i === 0) updatedRows[i].classList.add('rainbow-first');
                    if (i === rainbowUsers.length - 1) updatedRows[i].classList.add('rainbow-last');
                }
            }
            
            // Position the frame using CSS to cover just the rainbow rows
            rainbowFrame.style.position = 'absolute';
            rainbowFrame.style.left = '-10px';
            rainbowFrame.style.right = '-10px';
            rainbowFrame.style.top = '-8px';
            rainbowFrame.style.zIndex = '-1';
            
            // Calculate frame height based on the rows it should cover
            const firstRainbowRow = updatedRows[0];
            const lastFrameRow = updatedRows[frameRowCount - 1];
            
            if (firstRainbowRow && lastFrameRow) {
                const firstRowRect = firstRainbowRow.getBoundingClientRect();
                const lastRowRect = lastFrameRow.getBoundingClientRect();
                
                rainbowFrame.style.height = (lastRowRect.bottom - firstRowRect.top + 8) + 'px'; // Add 8px top, 0px bottom padding
            }
            
            // Add frame to tbody container instead of table container
            tbody.style.position = 'relative';
            tbody.appendChild(rainbowFrame);
        }, 0);
    }
}

// Function to update refresh time and start countdown
function updateRefreshTimeAndStartCountdown(timerState, refreshInterval) {
    // Data successfully fetched, update last refresh time
    const refreshTime = new Date().getTime();
    
    // Store in localStorage to persist between page reloads
    saveToStorage('lastRefreshTime', refreshTime.toString());
    
    // Start/restart the countdown timer
    return startCountdownTimer(timerState, refreshInterval);
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

// Function to calculate countdown time values
function calculateCountdownValues(timeRemaining) {
    // Handle negative time
    if (timeRemaining <= 0) {
        return { minutes: 0, seconds: 0, isUrgent: false };
    }
    
    // Calculate minutes and seconds
    const minutes = Math.floor(timeRemaining / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Determine if time is running low
    const isUrgent = minutes === 0 && seconds <= 30;
    
    return { minutes, seconds, isUrgent };
}

// Function to update the countdown UI with minutes and seconds
function updateCountdownUI(minutes, seconds, isUrgent = false) {
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!minutesElement || !secondsElement) {
        console.error('Countdown elements not found in the DOM');
        return;
    }
    
    // Update the display
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
    
    // Add visual effects when time is running low
    const countdownElement = document.querySelector('.countdown');
    if (countdownElement) {
        if (isUrgent) {
            countdownElement.classList.add('urgent');
        } else {
            countdownElement.classList.remove('urgent');
        }
    }
}

// Function to refresh data when countdown ends
function refreshDataWhenCountdownEnds(timerState, refreshInterval) {
    // Time's up! Refresh the data
    if (timerState.countdownInterval) {
        clearInterval(timerState.countdownInterval);
    }
    showLoadingUI(); // Show loading UI before fetching
    fetchLeaderboardData()
        .then(data => {
            renderLeaderboard(data);
            saveToStorage('leaderboardData', data); // Save fetched data to cache
            const newTimerState = updateRefreshTimeAndStartCountdown(timerState, refreshInterval); // Update refresh time after successful fetch
            hideLoadingUI(); // Hide loading UI after rendering
            return newTimerState;
        })
        .catch(error => {
            console.error('Error refreshing data:', error);
            showErrorMessage();
            hideLoadingUI(); // Hide loading UI on error
        });
}

// Function to start and manage the countdown timer
function startCountdownTimer(timerState = {}, refreshInterval) {
    // Clear any existing interval
    if (timerState.countdownInterval) {
        clearInterval(timerState.countdownInterval);
    }

    // Create a new timer state if none provided
    const newTimerState = { ...timerState };

    // Function to process the countdown (defined within scope to avoid global namespace pollution)
    const processCountdown = () => {
        const now = new Date().getTime();
        const lastRefresh = getFromStorage('lastRefreshTime', now);
        const nextRefreshTime = parseInt(lastRefresh) + refreshInterval;
        
        // Time remaining in milliseconds
        const timeRemaining = nextRefreshTime - now;
        
        if (timeRemaining <= 0) {
            refreshDataWhenCountdownEnds(newTimerState, refreshInterval);
            return;
        }
        
        // Calculate time values and update UI
        const { minutes, seconds, isUrgent } = calculateCountdownValues(timeRemaining);
        updateCountdownUI(minutes, seconds, isUrgent);
    };
    
    // Update the timer immediately once
    processCountdown();
    
    // Then update every second
    newTimerState.countdownInterval = setInterval(processCountdown, 1000);
    
    return newTimerState;
}

// Function to initialize the page
function initializePage() {
    console.log('DOM loaded, initializing...');
    
    // Configuration values - defined locally instead of globally
    const refreshInterval = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    // Set the current month from config
    try {
        const currentMonthElement = document.getElementById('current-month');
        if (currentMonthElement && window.client_config) {
            currentMonthElement.textContent = `${client_config.currentMonth} ${client_config.currentYear}`;
        } else if (currentMonthElement) {
            // Fallback if config is not available
            currentMonthElement.textContent = 'Error: Couldnt find month!';
        }
    } catch (error) {
        console.error('Error setting month:', error);
    }
    
    // Timer state object: { countdownInterval: number }
    let timerState = {};
    
    // Fetch data from cache or API
    const lastRefreshTime = getFromStorage('lastRefreshTime', null);
    
    if (lastRefreshTime) {
        const now = new Date().getTime();
        const nextRefreshTime = parseInt(lastRefreshTime) + refreshInterval;
        
        // If it's been more than the refresh interval since the last refresh, fetch new data
        if (now >= nextRefreshTime) {
            showLoadingUI(); // Show loading UI before fetching
            fetchLeaderboardData()
                .then(renderLeaderboard)
                .then(() => {
                    timerState = updateRefreshTimeAndStartCountdown(timerState, refreshInterval); // Update refresh time after successful fetch
                    hideLoadingUI(); // Hide loading UI after rendering
                })
                .catch(error => {
                    console.error('Error loading initial data:', error);
                    showErrorMessage();
                });
        } else {
            // Otherwise, start the countdown and use cached data if available
            timerState = startCountdownTimer(timerState, refreshInterval);
            
            // Try to load cached data
            const cachedData = getFromStorage('leaderboardData', null);
            if (cachedData) {
                renderLeaderboard(cachedData);
            } else {
                // If no cached data, fetch new data anyway
                showLoadingUI(); // Show loading UI before fetching
                fetchLeaderboardData()
                    .then(data => {
                        renderLeaderboard(data);
                        saveToStorage('leaderboardData', data);
                        timerState = updateRefreshTimeAndStartCountdown(timerState, refreshInterval); // Update refresh time after successful fetch
                        hideLoadingUI(); // Hide loading UI after rendering
                    })
                    .catch(error => {
                        console.error('Error loading initial data:', error);
                        showErrorMessage();
                        hideLoadingUI(); // Hide loading UI on error
                    });
            }
        }
    } else {
        // First visit, fetch data
        showLoadingUI(); // Show loading UI before fetching
        fetchLeaderboardData()
            .then(data => {
                renderLeaderboard(data);
                saveToStorage('leaderboardData', data);
                timerState = updateRefreshTimeAndStartCountdown(timerState, refreshInterval); // Update refresh time after successful fetch
                hideLoadingUI(); // Hide loading UI after rendering
            })
            .catch(error => {
                console.error('Error loading initial data:', error);
                showErrorMessage();
                hideLoadingUI(); // Hide loading UI on error
            });
    }
}

// Only attach DOM event listeners in browser environment
if (typeof document !== 'undefined') {
    // Initialize the page when DOM is loaded
    document.addEventListener('DOMContentLoaded', initializePage);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateCountdownValues,
        saveToStorage,
        getFromStorage,
        updateRefreshTimeAndStartCountdown,
        startCountdownTimer,
        initializePage
    };
}