# Rainbow Book Club Leaderboard

A web-based leaderboard application for tracking reading points in the Rainbow Book Club.

## Features

- **API-Based Data Collection**: Fetches data from Wattpad's API(all comments on this months chapter) to track reader points
- **Server-Side Caching**: Implements caching on the server side instead of relying on local storage (this makes is we only do one call every 10 minutes to watt instead of every client (person looking at the board) does it's on.)
- **Comprehensive Points Detection**: Smart(XD) parsing of various point formats in comments (It's just an ugly ass regex basically)
- **TypeScript Support**: Strongly typed codebase for improved reliability and maintainability
- **Webpack Bundling**: Modern build system for browser compatibility

## Maintinence

In config.js we collect all the variables that change, like the id of the chapter and the link to it. These have to be updated every month manually.

## Project Structure

- the **.vercel** folder is for vercel stuff (the service we use to host)
- the **api** folder is for the serverless backend vercel routes
- the **tests** folder contains all tests, both on frontend, backend end to end etc
- the **public** folder is for all frontend things, like index.html and styles.css that contain all html and css respectively.
- the **dist** folder contains compiled TypeScript files and bundled JavaScript - DO NOT MODIFY these files directly as they are generated automatically

## Development

To run the project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build` (this builds both frontend and server files)
4. Install Vercel CLI globally: `npm install -g vercel`
5. Run the Vercel development environment: `npx vercel dev`
6. Open the local URL shown in your terminal (typically http://localhost:3000)

This approach runs both the frontend and serverless API functions together, exactly as they'll work in production.

### Development Workflow

When making changes to the code:

1. Edit TypeScript files in their respective locations (not the compiled files in dist/)
2. Run `npm run build:frontend` to compile and bundle frontend code
3. Run `npm run build:server` to compile server-side code
4. Or simply run `npm run build` to do both at once
5. Test your changes with `npx vercel dev`

Remember that all TypeScript files are compiled to JavaScript in the dist/ directory. Never edit these files directly as they will be overwritten during the build process.

## Todo
+ Buy domain to get rid of the vercel.app url
- See if we can make it embed when linked, so it shows the rainbow explosion but smaller
- Something with the countdown isn't makeing sense, it should be handled in the backend only now the countdown resets as we reload, it shouldn't.
- show peoples avatars
- Consider converting to React for more complex UI features

## Completed Improvements
- ✅ Refactored code into testable functions with a cleaner structure
- ✅ Converted to TypeScript for better type safety
- ✅ Added Webpack bundling for browser compatibility

## Future Features
- Add feature - looking at past months (this can get a bit messy)
