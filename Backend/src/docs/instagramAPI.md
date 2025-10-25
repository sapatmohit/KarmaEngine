# Instagram Karma Integration API

This document describes the Instagram scraping and sentiment analysis integration for the Karma Engine.

## Overview

The Instagram integration allows the system to:
1. Scrape public Instagram posts and reels from user profiles
2. Store URLs categorized by content type (posts/reels)
3. Perform sentiment analysis using Google Gemini AI
4. Award karma points based on content quality and sentiment

## Prerequisites

### Required Environment Variables

Add these to your `.env` file:

```env
# Instagram Scraping Service
INSTAGRAM_SCRAPING_METHOD=rapidapi  # Options: rapidapi, apify, custom
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=instagram-scraper-api2.p.rapidapi.com

# Alternative: Apify
APIFY_TOKEN=your_apify_token_here

# Sentiment Analysis
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-pro
```

### Get API Keys

1. **RapidAPI** (Recommended for Instagram scraping):
   - Sign up at https://rapidapi.com/
   - Subscribe to "Instagram Scraper API" or similar
   - Copy your API key

2. **Apify** (Alternative):
   - Sign up at https://apify.com/
   - Get your API token from settings
   - Use the Instagram Scraper actor

3. **Google Gemini**:
   - Go to https://makersuite.google.com/app/apikey
   - Create an API key
   - Enable Gemini API

## API Endpoints

### 1. Update Instagram Username

**Endpoint:** `PUT /instagram/:walletAddress/username`

**Description:** Set or update a user's Instagram username

**Request Body:**
```json
{
  "instagramUsername": "username"
}
```

**Response:**
```json
{
  "message": "Instagram username updated successfully",
  "instagramUsername": "username"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/instagram/0x123.../username \
  -H "Content-Type: application/json" \
  -d '{"instagramUsername": "example_user"}'
```

---

### 2. Scrape Instagram Content

**Endpoint:** `POST /instagram/:walletAddress/scrape`

**Description:** Scrape all posts and reels from user's Instagram profile

**Query Parameters:**
- `forceRescrape` (boolean): Force rescraping even if cached (default: false)

**Response:**
```json
{
  "message": "Instagram content scraped successfully",
  "instagramUsername": "example_user",
  "content": {
    "posts": [
      {
        "url": "https://www.instagram.com/p/ABC123/",
        "shortcode": "ABC123",
        "type": "post",
        "metadata": {
          "caption": "Amazing day!",
          "likes": 150,
          "comments": 20,
          "timestamp": "2024-01-01T12:00:00.000Z",
          "thumbnailUrl": "https://..."
        }
      }
    ],
    "reels": [...],
    "totalPosts": 25,
    "totalReels": 10
  },
  "newContentSaved": 35,
  "scrapedAt": "2024-01-15T10:30:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/instagram/0x123.../scrape
```

---

### 3. Get Stored Content

**Endpoint:** `GET /instagram/:walletAddress/content`

**Description:** Retrieve stored Instagram content from database

**Query Parameters:**
- `contentType` (string): Filter by 'post' or 'reel'
- `analyzed` (boolean): Filter by sentiment analysis status
- `limit` (number): Number of items to return (default: 50)

**Response:**
```json
{
  "content": {
    "posts": [...],
    "reels": [...],
    "totalPosts": 25,
    "totalReels": 10,
    "analyzedPosts": 20,
    "analyzedReels": 8
  }
}
```

**Example:**
```bash
# Get all content
curl http://localhost:3000/instagram/0x123.../content

# Get only unanalyzed reels
curl http://localhost:3000/instagram/0x123.../content?contentType=reel&analyzed=false
```

---

### 4. Analyze Sentiment & Award Karma

**Endpoint:** `POST /instagram/:walletAddress/analyze`

**Description:** Perform sentiment analysis on content and award karma points

**Request Body:**
```json
{
  "contentIds": ["content_id_1", "content_id_2"],
  "analyzeAll": false
}
```

**Response:**
```json
{
  "message": "Sentiment analysis completed",
  "analyzed": 15,
  "totalKarmaAwarded": 850,
  "results": [
    {
      "contentId": "...",
      "url": "https://instagram.com/p/ABC123/",
      "contentType": "post",
      "sentiment": "positive",
      "sentimentScore": 85,
      "karmaAwarded": 95
    }
  ],
  "user": {
    "walletAddress": "0x123...",
    "karmaPoints": 1500
  }
}
```

**Example:**
```bash
# Analyze specific content
curl -X POST http://localhost:3000/instagram/0x123.../analyze \
  -H "Content-Type: application/json" \
  -d '{"contentIds": ["id1", "id2"]}'

# Analyze all unanalyzed content
curl -X POST http://localhost:3000/instagram/0x123.../analyze \
  -H "Content-Type: application/json" \
  -d '{"analyzeAll": true}'
```

---

### 5. Complete Processing (Recommended)

**Endpoint:** `POST /instagram/:walletAddress/process`

**Description:** Complete workflow - scrape, analyze, and award karma in one call

**Response:**
```json
{
  "message": "Instagram karma processing completed",
  "instagramUsername": "example_user",
  "scraped": {
    "totalPosts": 25,
    "totalReels": 10
  },
  "analyzed": 35,
  "totalKarmaAwarded": 1250,
  "results": [...],
  "user": {
    "walletAddress": "0x123...",
    "karmaPoints": 2750,
    "multiplier": 1.2
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/instagram/0x123.../process
```

---

## Workflow

### Typical Integration Flow

1. **User Registration**
   ```bash
   POST /users/register
   {
     "walletAddress": "0x123...",
     "name": "John Doe",
     "dateOfBirth": "1990-01-01"
   }
   ```

2. **Set Instagram Username**
   ```bash
   PUT /instagram/0x123.../username
   {
     "instagramUsername": "johndoe"
   }
   ```

3. **Process Instagram Content** (One-stop solution)
   ```bash
   POST /instagram/0x123.../process
   ```

   This will:
   - Scrape all posts and reels
   - Save URLs to MongoDB
   - Fetch detailed post information
   - Perform sentiment analysis via Gemini
   - Award karma points
   - Update user's karma balance

### Scheduled Processing

You can set up a cron job to periodically process Instagram content:

```javascript
// Using node-cron
const cron = require('node-cron');

// Process Instagram karma daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  const users = await User.find({ 'socialMedia.instagram': { $exists: true } });
  
  for (const user of users) {
    try {
      await axios.post(`http://localhost:3000/instagram/${user.walletAddress}/process`);
    } catch (error) {
      console.error(`Error processing ${user.walletAddress}:`, error);
    }
  }
});
```

---

## Sentiment Analysis & Karma Calculation

### Karma Point System

The system analyzes Instagram content and awards karma based on:

1. **Sentiment Score** (-100 to +100):
   - **80-100**: Highly positive, inspirational content → 100 karma
   - **50-79**: Positive, helpful content → 75 karma
   - **20-49**: Neutral to mildly positive → 50 karma
   - **0-19**: Neutral content → 25 karma
   - **-20 to -1**: Slightly negative → 10 karma
   - **-50 to -21**: Negative → 0 karma
   - **Below -50**: Harmful/toxic content → -50 karma (penalty)

2. **Content Category**:
   - Educational, inspirational, helpful → Higher multiplier
   - Entertainment, personal → Standard multiplier
   - Promotional, sales → Lower multiplier

3. **Engagement Metrics**:
   - Likes and comments provide up to 20% bonus
   - Formula: `engagementBonus = 1 + min(0.2, log10(likes + comments*5 + 1) / 50)`

4. **AI Confidence**:
   - Analysis confidence (0-1) is factored into final karma
   - Low confidence = reduced karma award

5. **User Multiplier**:
   - Applied based on staking amount
   - Final karma = base karma × user multiplier

### Example Calculation

```
Post with:
- Sentiment score: 85 (highly positive)
- Category: Educational
- Likes: 200, Comments: 30
- AI confidence: 0.9
- User multiplier: 1.5

Base karma: 100 (score >= 80)
AI multiplier: 1.8 (educational content)
After AI: 100 × 1.8 = 180
Engagement: log10(200 + 30*5 + 1) / 50 = 0.48
Engagement multiplier: 1.2 (capped at 20%)
After engagement: 180 × 1.2 = 216
Confidence: 216 × 0.9 = 194
User multiplier: 194 × 1.5 = 291 karma awarded
```

---

## External API Integration Placeholder

In the sentiment analysis flow, there's a placeholder for integrating an external API to fetch additional post details:

**Location:** `instagramController.js` - `analyzeSentimentAndAwardKarma()` and `processInstagramKarma()`

```javascript
// PLACEHOLDER: External API integration point
// Replace this with your actual API call
const externalApiData = await yourExternalAPI.getPostDetails(content.url);

// Example structure:
const externalApiData = {
  enhancedCaption: "...",
  comments: [...],
  engagement: {...},
  userTags: [...],
  location: {...}
};

// Merge with existing details
postDetails = { ...postDetails, ...externalApiData };
```

---

## Error Handling

### Common Errors

1. **Instagram username not configured**
   ```json
   {
     "message": "Instagram username not configured for this user",
     "hint": "Update user profile with Instagram username first"
   }
   ```

2. **Private account**
   ```json
   {
     "message": "Instagram account is private. Only public accounts can be scraped."
   }
   ```

3. **Invalid API key**
   ```json
   {
     "message": "Error scraping Instagram content",
     "error": "Invalid RapidAPI key. Please configure RAPIDAPI_KEY in .env"
   }
   ```

4. **Rate limiting**
   - The system includes automatic 1-second delays between API calls
   - For large accounts, processing may take several minutes

---

## Database Schema

### InstagramContent Model

```javascript
{
  userId: ObjectId,              // Reference to User
  walletAddress: String,         // User's wallet
  instagramUsername: String,     // Instagram username
  contentType: String,           // 'post' or 'reel'
  url: String,                   // Instagram URL
  shortcode: String,             // Unique post identifier
  scrapedAt: Date,              // When scraped
  sentimentAnalyzed: Boolean,   // Analysis status
  sentimentScore: Number,       // -100 to 100
  sentimentData: {              // Analysis details
    sentiment: String,
    category: String,
    keywords: Array,
    analysis: String,
    confidence: Number
  },
  karmaAwarded: Boolean,        // Karma status
  karmaPoints: Number,          // Karma awarded
  metadata: {                   // Post metadata
    caption: String,
    likes: Number,
    comments: Number,
    timestamp: Date,
    mediaType: String,
    thumbnailUrl: String
  }
}
```

---

## Best Practices

1. **Rate Limiting**: Don't process too many users simultaneously
2. **Caching**: Use the 24-hour cache to avoid redundant scraping
3. **Error Handling**: Monitor failed analyses and retry
4. **API Costs**: Be aware of RapidAPI/Apify/Gemini usage limits
5. **Public Accounts Only**: Always verify account is public before scraping
6. **Data Privacy**: Follow Instagram's Terms of Service and data usage policies

---

## Troubleshooting

### Issue: "Invalid RapidAPI key"
- Check `.env` file has correct `RAPIDAPI_KEY`
- Verify subscription to Instagram scraper API on RapidAPI

### Issue: "Gemini API validation failed"
- Get API key from https://makersuite.google.com/app/apikey
- Add to `.env` as `GEMINI_API_KEY`
- Ensure Gemini API is enabled in your Google Cloud project

### Issue: "User not found"
- User must be registered first via `/users/register`
- Wallet address must match exactly

### Issue: Slow processing
- Normal for accounts with many posts
- Each post requires 1 second delay for rate limiting
- Consider processing in batches

---

## Testing

Use the provided test script:

```bash
node src/utils/testInstagram.js
```

Or test manually:

```bash
# 1. Register user
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xTEST123",
    "name": "Test User",
    "dateOfBirth": "1990-01-01"
  }'

# 2. Set Instagram username
curl -X PUT http://localhost:3000/instagram/0xTEST123/username \
  -H "Content-Type: application/json" \
  -d '{"instagramUsername": "public_username"}'

# 3. Process Instagram content
curl -X POST http://localhost:3000/instagram/0xTEST123/process
```

---

## Future Enhancements

- [ ] Support for Instagram Stories (if API available)
- [ ] Multi-platform support (Twitter, TikTok, etc.)
- [ ] Advanced sentiment analysis with image recognition
- [ ] Fraud detection for fake engagement
- [ ] Karma decay for old content
- [ ] User dashboard for content analytics
