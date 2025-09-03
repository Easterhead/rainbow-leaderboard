# Rainbow Book Club Leaderboard

A web-based leaderboard application for tracking reading points in the Rainbow Book Club.

## Features

- **API-Based Data Collection**: Fetches data from Wattpad's API to track reader points
- **Server-Side Caching**: Implements caching on the server side instead of relying on local storage
- **Auto-Refreshing Data**: Automatically refreshes data every 10 minutes
- **Rainbow-Themed UI**: Visually appealing interface with rainbow colors for each row
- **Comprehensive Points Detection**: Smart parsing of various point formats in comments
- **Comment & Reply Processing**: Collects points from both main comments and their replies

## Technical Implementation

### Data Collection

- Interacts with Wattpad's API to fetch comments from the monthly reading challenge chapter
- Processes all replies to comments for comprehensive data collection
- Uses regex pattern matching to extract point values from various text formats

### Caching & Performance

- Server-side data caching with configurable refresh intervals
- Minimizes API calls to Wattpad by serving cached data when appropriate
- Client-side countdown timer showing time until next data refresh

### User Interface

- Rainbow-colored rows for visual appeal
- Real-time countdown timer showing when data will refresh
- Responsive design that works on mobile and desktop
- Helpful cloud tooltip explaining how points are tracked

## How Points Are Calculated

The system looks for point declarations in comments using various formats:
- Direct mentions: "42 points" or "42 pts"
- Total summaries: "Total: 50" or "Final points: 100"
- Mathematical expressions: "= 75"

For each user, the highest point value found across all their comments and replies is used for the leaderboard ranking.

## Development

To run the project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
4. Open `index.html` in your browser or use a local server

## Future Improvements

- User profile images in the leaderboard

## run vercel locally
npx vercel dev

## now
- which server code is run when now? The nodejs code doesn't seem to be run when opening index.html in the browser.

## todo
x change the code so we can deploy with vercel, have tested the fast and sloppy way and it didn't work. Maybe wait with this.
x Make variebles of the url to the chapter and the id of the chapter to use in the calls to watt
- Buy domain to get rid of the vercel.app url
x Print out the month at the head of the board
- See if we can make it embed when linked, so it shows the rainbow explosion but smaller
- Something with the countdown isn't makeing sense, it should be handled in the backend only now the countdown resets as we reload, it shouldn't
x Add cute rainbow in browser tab header thingy


