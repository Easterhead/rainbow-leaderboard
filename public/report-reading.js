/**
 * Report Reading page functionality]
 */

/**
 * Adds a chapter to the selected chapters list
 */
function addSelectedChapter(chapterTitle, bookTitle, authorUsername, updateDisplayFn = updateSelectedChaptersDisplay, selectedChaptersArray) {
    // Check if chapter is already selected to avoid duplicates
    const exists = selectedChaptersArray.some(chapter => 
        chapter.chapterTitle === chapterTitle && 
        chapter.bookTitle === bookTitle && 
        chapter.authorUsername === authorUsername
    );
    
    if (!exists) {
        selectedChaptersArray.push({
            chapterTitle,
            bookTitle,
            authorUsername
        });
        updateDisplayFn();
    }
}

/**
 * Updates the display of selected chapters
 */
function updateSelectedChaptersDisplay(selectedChaptersArray) {
    const selectedChaptersList = document.querySelector('.selected-chapters-list');
    if (!selectedChaptersList) {
        console.error('Selected chapters list not found');
        return;
    }

    // Clear existing items
    selectedChaptersList.innerHTML = '';

    // Add each selected chapter
    selectedChaptersArray.forEach((chapter, index) => {
        const chapterItem = document.createElement('div');
        chapterItem.className = 'selected-chapter-item';
        
        chapterItem.innerHTML = `
            <span class="chapter-info">${chapter.authorUsername} - ${chapter.bookTitle} - ${chapter.chapterTitle}</span>
            <button class="remove-chapter" data-index="${index}">×</button>
        `;
        
        // Add remove functionality
        const removeBtn = chapterItem.querySelector('.remove-chapter');
        removeBtn.addEventListener('click', () => {
            removeSelectedChapter(index, () => updateSelectedChaptersDisplay(selectedChaptersArray), selectedChaptersArray);
        });
        
        selectedChaptersList.appendChild(chapterItem);
    });
}

/**
 * Removes a chapter from the selected chapters list
 */
function removeSelectedChapter(index, updateDisplayFn = updateSelectedChaptersDisplay, selectedChaptersArray) {
    selectedChaptersArray.splice(index, 1);
    updateDisplayFn();
}

/**
 * Renders the user list on the page
 */

// Points groups and their values
const pointsGroups = {
    "botm": 6,
    "event": 5, 
    "mods": 4,
    "rainbow": 3,
    "raindrop": 2,
    "newbie": 1,
    "hiatus": 0
};

// Mock author data (will be replaced with backend data later)
const mockAuthors = [
    {
        username: "CemeteryFaerie",
        pointsGroup: "rainbow"
    },
    {
        username: "erifnidne",
        pointsGroup: "mods"
    },
    {
        username: "BookMagic42",
        pointsGroup: "botm"
    },
    {
        username: "StoryWeaver",
        pointsGroup: "event"
    },
    {
        username: "NewWriter23",
        pointsGroup: "newbie"
    },
    {
        username: "TakingBreak",
        pointsGroup: "hiatus"
    }
];

// Mock book data (will be replaced with backend data later)
const mockBooks = {
    "CemeteryFaerie": [
        { title: "Mirror, Mirror" },
        { title: "Once in A Blue Moon" }
    ],
    "erifnidne": [
        { title: "A Failure of A High Elf" },
        { title: "The Magic Academy" }
    ],
    "BookMagic42": [
        { title: "The Chosen One's Journey" },
        { title: "Dragon's Quest" }
    ],
    "StoryWeaver": [
        { title: "Mystical Realm" },
        { title: "The Lost Kingdom" }
    ],
    "NewWriter23": [
        { title: "First Adventure" },
        { title: "Learning Magic" }
    ],
    "TakingBreak": [
        { title: "Unfinished Story" }
    ]
};

// Mock chapters data (will be replaced with backend data later)
const mockChapters = {
    "Mirror, Mirror": [
        "Chapter 1: The Reflection",
        "Chapter 2: Shattered Glass",
        "Chapter 3: Through the Looking Glass",
        "Chapter 4: What Lies Beyond"
    ],
    "Once in A Blue Moon": [
        "Prologue",
        "Chapter 1: The Lunar Eclipse",
        "Chapter 2: Blue Shadows",
        "Chapter 3: Moonlit Secrets"
    ],
    "A Failure of A High Elf": [
        "Chapter 1: The Outcast",
        "Chapter 2: Magic Gone Wrong",
        "Chapter 3: Finding Purpose"
    ],
    "The Magic Academy": [
        "Chapter 1: First Day",
        "Chapter 2: Spell Lessons",
        "Chapter 3: The Test",
        "Chapter 4: Graduation"
    ],
    "The Chosen One's Journey": [
        "Chapter 1: The Calling",
        "Chapter 2: First Steps",
        "Chapter 3: Challenges Ahead",
        "Chapter 4: The Final Battle"
    ],
    "Dragon's Quest": [
        "Chapter 1: The Dragon's Call",
        "Chapter 2: Ancient Wisdom",
        "Chapter 3: The Quest Begins"
    ],
    "Mystical Realm": [
        "Chapter 1: Portal Opening",
        "Chapter 2: New World",
        "Chapter 3: Strange Creatures"
    ],
    "The Lost Kingdom": [
        "Chapter 1: The Map",
        "Chapter 2: Journey Begins",
        "Chapter 3: Kingdom Found"
    ],
    "First Adventure": [
        "Chapter 1: Starting Out",
        "Chapter 2: Learning the Ropes"
    ],
    "Learning Magic": [
        "Chapter 1: First Spell",
        "Chapter 2: Practice Makes Perfect"
    ],
    "Unfinished Story": [
        "Chapter 1: The Beginning"
    ]
};

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
    mockUsers.forEach((user, index) => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.style.cursor = 'pointer';
        userItem.dataset.userIndex = index;
        
        userItem.innerHTML = `
            <img src="${user.avatar}" alt="${user.username}" class="user-avatar">
            <span class="user-name">${user.username}</span>
            <span class="user-points">${user.points} points</span>
        `;
        
        // Add click event listener
        userItem.addEventListener('click', () => selectUser(index));
        
        userListContainer.appendChild(userItem);
    });
}

/**
 * Handles chapter selection event
 */
function handleChapterSelection(chapterTitle, bookTitle, authorUsername) {
    // Get the selected user container to access the selectedChapters array
    const selectedUserContainer = document.querySelector('.selected-user-container');
    if (!selectedUserContainer || !selectedUserContainer.selectedChapters) {
        console.error('Selected chapters array not found');
        return;
    }
    
    const selectedChapters = selectedUserContainer.selectedChapters;
    
    // Add chapter to selected chapters list
    addSelectedChapter(chapterTitle, bookTitle, authorUsername, () => updateSelectedChaptersDisplay(selectedChapters), selectedChapters);
    
    // Get the selected user
    const selectedUserInfo = document.querySelector('.selected-user-info');
    if (!selectedUserInfo) {
        console.error('Selected user info not found');
        return;
    }

    // Extract user information from the selected user display
    const userName = selectedUserInfo.querySelector('.user-name').textContent;
    const userPointsText = selectedUserInfo.querySelector('.user-points').textContent;
    const userPoints = parseInt(userPointsText.split(' ')[0]); // Extract number from "X points"

    // Find the user in mockUsers
    const user = mockUsers.find(u => u.username === userName);
    if (!user) {
        console.error('User not found:', userName);
        return;
    }

    // Find the author's points group
    const author = mockAuthors.find(a => a.username === authorUsername);
    if (!author) {
        console.error('Author not found:', authorUsername);
        return;
    }

    // Create selected chapter object for report comment
    const selectedChapter = {
        chapterTitle,
        bookTitle,
        authorUsername,
        authorPointsGroup: author.pointsGroup
    };

    // Update the report comment
    const reportComment = document.querySelector('.report-comment');
    if (reportComment) {
        reportComment.textContent = buildReportComment(user, selectedChapter);
    }
}

/**
 * Populates the chapter list for a selected book
 */
function populateChapterList(bookTitle, authorUsername) {
    const chapterList = document.querySelector('.chapter-list');
    const chapterItems = document.querySelector('.chapter-items');
    
    if (!chapterList || !chapterItems) {
        console.error('Chapter list containers not found');
        return;
    }

    // Get chapters for this book
    const chapters = mockChapters[bookTitle];
    if (!chapters) {
        console.error('No chapters found for book:', bookTitle);
        return;
    }

    // Clear existing chapter items
    chapterItems.innerHTML = '';
    
    // Show chapter list
    chapterList.style.display = 'block';
    
    // Create chapter items
    chapters.forEach((chapterTitle) => {
        const chapterItem = document.createElement('div');
        chapterItem.className = 'chapter-item';
        chapterItem.style.cursor = 'pointer';
        
        chapterItem.innerHTML = `
            <div class="chapter-title">${chapterTitle}</div>
        `;
        
        // Add click event listener
        chapterItem.addEventListener('click', () => {
            handleChapterSelection(chapterTitle, bookTitle, authorUsername);
        });
        
        chapterItems.appendChild(chapterItem);
    });
}

/**
 * Handles book selection event
 */
function handleBookSelection(event) {
    const bookItem = event.currentTarget;
    const bookTitle = bookItem.querySelector('.book-title').textContent;
    
    // Get the currently selected author from the dropdown
    const authorDropdown = document.querySelector('#author-dropdown');
    const selectedAuthor = authorDropdown ? authorDropdown.value : null;
    
    if (!selectedAuthor) {
        console.error('No author selected');
        return;
    }
    
    populateChapterList(bookTitle, selectedAuthor);
}

/**
 * Populates the book list for a selected author
 */
function populateBookList(authorUsername) {
    const bookList = document.querySelector('.book-list');
    const bookItems = document.querySelector('.book-items');
    
    if (!bookList || !bookItems) {
        console.error('Book list containers not found');
        return;
    }

    // Clear existing book items
    bookItems.innerHTML = '';
    
    // Get books for the selected author
    const books = mockBooks[authorUsername] || [];
    
    if (books.length === 0) {
        bookList.style.display = 'none';
        return;
    }

    // Show book list and populate with books
    bookList.style.display = 'block';
    
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        bookItem.style.cursor = 'pointer';
        
        bookItem.innerHTML = `
            <div class="book-title">${book.title}</div>
        `;
        
        // Add click event listener
        bookItem.addEventListener('click', handleBookSelection);
        
        bookItems.appendChild(bookItem);
    });
}

/**
 * Handles author dropdown change event
 */
function handleAuthorSelection(event) {
    const selectedAuthor = event.target.value;
    
    // Hide chapter list when switching authors
    const chapterList = document.querySelector('.chapter-list');
    if (chapterList) {
        chapterList.style.display = 'none';
    }
    
    if (selectedAuthor) {
        populateBookList(selectedAuthor);
    } else {
        // Hide book list if no author selected
        const bookList = document.querySelector('.book-list');
        if (bookList) {
            bookList.style.display = 'none';
        }
    }
}

/**
 * Populates the author dropdown with available authors
 */
function populateAuthorDropdown() {
    const authorDropdown = document.querySelector('#author-dropdown');
    if (!authorDropdown) {
        console.error('Author dropdown not found');
        return;
    }

    // Clear existing options except the first placeholder
    const firstOption = authorDropdown.querySelector('option[value=""]');
    authorDropdown.innerHTML = '';
    if (firstOption) {
        authorDropdown.appendChild(firstOption);
    }

    // Add author options
    mockAuthors.forEach(author => {
        const option = document.createElement('option');
        option.value = author.username;
        const pointsValue = pointsGroups[author.pointsGroup];
        option.textContent = `${author.username} (${author.pointsGroup} - ${pointsValue} points)`;
        authorDropdown.appendChild(option);
    });

    // Add event listener for author selection
    authorDropdown.addEventListener('change', handleAuthorSelection);
}

/**
 * Builds the report comment string for a user
 */
function buildReportComment(user, selectedChapter = null) {
    if (!selectedChapter) {
        // For now, just show the user's current points in the format:
        // "Total: [points] = [points] points"
        return `Total: ${user.points} = ${user.points} points`;
    }
    
    // Calculate new total with chapter points
    const chapterPoints = pointsGroups[selectedChapter.authorPointsGroup];
    const newTotal = user.points + chapterPoints;
    
    // Build the formatted comment
    const comment = `Total: ${user.points} + 1x${chapterPoints} = ${newTotal}

${selectedChapter.bookTitle} by @${selectedChapter.authorUsername}
${selectedChapter.authorPointsGroup} ${chapterPoints} points
1 (${selectedChapter.chapterTitle})`;
    
    return comment;
}

/**
 * Selects a user and shows the selected user view
 */
function selectUser(userIndex) {
    const user = mockUsers[userIndex];
    if (!user) {
        console.error('User not found:', userIndex);
        return;
    }

    // Create selected chapters array for this user session
    const selectedChapters = [];

    // Hide user list
    const userListContainer = document.querySelector('.user-list');
    const selectedUserContainer = document.querySelector('.selected-user-container');
    
    if (userListContainer) {
        userListContainer.style.display = 'none';
    }
    
    if (selectedUserContainer) {
        selectedUserContainer.style.display = 'block';
        
        // Store the selectedChapters array in the container for access by other functions
        selectedUserContainer.selectedChapters = selectedChapters;
        
        // Populate selected user info
        const selectedUserInfo = selectedUserContainer.querySelector('.selected-user-info');
        if (selectedUserInfo) {
            selectedUserInfo.innerHTML = `
                <img src="${user.avatar}" alt="${user.username}" class="user-avatar">
                <span class="user-name">${user.username}</span>
                <span class="user-points">${user.points} points</span>
            `;
        }

        // Populate report comment
        const reportComment = selectedUserContainer.querySelector('.report-comment');
        if (reportComment) {
            reportComment.textContent = buildReportComment(user);
        }

        // Populate author dropdown
        populateAuthorDropdown();
    }
}

/**
 * Goes back to the user list view
 */
function goBackToUserList() {
    const userListContainer = document.querySelector('.user-list');
    const selectedUserContainer = document.querySelector('.selected-user-container');
    
    if (userListContainer) {
        userListContainer.style.display = 'block';
    }
    
    if (selectedUserContainer) {
        selectedUserContainer.style.display = 'none';
    }
}

/**
 * Initialize the report reading page
 */
function initializeReportReading() {
    renderUserList();
    
    // Add back button event listener
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', goBackToUserList);
    }
}

// Initialize when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeReportReading);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        pointsGroups,
        mockAuthors,
        mockBooks,
        mockChapters,
        mockUsers,
        addSelectedChapter,
        updateSelectedChaptersDisplay,
        removeSelectedChapter,
        renderUserList,
        selectUser,
        goBackToUserList,
        buildReportComment,
        populateAuthorDropdown,
        populateBookList,
        populateChapterList,
        handleAuthorSelection,
        handleBookSelection,
        handleChapterSelection,
        initializeReportReading
    };
}