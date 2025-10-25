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

- `POST /users/register` - Register a new user
- `GET /users/:walletAddress` - Get user by wallet address
- `PUT /users/:walletAddress/karma` - Update user karma points

### Activity Tracking

- `POST /activities` - Record a new activity
- `GET /activities/:walletAddress` - Get user activities
- `GET /activities/:walletAddress/stats` - Get activity statistics

### Staking

- `POST /staking/stake` - Stake tokens
- `POST /staking/unstake` - Unstake tokens
- `POST /staking/redeem` - Redeem karma points for XLM tokens
- `GET /staking/:walletAddress` - Get user staking records

### Karma

- `GET /karma/balance/:walletAddress` - Get user's karma balance
- `POST /karma/sync/:walletAddress` - Sync user's karma between database and blockchain
- `GET /karma/leaderboard` - Get leaderboard

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

## Troubleshooting Network Issues

If you encounter "Network error: Client Exception with socketexception" or similar connection errors:

1. **Verify the server is running**:
   - Look for "Karma Engine server running on port 3000" message in the terminal
   - Check that no other process is using the same port

2. **Check port configuration**:
   - Ensure frontend clients are configured to connect to the correct port
   - Default is port 3000

3. **Test connectivity**:
   ```bash
   curl http://localhost:3000/users/test-wallet
   ```
   This should return a "User not found" response rather than a connection error.

4. **Firewall and network issues**:
   - Check if Windows Firewall is blocking the connection
   - Ensure no antivirus software is interfering

For more detailed troubleshooting steps, see the NETWORK_TROUBLESHOOTING.md file in the project root.
