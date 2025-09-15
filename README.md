# Rainbow Book Club Leaderboard

A web-based leaderboard application for tracking reading points in the Rainbow Book Club Build with vobe coding with claude connet 4.

## Features

- **API-Based Data Collection**: Fetches data from Wattpad's API(all comments on this months chapter) to track reader points
- **Server-Side Caching**: Implements caching on the server side instead of relying on local storage (this makes is we only do one call every 10 minutes to watt instead of every client (person looking at the board) does it's on.)
- **Comprehensive Points Detection**: Smart(XD) parsing of various point formats in comments (It's just an ugly ass regex basically)

## Maintinence

In ./config.js and public/client_config.js we collect all the variables that change, like the id of the chapter and the link to it. These have to be updated every month manually.

## Where stuff is

- the **.vercel** folder is for vercel stuff (the service we use to host)
- the **api** folder is for the serverless backend vercel routes
- the **tests** folder contains all tests, both on frontend, backend end to end etc
- the **public** folder is for all frontend things, like index.html and styles.css that contain all html and css respectively.

## Development

To run the project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Install Vercel CLI globally: `npm install -g vercel`
4. Run the Vercel development environment: `npx vercel dev`
5. Open the local URL shown in your terminal (typically http://localhost:3000)

This approach runs both the frontend and serverless API functions together, exactly as they'll work in production.

## todo
+ Buy domain to get rid of the vercel.app url
- See if we can make it embed when linked, so it shows the rainbow explosion but smaller
- show peoples avatars
- add feature - looking at past months (this can get a but messy)
- visually imply if you've made rainbow or not


## refactor and clean
- convert to type script (ongoing in separate branch)

