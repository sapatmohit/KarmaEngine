# Karma Engine Backend

This is the backend service for the Karma Engine, a decentralized reputation protocol built on blockchain technology.

## Table of Contents

1. [Architecture](#architecture)
2. [API Endpoints](#api-endpoints)
3. [Database Models](#database-models)
4. [Services](#services)
5. [Setup](#setup)

## Architecture

The backend follows a modular architecture with the following components:

```
src/
├── controllers/     # Request handlers
├── models/         # Database models
├── routes/         # API route definitions
├── services/       # Business logic and external integrations
├── middleware/     # Custom middleware functions
├── config/         # Configuration files
├── utils/          # Utility functions
└── database/       # Database connection and configuration
```

## API Endpoints

### User Management

- `POST /api/users/register` - Register a new user
- `GET /api/users/:walletAddress` - Get user by wallet address
- `PUT /api/users/:walletAddress/karma` - Update user karma points

### Activity Tracking

- `POST /api/activities` - Record a new activity
- `GET /api/activities/:walletAddress` - Get user activities
- `GET /api/activities/:walletAddress/stats` - Get activity statistics

### Staking

- `POST /api/staking/stake` - Stake tokens
- `POST /api/staking/unstake` - Unstake tokens
- `POST /api/staking/redeem` - Redeem karma points for XLM tokens
- `GET /api/staking/:walletAddress` - Get user staking records

### Karma

- `GET /api/karma/balance/:walletAddress` - Get user's karma balance
- `POST /api/karma/sync/:walletAddress` - Sync user's karma between database and blockchain
- `GET /api/karma/leaderboard` - Get leaderboard

## Database Models

### User

```javascript
{
  walletAddress: String,  // Unique wallet address (used as user ID)
  karmaPoints: Number,    // Current karma points
  stakedAmount: Number,   // Amount of tokens staked
  multiplier: Number,     // Karma multiplier based on staking
  createdAt: Date,        // Registration date
  lastActivity: Date,     // Last activity timestamp
  isActive: Boolean       // Account status
}
```

### Activity

```javascript
{
  userId: ObjectId,       // Reference to User
  walletAddress: String,  // User's wallet address
  type: String,           // Activity type (post, comment, like, repost, report)
  value: Number,          // Base karma value
  multiplier: Number,     // Applied multiplier
  finalKarma: Number,     // Final karma value after multiplier
  timestamp: Date,        // Activity timestamp
  metadata: Object        // Additional activity data
}
```

### Staking

```javascript
{
  userId: ObjectId,           // Reference to User
  walletAddress: String,      // User's wallet address
  amount: Number,             // Staked amount
  multiplier: Number,         // Applied multiplier
  startDate: Date,            // Staking start date
  endDate: Date,              // Staking end date (if unstaked)
  isActive: Boolean,          // Staking status
  transactionHash: String     // Blockchain transaction hash
}
```

## Services

### Blockchain Service

Handles all interactions with smart contracts:
- User registration on blockchain
- Karma point updates
- Token staking/unstaking
- Karma point redemption for XLM tokens
- Balance queries

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/karmaengine
   JWT_SECRET=your_jwt_secret
   BLOCKCHAIN_NETWORK=hardhat
   CONTRACT_ADDRESS=your_contract_address
   RPC_URL=http://localhost:8545
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will start on port 3000 (or the port specified in your .env file).