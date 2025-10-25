# User Registration API

## Endpoint

**POST** `/users/register`

## Request Body

```json
{
  "walletAddress": "string",      // Required: Ethereum wallet address
  "name": "string",               // Required: User's full name
  "dateOfBirth": "string",        // Required: Date of birth (YYYY-MM-DD)
  "instagram": "string",          // Optional: Instagram handle
  "facebook": "string",           // Optional: Facebook username
  "twitter": "string"             // Optional: Twitter handle
}
```

## Response

### Success (201 Created)

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "string",               // User ID in database
    "walletAddress": "string",    // Ethereum wallet address
    "name": "string",             // User's full name
    "username": "string",         // Generated unique username
    "avatar": "string",           // Generated avatar URL
    "karmaPoints": 0,             // Initial karma points
    "isOver18": true              // Age verification status
  },
  "blockchainResult": {
    "status": "success",
    "transactionHash": "string",
    "blockNumber": "number",
    "gasUsed": "number"
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "message": "Wallet address, name, and date of birth are required"
}
```

#### 400 Bad Request
```json
{
  "message": "User must be over 18 years old to register"
}
```

#### 400 Bad Request
```json
{
  "message": "User already registered"
}
```

#### 500 Internal Server Error
```json
{
  "message": "Server error during registration"
}
```

## Features

1. **Age Verification**: Users must be 18+ to register
2. **Unique Username Generation**: Automatically generates a unique, funny username if the user's name is already taken
3. **Avatar Generation**: Creates a unique avatar using DiceBear API
4. **Social Media Integration**: Stores Instagram, Facebook, and Twitter handles
5. **Blockchain Integration**: Registers user on the blockchain with all relevant data
6. **Data Validation**: Validates all required fields and wallet address format

## Example Request

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

## Example Response

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