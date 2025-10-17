/**
 * Report Reading page functionality
 * Handles user selection and point reporting
 */

// Mock user data (will be replaced with backend data later)
const mockUsers = [
    {
        username: "BookLover42",
        avatar: "https://picsum.photos/50/50?random=1",
        points: 85
    },
    {
        username: "ReadingRainbow",
        avatar: "https://picsum.photos/50/50?random=2",
        points: 72
    },
    {
        username: "ChapterChaser",
        avatar: "https://picsum.photos/50/50?random=3",
        points: 93
    },
    {
        username: "StorySeeker",
        avatar: "https://picsum.photos/50/50?random=4",
        points: 67
    },
    {
        username: "PageTurner",
        avatar: "https://picsum.photos/50/50?random=5",
        points: 58
    }
];

/**
 * Renders the user list on the page
 */
function renderUserList() {
    const userListContainer = document.querySelector('.user-list');
    if (!userListContainer) {
        console.error('User list container not found');
        return;
    }

    // Clear existing content
    userListContainer.innerHTML = '';

    // Create user items
    mockUsers.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        userItem.innerHTML = `
            <img src="${user.avatar}" alt="${user.username}" class="user-avatar">
            <span class="user-name">${user.username}</span>
            <span class="user-points">${user.points} points</span>
        `;
        
        userListContainer.appendChild(userItem);
    });
}

/**
 * Initialize the report reading page
 */
function initializeReportReading() {
    renderUserList();
}

// Initialize when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeReportReading);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockUsers,
        renderUserList,
        initializeReportReading
    };
}