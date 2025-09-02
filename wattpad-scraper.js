const { chromium } = require('playwright');

/**
 * Parses text content to find the highest point value
 * @param {string} text - The text content to parse
 * @returns {object} Object containing the highest points found and whether points were found
 */
function parsePointsFromText(text) {
  if (!text) return { maxPoints: 0, pointsFound: false };
  
  let maxPoints = 0;
  let pointsFound = false;
  
  // A single regex pattern with three capturing groups for different point formats
  const pointsPattern = /\b(\d+(?:\.\d+)?)\s*(?:points?|pts?)\b|\b(?:final|total)(?:\s+points?)?(?:\s+for\b[^.\n:=]*)?(?:[^.\n]*?[:=]\s*)+(\d+(?:\.\d+)?)(?=[.\n]|$)|^\s*=\s*(\d+(?:\.\d+)?)\s*$/gim;
  
  // Match all instances of the pattern
  const matches = [...text.matchAll(pointsPattern)];
  
  // Extract the values from the appropriate capture groups
  const values = matches.map(match => {
    // Group 1: Points format (42 points, 42 pts)
    if (match[1]) return parseFloat(match[1]);
    // Group 2: Final/Total format
    if (match[2]) return parseFloat(match[2]);
    // Group 3: Standalone equals format
    if (match[3]) return parseFloat(match[3]);
    return 0;
  }).filter(value => !isNaN(value) && value > 0);
  
  if (values.length > 0) {
    pointsFound = true;
    maxPoints = Math.max(...values);
  }
  
  return { maxPoints, pointsFound };
}

/**
 * Scrapes data from Wattpad
 * @returns {Promise<Array>} The leaderboard data
 */
async function scrapeWattpadData() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the specific Wattpad book page
    console.log('Navigating to Wattpad book...');
    await page.goto('https://www.wattpad.com/1564485447-rainbow-bookclub-august-2025', {
      waitUntil: 'networkidle'
    });
    
    // Look for and click "Reject All" button for cookie/privacy consent
    console.log('Looking for "Reject All" button...');
    try {
      // Wait for a short time for the consent dialog to appear
      const rejectButton = await page.waitForSelector('button:has-text("Reject All")', { timeout: 5000 });
      if (rejectButton) {
        console.log('Found "Reject All" button, clicking it...');
        await rejectButton.click();
        // Wait for the dialog to disappear
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('No "Reject All" button found or error clicking it:', e.message);
      // Continue with the script even if the button isn't found
    }
    
    console.log('Page loaded, now clicking "Show more" buttons...');
    
    // Click "Show more" button until it's disabled or disappears
    let clickCount = 0;
    const maxClicks = 20;
    
    while (clickCount < maxClicks) {
      const showMoreButton = await page.$('button:has-text("Show more"):not([disabled])');
      if (!showMoreButton) break;
      
      await showMoreButton.click();
      await page.waitForTimeout(1000);
      clickCount++;
    }
    
    console.log('Now clicking "View Reply" buttons...');
    
    // Click all "View X Reply" buttons to expand nested replies
    let replyClickCount = 0;
    const maxReplyClicks = 50;
    
    while (replyClickCount < maxReplyClicks) {
      const replyButton = await page.$('button:has-text("View") >> text=/View .* Repl/');
      if (!replyButton) break;
      
      await replyButton.click();
      await page.waitForTimeout(500);
      replyClickCount++;
    }
    
    console.log('Now clicking "Read more" buttons...');
    
    // Click all "Read more" buttons to expand truncated comments
    let readMoreClickCount = 0;
    const maxReadMoreClicks = 100;
    
    while (readMoreClickCount < maxReadMoreClicks) {
      const readMoreButton = await page.$('button:has-text("Read more")');
      if (!readMoreButton) break;
      
      await readMoreButton.click();
      await page.waitForTimeout(300); // Shorter timeout since this is usually faster
      readMoreClickCount++;
    }
    
    console.log(`Clicked "Read more" ${readMoreClickCount} times`);
    
    console.log('Extracting data...');
    
    // Extract the author names and points
    const results = await page.evaluate((parsePointsFunc) => {
      const parsePoints = new Function('text', `return (${parsePointsFunc})(text);`);
      
      // Find all author divs, including in replies
      const authorDivs = document.querySelectorAll('div[class*="authorProfileRow"]');
      const entries = [];
      
      for (const div of authorDivs) {
        const h3Element = div.querySelector('h3');
        if (!h3Element) continue;
        
        const name = h3Element.textContent.trim();
        if (!name) continue;
        
        // Check siblings for points
        let currentSibling = div.nextElementSibling;
        
        //does the regex get just one output? it does, the biggest?
        const maxPoints = parsePoints(currentSibling.textContent.trim());

        entries.push({ name, points: maxPoints });
      }
      
      return entries;
    }, parsePointsFromText.toString());
    
    // Process the data to keep only one entry per user (with the highest points)
    const userPointsMap = new Map();

    // Log all entries for Justtmb
    const justtmbEntries = results.filter(entry => entry.name === 'Justtmb');
    console.log('All entries for Justtmb:', justtmbEntries);

    for (const entry of results) {
      const currentPoints = userPointsMap.get(entry.name) || 0;
      if (entry.points > currentPoints) {
        userPointsMap.set(entry.name, entry.points);
      }
    }
    
    const leaderboardData = Array.from(userPointsMap.entries())
      .map(([name, points]) => ({ name, points }));
    
    console.log(`Found ${results.length} total entries, ${leaderboardData.length} unique users`);
    
    return leaderboardData.length > 0 ? leaderboardData : [];
  } catch (error) {
    console.error('Error during scraping:', error);
    return [];
  } finally {
    await browser.close();
  }
}

// If this file is run directly
if (require.main === module) {
  scrapeWattpadData()
    .then(data => console.log('Scraped data:', data))
    .catch(error => console.error('Scraping failed:', error));
} else {
  module.exports = { 
    scrapeWattpadData,
    parsePointsFromText
  };
}
