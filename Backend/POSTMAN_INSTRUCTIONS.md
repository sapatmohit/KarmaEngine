# Postman Testing Instructions for Karma Engine Backend

This guide will help you test the Karma Engine backend API using Postman.

## Prerequisites

1. **Postman** installed on your system
2. **Node.js** and **MongoDB** running locally (or accessible database)
3. **Karma Engine Backend** server running on `http://localhost:3000`

## Setup Instructions

### 1. Start the Backend Server

First, make sure your backend server is running:

```bash
cd e:\Coding\Web3\KarmaEngine\Backend
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

### 2. Import the Postman Collection

1. Open Postman
2. Click on the "Import" button in the top left corner
3. Select the file: `e:\Coding\Web3\KarmaEngine\Backend\KarmaEngine.postman_collection.json`
4. Click "Import"

### 3. Environment Setup (Optional)

You can create an environment in Postman to easily switch between different servers:

1. Click on the "Environment" quick look icon (eye icon) in the top right
2. Click "Add"
3. Name it "Karma Engine"
4. Add a variable:
   - Key: `base_url`
   - Value: `http://localhost:3000`
5. Click "Add"

## Testing the API Endpoints

### 1. User Registration

**Endpoint**: POST `/api/users/register`

This is the first endpoint you should test. It registers a new user with all required information.

**Sample Request Body**:
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "name": "John Doe",
  "dateOfBirth": "1995-08-15",
  "instagram": "johndoe_insta",
  "facebook": "johndoe_fb",
  "twitter": "johndoe_twitter"
}
```

**Expected Response**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "60f7b3b3d9b3a42d8c9b3d91",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "name": "John Doe",
    "username": "CrazyPanda420",
    "avatar": "https://api.dicebear.com/7.x/adventurer/png?seed=bynn1n91ivb",
    "karmaPoints": 0,
    "isOver18": true
  },
  "blockchainResult": {
    "status": "success",
    "transactionHash": "0x3f2d35Cc6634C0532925a3b844Bc454e4438f44e",
    "blockNumber": 1234567,
    "gasUsed": 45000
  }
}
```

### 2. Get User by Wallet Address

**Endpoint**: GET `/api/users/{walletAddress}`

After registering a user, you can retrieve their information using this endpoint.

### 3. Record Activity

**Endpoint**: POST `/api/activities`

Record user activities like posts, comments, likes, etc.

**Sample Request Body**:
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "type": "post",
  "metadata": {
    "content": "This is a sample post for testing"
  }
}
```

### 4. Get User Activities

**Endpoint**: GET `/api/activities/{walletAddress}`

Retrieve a user's activity history.

### 5. Staking Operations

**Stake Tokens**: POST `/api/staking/stake`
**Unstake Tokens**: POST `/api/staking/unstake`
**Redeem Karma for XLM**: POST `/api/staking/redeem`
**Get Staking Records**: GET `/api/staking/{walletAddress}`

### 6. Karma Operations

**Get Karma Balance**: GET `/api/karma/balance/{walletAddress}`
**Sync Karma**: POST `/api/karma/sync/{walletAddress}`
**Get Leaderboard**: GET `/api/karma/leaderboard`

## Testing Different Scenarios

### 1. Age Verification Test

Try registering a user with a date of birth that makes them under 18:

```json
{
  "walletAddress": "0x1234567890123456789012345678901234567890",
  "name": "Young User",
  "dateOfBirth": "2010-01-01",
  "instagram": "younguser"
}
```

**Expected Response**:
```json
{
  "message": "User must be over 18 years old to register"
}
```

### 2. Duplicate User Test

Try registering the same wallet address twice. The second attempt should fail with:

```json
{
  "message": "User already registered"
}
```

### 3. Missing Required Fields Test

Try registering without required fields:

```json
{
  "walletAddress": "0x1234567890123456789012345678901234567890"
}
```

**Expected Response**:
```json
{
  "message": "Wallet address, name, and date of birth are required"
}
```

### 4. Karma Redemption Test

After earning some karma points, try redeeming them for XLM tokens:

```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "karmaPoints": 50
}
```

**Expected Response**:
```json
{
  "message": "Karma points redeemed successfully",
  "redeemed": {
    "karmaPoints": 50,
    "xlmTokens": 5,
    "transactionHash": "0x3f2d35Cc6634C0532925a3b844Bc454e4438f44e"
  },
  "user": {
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "remainingKarmaPoints": 450
  },
  "blockchainResult": {
    "status": "success",
    "transactionHash": "0x3f2d35Cc6634C0532925a3b844Bc454e4438f44e",
    "blockNumber": 1234567,
    "gasUsed": 45000,
    "karmaPointsRedeemed": 50,
    "xlmTokensReceived": 5
  }
}
```

## Troubleshooting

### 1. Database Connection Issues

Make sure MongoDB is running. If you're using MongoDB Atlas, update the connection string in your `.env` file:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/karmaengine
```

### 2. Port Conflicts

If port 3000 is already in use, change it in your `.env` file:

```
PORT=3001
```

### 3. CORS Issues

The backend already includes CORS middleware, but if you encounter issues, make sure your frontend is configured correctly.

## Common Response Codes

- **200**: Success
- **201**: Created (for registration)
- **400**: Bad Request (missing fields, validation errors)
- **404**: Not Found (user not found)
- **500**: Internal Server Error

## Notes

1. All wallet addresses should be valid Ethereum addresses (0x followed by 40 hexadecimal characters)
2. Date of birth should be in YYYY-MM-DD format
3. The blockchain integration is currently using placeholder functions and will need to be connected to actual smart contracts
4. Avatar URLs are generated using the DiceBear API and are randomly generated for each user
5. Usernames are automatically generated if the user's name is already taken

Happy testing!