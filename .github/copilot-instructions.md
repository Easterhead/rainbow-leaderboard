# Rainbow Book Club Leaderboard - AI Development Guide

## Architecture Overview

This is a serverless web application that creates a points-based leaderboard for a book club by parsing Wattpad comments. The architecture follows a simple client-serverless pattern:

- **Frontend**: Static HTML/CSS/JS served from `public/` folder
- **Backend**: Vercel serverless function at `api/leaderboard.js`
- **Data Source**: Wattpad API comments parsing for point calculation
- **Deployment**: Vercel with automatic GitHub deployments

## Key Components & Data Flow

1. **Monthly Configuration** (`config.js` + `public/client_config.js`):
   - Both files must be updated monthly with new chapter ID and dates
   - Backend config holds Wattpad chapter ID, frontend config holds display values
   - This dual-config pattern ensures serverless functions get chapter data

2. **Points Parsing System** (`backend/wattpad-api.js`):
   - Fetches comments from Wattpad API using chapter ID
   - Recursively fetches all replies to capture nested point reports
   - Uses complex regex to parse multiple point formats: "42 points", "Total: 42", "= 42"
   - Returns highest points per unique user (handles multiple comments per person)

3. **Client-Side Caching** (`public/leaderboard-client.js`):
   - 10-minute localStorage cache to reduce API calls
   - Auto-refresh countdown timer with visual urgency indicators
   - Environment detection (localhost vs production) for API endpoints

## Development Workflows

### Local Development
```bash
npx vercel dev  # Runs both frontend and serverless functions locally
```
This is the ONLY way to test the full stack - don't use `node` directly.

### Testing
**CRITICAL: Always run ALL tests before and after any changes**
```bash
npm test           # Runs Jest unit tests for backend and frontend logic
npx playwright test # Runs E2E tests for UI interactions and user flows
```

**Complete Test Suite Overview:**
- **Jest Unit Tests** (`npm test`): Pure function logic, data processing, backend API functions
- **Playwright E2E Tests** (`npx playwright test`): HTML interactions, navigation, UI behavior, user workflows

**MANDATORY: Before any refactoring or code changes:**
1. Run `npm test` to check unit tests
2. Run `npx playwright test` to check E2E tests  
3. Ensure ALL tests pass before proceeding
4. After changes, run both test suites again to verify nothing broke

**Never assume partial test coverage is sufficient** - both test suites must pass for complete validation.

**IMPORTANT: Playwright E2E tests take time** - be patient and wait for completion. E2E tests can take 30-60 seconds or more to complete as they start up the development server and run browser automation. Do not interrupt or assume tests are hanging unless they exceed 2-3 minutes without output.

### Monthly Maintenance (Critical)
Update both config files with new chapter data:
- `config.js`: Update `chapterId` and `chapterUrl` 
- `public/client_config.js`: Update `currentMonth` and `currentYear`

## Project-Specific Patterns

### Points Detection Logic
The `parsePointsFromText()` function uses a single regex with three capture groups:
- Group 1: Standard format ("42 points", "42 pts")  
- Group 2: Final/Total format ("Final: 42", "Total points: 42")
- Group 3: Equals format ("= 42")

Returns highest value found to handle users posting running totals.

### Rainbow Achievement System
Users with 60+ points get special visual treatment:
- Rainbow border frame around their table rows
- Celebration message after last qualifying user
- 🌈 emoji indicator vs 💧 for others

### Client-Side Architecture
- No build system - vanilla JS with module exports for testing
- Environment detection pattern for API URLs
- Error handling shows "sad unicorn" fallback UI
- Storage utilities with JSON parsing for localStorage

### Vercel Serverless Pattern
- API routes in `api/` folder map to endpoints automatically
- CORS headers manually set for cross-origin requests
- Single endpoint `/api/leaderboard` handles all data fetching

## Testing Approach & TDD Workflow

**Always use Test-Driven Development (TDD):**
1. Write failing tests first before implementing any new functionality
2. Write minimal code to make tests pass
3. Refactor while keeping tests green
4. **Stop after each step** - confirm red/green phase completion before proceeding to next step

**CRITICAL TDD RULES:**
- **NEVER add logic speculatively** - only implement what failing tests demand
- **NO "this might be useful" code** - if there's no failing test requiring it, don't write it
- **Every line of code must be driven by a test** - no exceptions
- **Implementation should be minimal** - just enough to make the current failing test pass
- **Don't anticipate future needs** - let tests drive all functionality
- **NEVER remove or change existing tests** - unless explicitly instructed to do so
- **Only add NEW tests** - existing tests must remain unchanged

**BEFORE WRITING ANY CODE - MANDATORY CHECKS:**
- Is there a failing test that requires this exact functionality?
- Am I implementing ONLY what the failing test demands?
- Am I adding ANY logic beyond the minimal requirement?
- Am I making ANY assumptions about future requirements?
- If adding validation/checks: Is there a test that fails without this validation?
- If adding error handling: Is there a test that requires this specific error case?

**FORBIDDEN SPECULATIVE ADDITIONS:**
- Duplicate prevention (unless test requires it)
- Input validation (unless test requires it)  
- Error handling (unless test requires it)
- Performance optimizations (unless test requires it)
- Defensive programming patterns (unless test requires it)
- "Safety checks" or "best practices" (unless test requires it)

**Mandatory Stop Points During Development:**
- After writing failing tests (RED phase confirmation)
- After making tests pass (GREEN phase confirmation)  
- When switching between file types (HTML → JavaScript, JavaScript → Tests, etc.)
- When switching between different implementation layers (UI structure → Logic → Event handlers)
- When moving from one feature component to another (User selection → Book display → Chapter functionality)
- Before starting any refactoring phase
- After completing any significant code change that affects multiple functions

**Stop Indicators - Always pause and ask for confirmation when:**
- About to switch from test writing to implementation
- About to switch from HTML structure changes to JavaScript logic
- About to move from one major function to implementing another
- Completing any phase that changes the user experience
- Ready to verify test results after implementation changes

**Testing Strategy by Type:**
- **Jest Unit Tests**: Pure function logic (no DOM interaction)
  - `parsePointsFromText()` with various comment formats
  - `calculateCountdownValues()` for timer logic
  - Backend API functions and data processing
  - Export functions from modules using `module.exports` for Jest compatibility

- **Playwright E2E Tests**: HTML interactions, navigation, UI behavior
  - Button clicks and navigation between pages
  - Form submissions and user interactions
  - Visual elements and DOM manipulation
  - Cross-browser compatibility testing

**Test Organization:**
- Unit tests: `tests/*.test.js` - Jest for pure functions
- E2E tests: `tests/e2e/*.spec.js` - Playwright for HTML/UI interactions
- Backend logic: `tests/wattpad-api.test.js`
- Frontend utilities: `tests/leaderboard-client.test.js`

**Test Result Checking:**
- Check `test-results/.last-run.json` to see if Playwright E2E tests passed or failed
- Look for `"status": "passed"` vs `"status": "failed"` in the JSON file
- Use this file when unsure about test outcomes from terminal output

**Test Data Management:**
- TODO: When implementing real backend, move mock user data from `public/report-reading.js` to E2E test setup
- Current E2E tests depend on hardcoded mock data (BookLover42 with 85 points)
- This will prevent test breakage when backend data changes
- Remove this TODO section from instructions once completed

Run individual backend functions with: `node backend/wattpad-api.js`

## External Dependencies

- **Wattpad API**: Uses public endpoints, no authentication required
- **Vercel**: Deployment platform, requires `.vercel` folder for config
- **Axios**: HTTP client for server-side API calls only
- **Jest**: Testing framework

## Common Gotchas

1. **Config Synchronization**: Both config files must be updated monthly
2. **Cache Issues**: localStorage cache can show stale data - clear manually if needed
3. **Serverless Cold Starts**: First request may be slow in production
4. **CORS**: API calls must go through serverless function, not directly from frontend
5. **Points Parsing**: Complex regex requires testing with real comment formats