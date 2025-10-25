# Redeem Karma Points for XLM Tokens API

## Endpoint

**POST** `/staking/redeem`

## Description

Allows users to redeem their accumulated Karma points for XLM tokens based on the algorithm implemented in the smart contract.

## Request Body

```json
{
  "walletAddress": "string",    // Required: User's wallet address
  "karmaPoints": "number"       // Required: Number of karma points to redeem
}
```

## Response

### Success (200 OK)

```json
{
  "message": "Karma points redeemed successfully",
  "redeemed": {
    "karmaPoints": "number",        // Number of karma points redeemed
    "xlmTokens": "number",          // Number of XLM tokens received
    "transactionHash": "string"     // Blockchain transaction hash
  },
  "user": {
    "walletAddress": "string",      // User's wallet address
    "remainingKarmaPoints": "number" // User's remaining karma points
  },
  "blockchainResult": {
    "status": "success",
    "transactionHash": "string",
    "blockNumber": "number",
    "gasUsed": "number",
    "karmaPointsRedeemed": "number",
    "xlmTokensReceived": "number"
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "message": "Wallet address and karma points are required"
}
```

#### 400 Bad Request
```json
{
  "message": "Karma points must be greater than zero"
}
```

#### 400 Bad Request
```json
{
  "message": "Insufficient karma points"
}
```

#### 404 Not Found
```json
{
  "message": "User not found"
}
```

#### 500 Internal Server Error
```json
{
  "message": "Server error during redemption"
}
```

## Features

1. **Karma Point Validation**: Ensures users have sufficient karma points before redemption
2. **Smart Contract Integration**: Connects to the blockchain to execute the redemption algorithm
3. **Transaction Tracking**: Provides blockchain transaction details for verification
4. **Balance Updates**: Automatically updates user's karma point balance
5. **Rate Limiting**: Prevents abuse through excessive redemption requests

## Example Request

```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "karmaPoints": 100
}
```

## Example Response

```json
{
  "message": "Karma points redeemed successfully",
  "redeemed": {
    "karmaPoints": 100,
    "xlmTokens": 10,
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
    "karmaPointsRedeemed": 100,
    "xlmTokensReceived": 10
  }
}
```

## Redemption Algorithm

The conversion rate from Karma points to XLM tokens is determined by the smart contract algorithm. The current placeholder implementation uses a 10:1 ratio (10 Karma points = 1 XLM token), but this can be adjusted in the smart contract.

## Security Considerations

1. **Authentication**: In production, this endpoint should be protected with proper authentication
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Transaction Verification**: Verify blockchain transactions before confirming redemption
4. **Audit Trail**: Maintain logs of all redemption transactions for auditing purposes