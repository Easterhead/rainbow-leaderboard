# Rainbow Book Club Leaderboard

A web-based leaderboard application that tracks and displays points for members of the Rainbow Book Club. The application scrapes points data from a Wattpad page and presents it in a clean, sortable leaderboard interface.

## Features

- Automated scraping of points data from Wattpad comments
- Handling of multiple points formats (points, pts, final totals, etc.)
- Deduplication of entries (keeps highest score for each user)
- Clean web interface to display the leaderboard

## Prerequisites

- Node.js (v14 or newer)
- npm

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rainbow-leaderboard.git
   cd rainbow-leaderboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install Playwright browsers (required for the scraper):
   ```
   npx playwright install chromium
   ```

## Usage

### Running the Web Server

To start the web server that displays the leaderboard:

```
npm start
```

The server will start on http://localhost:3000 (or the port specified in your environment variables).

### Testing the Scraper

To run the scraper directly and see the data it retrieves:

```
npm run test-scraper
```

This will output the raw data fetched from the Wattpad page.

### Running Tests

To run the unit tests for the points parsing logic:

```
npm test
```

## Project Structure

- `server.js` - Main web server that serves the leaderboard
- `wattpad-scraper.js` - Contains the scraping logic
- `wattpad-scraper.test.js` - Unit tests for the points parsing
- `public/` - Static files for the web interface

## How it Works

1. The application uses Playwright to load and interact with the Wattpad page
2. It clicks "Show more" buttons to load all comments
3. It extracts usernames and points using regex patterns
4. Points are parsed from various formats (e.g., "42 points", "Final: 50", "Total = 70")
5. The data is deduplicated to keep only the highest score for each user
6. The results are displayed in a sortable web interface

## Customization

To change the Wattpad page that's being scraped, edit the URL in `wattpad-scraper.js`. Needs to be done every month.


## TODO
x look for points in replies to comments as well, should fix pixels, may have to add some enters and tabs into the spaces as well for that one
- whitelist of blacklist users
- add text to explain how to get on the boeard with the correct amount of points
- host it
- get peoples profile pictures
x show cute nimation while loading 
- show timer for then next update will be