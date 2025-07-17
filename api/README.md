# Pro Play Backend Documentation

## Overview
The Pro Play backend is built with Express.js and provides API endpoints for the Pro Play Farcaster Mini App. It integrates with PandaScore for esports data, Base Sepolia for predictions, Supabase for user data, and Neynar for Farcaster interactions.

## Setup

1. Environment Variables
Create a `.env` file in the `/api` directory with the following:
```env
PORT=3001
PANDASCORE_TOKEN=your_pandascore_token
NEYNAR_API_KEY=your_neynar_api_key
BASE_RPC_URL=https://sepolia.base.org
PREDICTION_POOL_ADDRESS=your_contract_address
BASE_USDC_ADDRESS=your_base_usdc_address
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

2. Database Setup
Execute the SQL script in `api/db/init.sql` in your Supabase project to create the required tables:
- users: Stores user preferences
- followed_matches: Tracks matches users are following
- notifications: Manages match notifications

3. Smart Contract Deployment
1. Deploy PredictionPool.sol to Base Sepolia using Remix or Hardhat
2. Update PREDICTION_POOL_ADDRESS in .env with the deployed address

## API Endpoints

### Fixtures
- `GET /api/fixtures?fid={fid}`
  - Gets upcoming matches filtered by user preferences
  - Query params:
    - fid: User's Farcaster ID
  - Returns: Array of matches with team info and start times

### Live Scores
- `GET /api/live-scores`
  - Gets current live matches
  - Optional query param: fid for personalized results
  - Returns: Array of live matches with scores and stream links

### Predictions
- `POST /api/predictions`
  - Makes a prediction with stake
  - Body: 
    ```json
    {
      "matchId": "string",
      "predictedWinner": 1|2,
      "amount": "string",
      "fid": "string",
      "walletAddress": "string"
    }
    ```
- `GET /api/predictions/{matchId}`
  - Gets prediction info and prize pool
  - Returns: Pool sizes and match status

### Follow System
- `POST /api/follow`
  - Follows a match
  - Body: 
    ```json
    {
      "matchId": "string",
      "fid": "string"
    }
    ```
- `GET /api/follow/{fid}`
  - Lists user's followed matches
  - Returns: Array of followed matches

### User Preferences
- `POST /api/preferences`
  - Saves user preferences
  - Body:
    ```json
    {
      "fid": "string",
      "genres": ["lol", "csgo", "valorant"],
      "favorite_team": "string",
      "favorite_player": "string"
    }
    ```
- `GET /api/preferences/{fid}`
  - Gets user preferences
  - Returns: User's saved preferences

### Wallet
- `GET /api/wallet/{address}`
  - Gets wallet balances
  - Returns: ETH and USDC balances on Base

### Cast
- `POST /api/cast`
  - Posts a Farcaster cast
  - Body:
    ```json
    {
      "fid": "string",
      "matchId": "string",
      "type": "share"|"live"|"result"
    }
    ```

## Error Handling
- 400: Bad Request - Missing or invalid parameters
- 404: Not Found - Resource doesn't exist
- 500: Server Error - API or service failures

## Rate Limiting
The backend uses PandaScore's free tier, which has rate limits. Consider implementing caching for:
- Fixtures (cache for 1 hour)
- Live scores (cache for 30 seconds)
- Match details (cache for 5 minutes)

## Development
1. Start the backend:
   ```bash
   npm run dev:api
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```

## Production
1. Deploy the backend:
   ```bash
   npm run start:api
   ```
2. Deploy the frontend:
   ```bash
   npm run build
   npm run start
   ```

## Testing
Use the provided curl commands in the root README.md for API testing.

## Security Considerations
- All FIDs are validated against Farcaster frame context
- Rate limiting is implemented for API endpoints
- Environment variables are properly secured
- Input validation for all endpoints
- CORS is configured for frontend domain

## Database Schema
See `api/db/init.sql` for complete schema details.

### Key Tables:
1. users
   - fid (primary key)
   - genres (JSONB array)
   - favorite_team
   - favorite_player

2. followed_matches
   - id (UUID)
   - fid (foreign key)
   - match_id
   - created_at

3. notifications
   - id (UUID)
   - fid (foreign key)
   - match_id
   - message
   - notify_at
   - sent

## Smart Contract
See `api/contracts/PredictionPool.sol` for complete contract details.

### Key Functions:
1. makePrediction(uint256 matchId, uint8 predictedWinner)
2. finalizeMatch(uint256 matchId, uint8 winner)
3. claimReward(uint256 matchId)
4. getMatchStats(uint256 matchId)
