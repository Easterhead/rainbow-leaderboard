# Rainbow Book Club Leaderboard

A web-based leaderboard application for tracking reading points in the Rainbow Book Club. Built with vibe coding with claude connet 4.

## Features

- **API-Based Data Collection**: Fetches data from Wattpad's API (all comments on this month's chapter) to track reader points
- **Serverless Backend**: Uses Vercel serverless functions to handle API calls, avoiding CORS issues and keeping API requests server-side
- **Client-Side Caching**: Implements local storage caching with 10-minute refresh intervals to reduce API calls
- **Comprehensive Points Detection**: Smart parsing of various point formats in comments using regex patterns

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
- [x] show peoples avatars
- add feature - looking at past months (this can get a bit messy)
- [x] visually imply if you've made rainbow or not
- [ ] fix cache problem where it suddenly shows week old data. (can't test so have no idea if it worked, time will tell)
- [ ] it looks like the server goes down in prod and doesn't wake up until we reload the page, can we fix that? (vercel stuff)
- [ ] Add feature - help with reporting points. Select author and their book from list and select which chapters were read and get a text you can just copy into the comments. Can at a later time be used to let this handle all the points it we want that. (this is big, will need to check which of watt's endpoints support stuff and get the text from the chapter with all the members) (https://www.wattpad.com/apiv2/?m=storytext&id=1564485447 gets all the text for august so that should be easy to get and parse to get all the members of the book club) And https://www.wattpad.com/v4/users/pixelmum/stories/published gets all the books and all chapters for a user


## refactor and clean
- convert to type script (ongoing in separate branch - but can't get it to work with vercel so may abandone that)

