/**
 * Tests for report-reading.js functions
 */

// Import the function to test from the source file
const { buildReportComment, pointsGroups, mockAuthors, mockBooks, mockChapters } = require('../public/report-reading.js');

// Test the buildReportComment function
describe('buildReportComment', () => {
  test('should build correct report comment for user with points', () => {
    const user = {
      username: "TestUser",
      avatar: "test-avatar.jpg",
      points: 85
    };
    
    const result = buildReportComment(user);
    
    expect(result).toBe('Total: 85 = 85 points');
  });
  
  test('should handle zero points', () => {
    const user = {
      username: "TestUser",
      avatar: "test-avatar.jpg", 
      points: 0
    };
    
    const result = buildReportComment(user);
    
    expect(result).toBe('Total: 0 = 0 points');
  });

  test('should build correct report comment with selected chapter', () => {
    const user = {
      username: "TestUser",
      avatar: "test-avatar.jpg",
      points: 85
    };
    
    const selectedChapter = {
      chapterTitle: "Chapter 1: The Reflection",
      bookTitle: "Mirror, Mirror",
      authorUsername: "CemeteryFaerie",
      authorPointsGroup: "rainbow"
    };
    
    const result = buildReportComment(user, selectedChapter);
    
    const expected = `Total: 85 + 1x3 = 88

Mirror, Mirror by @CemeteryFaerie
rainbow 3 points
1 (Chapter 1: The Reflection)
1 x 3 = 3 points`;
    
    expect(result).toBe(expected);
  });

  test('should build correct report comment with multiple chapters from same book', () => {
    const user = {
      username: "TestUser",
      avatar: "test-avatar.jpg",
      points: 85
    };
    
    const selectedChapters = [
      {
        chapterTitle: "Chapter 1: The Reflection",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "rainbow"
      },
      {
        chapterTitle: "Chapter 2: The Fall",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "rainbow"
      }
    ];
    
    const result = buildReportComment(user, selectedChapters);
    
    const expected = `Total: 85 + 2x3 = 91

Mirror, Mirror by @CemeteryFaerie
rainbow 3 points
2 (Chapter 1: The Reflection, Chapter 2: The Fall)
2 x 3 = 6 points`;
    
    expect(result).toBe(expected);
  });

  test('should use range format for more than 2 chapters from same book', () => {
    const user = {
      username: "TestUser",
      avatar: "test-avatar.jpg",
      points: 85
    };
    
    const selectedChapters = [
      {
        chapterTitle: "Chapter 1: The Reflection",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "rainbow"
      },
      {
        chapterTitle: "Chapter 2: Shattered Glass",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "rainbow"
      },
      {
        chapterTitle: "Chapter 3: Through the Looking Glass",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "rainbow"
      }
    ];
    
    const result = buildReportComment(user, selectedChapters);
    
    const expected = `Total: 85 + 3x3 = 94

Mirror, Mirror by @CemeteryFaerie
rainbow 3 points
3 (Chapter 1: The Reflection - Chapter 3: Through the Looking Glass)
3 x 3 = 9 points`;
    
    expect(result).toBe(expected);
  });

  test('should handle multiple books from different authors', () => {
    const user = {
      username: "TestUser",
      avatar: "test-avatar.jpg",
      points: 85
    };
    
    const selectedChapters = [
      {
        chapterTitle: "Chapter 1: The Reflection",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "rainbow"
      },
      {
        chapterTitle: "Chapter 2: Shattered Glass",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "rainbow"
      },
      {
        chapterTitle: "Chapter 1: First Day",
        bookTitle: "The Magic Academy",
        authorUsername: "erifnidne",
        authorPointsGroup: "mods"
      }
    ];
    
    const result = buildReportComment(user, selectedChapters);
    
    const expected = `Total: 85 + 2x3 + 1x4 = 95

Mirror, Mirror by @CemeteryFaerie
rainbow 3 points
2 (Chapter 1: The Reflection, Chapter 2: Shattered Glass)
2 x 3 = 6 points

The Magic Academy by @erifnidne
mods 4 points
1 (Chapter 1: First Day)
1 x 4 = 4 points`;
    
    expect(result).toBe(expected);
  });

  test('should handle multiple books from the same author', () => {
    const user = {
      username: "TestUser",
      avatar: "test-avatar.jpg",
      points: 85
    };
    
    const selectedChapters = [
      {
        chapterTitle: "Chapter 1: The Reflection",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "rainbow"
      },
      {
        chapterTitle: "Chapter 2: Shattered Glass",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "rainbow"
      },
      {
        chapterTitle: "Prologue",
        bookTitle: "Once in A Blue Moon",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "rainbow"
      }
    ];
    
    const result = buildReportComment(user, selectedChapters);
    
    const expected = `Total: 85 + 2x3 + 1x3 = 94

Mirror, Mirror by @CemeteryFaerie
rainbow 3 points
2 (Chapter 1: The Reflection, Chapter 2: Shattered Glass)
2 x 3 = 6 points

Once in A Blue Moon by @CemeteryFaerie
rainbow 3 points
1 (Prologue)
1 x 3 = 3 points`;
    
    expect(result).toBe(expected);
  });

  test('should handle birthday reading with 6 points', () => {
    const user = {
      username: "TestUser",
      avatar: "test-avatar.jpg",
      points: 85
    };
    
    const selectedChapters = [
      {
        chapterTitle: "Chapter 1: The Reflection",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "birthday"
      },
      {
        chapterTitle: "Chapter 2: Shattered Glass",
        bookTitle: "Mirror, Mirror",
        authorUsername: "CemeteryFaerie",
        authorPointsGroup: "birthday"
      }
    ];
    
    const result = buildReportComment(user, selectedChapters);
    
    const expected = `Total: 85 + 2x6 = 97

Mirror, Mirror by @CemeteryFaerie
birthday 6 points
2 (Chapter 1: The Reflection, Chapter 2: Shattered Glass)
2 x 6 = 12 points`;
    
    expect(result).toBe(expected);
  });
});

// Test the addSelectedChapter function
describe('addSelectedChapter', () => {
  const { addSelectedChapter } = require('../public/report-reading.js');
  
  // Mock function to replace updateSelectedChaptersDisplay
  const mockUpdateDisplay = jest.fn();
  
  beforeEach(() => {
    mockUpdateDisplay.mockClear();
  });

  test('should add a chapter to the selected chapters list', () => {
    const selectedChapters = [];
    addSelectedChapter('Chapter 1: The Beginning', 'Test Book', 'TestAuthor', mockUpdateDisplay, selectedChapters);
    
    expect(selectedChapters).toHaveLength(1);
    expect(selectedChapters[0]).toEqual({
      chapterTitle: 'Chapter 1: The Beginning',
      bookTitle: 'Test Book',
      authorUsername: 'TestAuthor'
    });
    expect(mockUpdateDisplay).toHaveBeenCalledTimes(1);
  });

  test('should prevent duplicate chapters from being added', () => {
    const selectedChapters = [];
    // Add the same chapter twice
    addSelectedChapter('Chapter 1: The Beginning', 'Test Book', 'TestAuthor', mockUpdateDisplay, selectedChapters);
    addSelectedChapter('Chapter 1: The Beginning', 'Test Book', 'TestAuthor', mockUpdateDisplay, selectedChapters);
    
    // Should only have one chapter
    expect(selectedChapters).toHaveLength(1);
    // updateSelectedChaptersDisplay should only be called once (not for the duplicate)
    expect(mockUpdateDisplay).toHaveBeenCalledTimes(1);
  });

  test('should allow same chapter title from different books', () => {
    const selectedChapters = [];
    addSelectedChapter('Chapter 1', 'Book A', 'Author1', mockUpdateDisplay, selectedChapters);
    addSelectedChapter('Chapter 1', 'Book B', 'Author1', mockUpdateDisplay, selectedChapters);
    
    expect(selectedChapters).toHaveLength(2);
    expect(mockUpdateDisplay).toHaveBeenCalledTimes(2);
  });

  test('should accept selectedChapters array as parameter instead of using global', () => {
    const customSelectedChapters = [];
    
    // This test will fail until we refactor the function to accept selectedChapters as parameter
    addSelectedChapter('Chapter 1: Test', 'Test Book', 'TestAuthor', mockUpdateDisplay, customSelectedChapters);
    
    expect(customSelectedChapters).toHaveLength(1);
    expect(customSelectedChapters[0]).toEqual({
      chapterTitle: 'Chapter 1: Test',
      bookTitle: 'Test Book',
      authorUsername: 'TestAuthor'
    });
  });
});

// Test the removeSelectedChapter function
describe('removeSelectedChapter', () => {
  const { addSelectedChapter, removeSelectedChapter } = require('../public/report-reading.js');
  
  // Mock function to replace updateSelectedChaptersDisplay
  const mockUpdateDisplay = jest.fn();
  
  beforeEach(() => {
    mockUpdateDisplay.mockClear();
  });

  test('should remove a chapter at the specified index', () => {
    const selectedChapters = [];
    // Add some chapters first
    addSelectedChapter('Chapter 1', 'Book A', 'Author1', mockUpdateDisplay, selectedChapters);
    addSelectedChapter('Chapter 2', 'Book A', 'Author1', mockUpdateDisplay, selectedChapters);
    addSelectedChapter('Chapter 3', 'Book A', 'Author1', mockUpdateDisplay, selectedChapters);
    
    expect(selectedChapters).toHaveLength(3);
    
    // Remove the middle chapter (index 1)
    removeSelectedChapter(1, mockUpdateDisplay, selectedChapters);
    
    expect(selectedChapters).toHaveLength(2);
    expect(selectedChapters[0].chapterTitle).toBe('Chapter 1');
    expect(selectedChapters[1].chapterTitle).toBe('Chapter 3');
    expect(mockUpdateDisplay).toHaveBeenCalledTimes(4); // 3 adds + 1 remove
  });

  test('should remove the first chapter correctly', () => {
    const selectedChapters = [];
    addSelectedChapter('Chapter 1', 'Book A', 'Author1', mockUpdateDisplay, selectedChapters);
    addSelectedChapter('Chapter 2', 'Book A', 'Author1', mockUpdateDisplay, selectedChapters);
    
    removeSelectedChapter(0, mockUpdateDisplay, selectedChapters);
    
    expect(selectedChapters).toHaveLength(1);
    expect(selectedChapters[0].chapterTitle).toBe('Chapter 2');
    expect(mockUpdateDisplay).toHaveBeenCalledTimes(3); // 2 adds + 1 remove
  });

  test('should remove the last chapter correctly', () => {
    const selectedChapters = [];
    addSelectedChapter('Chapter 1', 'Book A', 'Author1', mockUpdateDisplay, selectedChapters);
    addSelectedChapter('Chapter 2', 'Book A', 'Author1', mockUpdateDisplay, selectedChapters);
    
    removeSelectedChapter(1, mockUpdateDisplay, selectedChapters);
    
    expect(selectedChapters).toHaveLength(1);
    expect(selectedChapters[0].chapterTitle).toBe('Chapter 1');
    expect(mockUpdateDisplay).toHaveBeenCalledTimes(3); // 2 adds + 1 remove
  });

  test('should accept selectedChapters array as parameter instead of using global', () => {
    const customSelectedChapters = [
      { chapterTitle: 'Chapter 1', bookTitle: 'Test Book', authorUsername: 'TestAuthor' },
      { chapterTitle: 'Chapter 2', bookTitle: 'Test Book', authorUsername: 'TestAuthor' }
    ];
    
    // This test will fail until we refactor the function to accept selectedChapters as parameter
    removeSelectedChapter(0, mockUpdateDisplay, customSelectedChapters);
    
    expect(customSelectedChapters).toHaveLength(1);
    expect(customSelectedChapters[0].chapterTitle).toBe('Chapter 2');
  });
});

// Test the updateSelectedChaptersDisplay function
describe('updateSelectedChaptersDisplay', () => {
  const { updateSelectedChaptersDisplay } = require('../public/report-reading.js');
  
  test('should accept selectedChapters array as parameter instead of using global', () => {
    // Create a mock DOM element
    const mockElement = {
      innerHTML: '',
      appendChild: jest.fn(),
      querySelector: jest.fn()
    };
    
    // Mock document.querySelector to return our mock element
    global.document = {
      querySelector: jest.fn().mockReturnValue(mockElement),
      createElement: jest.fn().mockReturnValue({
        className: '',
        innerHTML: '',
        querySelector: jest.fn().mockReturnValue({
          addEventListener: jest.fn()
        }),
        addEventListener: jest.fn()
      })
    };
    
    const customSelectedChapters = [
      { chapterTitle: 'Chapter 1', bookTitle: 'Test Book', authorUsername: 'TestAuthor' }
    ];
    
    // This test will fail until we refactor the function to accept selectedChapters as parameter
    updateSelectedChaptersDisplay(customSelectedChapters);
    
    // Verify appendChild was called (indicating chapters were processed)
    expect(mockElement.appendChild).toHaveBeenCalled();
    
    // Clean up global mock
    delete global.document;
  });
});

// Test the points groups data
describe('pointsGroups', () => {
  test('should have all required point groups', () => {
    expect(pointsGroups).toHaveProperty('botm', 6);
    expect(pointsGroups).toHaveProperty('birthday', 6);
    expect(pointsGroups).toHaveProperty('event', 5);
    expect(pointsGroups).toHaveProperty('mods', 4);
    expect(pointsGroups).toHaveProperty('rainbow', 3);
    expect(pointsGroups).toHaveProperty('raindrop', 2);
    expect(pointsGroups).toHaveProperty('newbie', 1);
    expect(pointsGroups).toHaveProperty('hiatus', 0);
  });
});

// Test the mock authors data
describe('mockAuthors', () => {
  test('should have authors with valid point groups', () => {
    expect(mockAuthors.length).toBeGreaterThan(0);
    
    mockAuthors.forEach(author => {
      expect(author).toHaveProperty('username');
      expect(author).toHaveProperty('pointsGroup');
      expect(pointsGroups).toHaveProperty(author.pointsGroup);
    });
  });
});

// Test the mock books data
describe('mockBooks', () => {
  test('should have books for each author', () => {
    mockAuthors.forEach(author => {
      expect(mockBooks).toHaveProperty(author.username);
      expect(Array.isArray(mockBooks[author.username])).toBe(true);
    });
  });
  
  test('should have books with title only (no chapter count)', () => {
    Object.values(mockBooks).forEach(authorBooks => {
      authorBooks.forEach(book => {
        expect(book).toHaveProperty('title');
        expect(book).not.toHaveProperty('chapters');
        expect(typeof book.title).toBe('string');
      });
    });
  });
});

// Test the mock chapters data
describe('mockChapters', () => {
  test('should have chapters for each book', () => {
    Object.values(mockBooks).forEach(authorBooks => {
      authorBooks.forEach(book => {
        expect(mockChapters).toHaveProperty(book.title);
        expect(Array.isArray(mockChapters[book.title])).toBe(true);
      });
    });
  });
  
  test('should have chapters as strings', () => {
    Object.values(mockChapters).forEach(bookChapters => {
      bookChapters.forEach(chapter => {
        expect(typeof chapter).toBe('string');
        expect(chapter.length).toBeGreaterThan(0);
      });
    });
  });
});