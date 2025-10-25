# Instagram Karma Integration Guide

## 🎯 Overview

This integration allows your Karma Engine to automatically scrape Instagram content from public accounts, analyze the sentiment using AI, and award karma points based on content quality.

## 🔧 Setup

### 1. Install Dependencies

All required dependencies are already in `package.json`:
- `axios` - HTTP requests
- `mongoose` - MongoDB integration
- `express` - Web server

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
# In Backend folder
cp .env.example .env
```

Required variables:
```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# Instagram Scraping (choose one)
INSTAGRAM_SCRAPING_METHOD=rapidapi
RAPIDAPI_KEY=your_key_here
RAPIDAPI_HOST=instagram-scraper-api2.p.rapidapi.com

# AI Sentiment Analysis
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro
```

### 3. Get API Keys

#### A. RapidAPI (for Instagram Scraping)

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up for a free account
3. Subscribe to "Instagram Scraper API" or similar:
   - [Instagram Scraper API 2](https://rapidapi.com/scraperapi-scraperapi-default/api/instagram-scraper-api2)
   - [Instagram Bulk Profile Scraper](https://rapidapi.com/logicbuilder/api/instagram-bulk-profile-scrapper)
4. Copy your API key and host
5. Add to `.env`:
   ```env
   RAPIDAPI_KEY=abc123xyz...
   RAPIDAPI_HOST=instagram-scraper-api2.p.rapidapi.com
   ```

#### B. Google Gemini (for Sentiment Analysis)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Add to `.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

### 4. Start the Server

```bash
cd Backend
npm start
```

Server will run on `http://localhost:3000`

## 📖 Usage

### Quick Start Example

```bash
# 1. Register a user
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x123456",
    "name": "John Doe",
    "dateOfBirth": "1990-01-01"
  }'

# 2. Set Instagram username
curl -X PUT http://localhost:3000/instagram/0x123456/username \
  -H "Content-Type: application/json" \
  -d '{"instagramUsername": "johndoe_public"}'

# 3. Process Instagram content (scrape + analyze + award karma)
curl -X POST http://localhost:3000/instagram/0x123456/process
```

### API Endpoints

#### 1. Set Instagram Username
```
PUT /instagram/:walletAddress/username
Body: { "instagramUsername": "username" }
```

#### 2. Scrape Content Only
```
POST /instagram/:walletAddress/scrape
Query: ?forceRescrape=true (optional)
```

#### 3. Get Stored Content
```
GET /instagram/:walletAddress/content
Query: ?contentType=post&analyzed=false&limit=50
```

#### 4. Analyze Sentiment
```
POST /instagram/:walletAddress/analyze
Body: { "analyzeAll": true } or { "contentIds": ["id1", "id2"] }
```

#### 5. Complete Workflow (Recommended)
```
POST /instagram/:walletAddress/process
```

For detailed API documentation, see [`src/docs/instagramAPI.md`](src/docs/instagramAPI.md)

## 🧪 Testing

Run the automated test script:

```bash
node src/utils/testInstagram.js
```

This will:
1. Register a test user
2. Set Instagram username
3. Scrape content
4. Analyze sentiment
5. Award karma points
6. Display results

## 🔄 How It Works

### Step-by-Step Flow

1. **User Registration**
   - User registers with wallet address
   - Sets their public Instagram username

2. **Content Scraping**
   - System scrapes posts and reels from Instagram
   - Stores URLs categorized by type (post/reel)
   - Saves metadata (likes, comments, captions)

3. **Sentiment Analysis**
   - Fetches detailed post information
   - Sends to Google Gemini for AI analysis
   - Gets sentiment score (-100 to +100)
   - Determines content category

4. **Karma Calculation**
   - Base karma from sentiment score
   - AI-suggested multiplier (content quality)
   - Engagement bonus (likes/comments)
   - User staking multiplier
   - Final karma awarded

5. **Database Updates**
   - Updates user's karma points
   - Creates activity record
   - Marks content as analyzed

### Karma Scoring Example

```
Post: "Just launched my new educational course!"
Likes: 250, Comments: 45

Analysis:
- Sentiment: Positive (85/100)
- Category: Educational
- AI Multiplier: 1.8

Calculation:
Base karma: 100 (highly positive)
× AI multiplier: 1.8 = 180
× Engagement: 1.15 = 207
× Confidence: 0.9 = 186
× User staking: 1.5 = 279 karma

Result: 279 karma points awarded ✅
```

## 🔌 External API Integration

The system includes a placeholder for integrating additional APIs to fetch more post details before sentiment analysis.

**Location:** `src/controllers/instagramController.js`

```javascript
// Line ~280 and ~470
// PLACEHOLDER: External API integration
const externalApiData = await yourExternalAPI.getPostDetails(content.url);

// Example implementation:
const externalApiData = await axios.get(
  'https://your-api.com/instagram/post-details',
  {
    params: { url: content.url },
    headers: { 'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}` }
  }
);

postDetails = { ...postDetails, ...externalApiData.data };
```

## 📊 Database Schema

### InstagramContent Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                    // Links to User
  walletAddress: "0x123...",           // User's wallet
  instagramUsername: "johndoe",        // Instagram handle
  contentType: "post" | "reel",        // Content type
  url: "https://instagram.com/p/...",  // Full URL
  shortcode: "ABC123",                 // Instagram shortcode
  scrapedAt: Date,                     // Scraping timestamp
  sentimentAnalyzed: Boolean,          // Analysis status
  sentimentScore: Number,              // -100 to 100
  sentimentData: {
    sentiment: "positive",
    category: "educational",
    keywords: ["education", "launch"],
    analysis: "Positive content...",
    confidence: 0.9
  },
  karmaAwarded: Boolean,               // Karma status
  karmaPoints: Number,                 // Karma awarded
  metadata: {
    caption: "Post caption...",
    likes: 250,
    comments: 45,
    timestamp: Date,
    mediaType: String,
    thumbnailUrl: String
  }
}
```

## ⚙️ Configuration Options

### Scraping Methods

You can choose different scraping services:

**RapidAPI (Recommended)**
```env
INSTAGRAM_SCRAPING_METHOD=rapidapi
RAPIDAPI_KEY=your_key
RAPIDAPI_HOST=instagram-scraper-api2.p.rapidapi.com
```

**Apify**
```env
INSTAGRAM_SCRAPING_METHOD=apify
APIFY_TOKEN=your_token
```

**Custom Implementation**
```env
INSTAGRAM_SCRAPING_METHOD=custom
```
Then implement `scrapeWithCustomMethod()` in `src/services/instagramScraperService.js`

### Sentiment Analysis

Currently uses Google Gemini. Fallback to keyword-based analysis if API fails.

## 🛡️ Best Practices

### 1. Rate Limiting
- System includes 1-second delay between API calls
- Don't process too many users simultaneously
- Consider implementing queue system for large-scale processing

### 2. Caching
- Content is cached for 24 hours
- Use `forceRescrape=true` only when needed
- Reduces API costs

### 3. Error Handling
- System gracefully handles API failures
- Falls back to keyword-based sentiment if Gemini fails
- Logs errors for debugging

### 4. Privacy & Compliance
- Only public accounts are scraped
- Follows Instagram's robots.txt
- Complies with terms of service
- Users control their Instagram connection

### 5. Cost Management
- Monitor RapidAPI/Apify usage
- Track Gemini API calls
- Set usage limits in .env if needed

## 🐛 Troubleshooting

### Issue: "Invalid RapidAPI key"
**Solution:**
- Check `.env` file
- Verify `RAPIDAPI_KEY` is correct
- Ensure you're subscribed to the API on RapidAPI

### Issue: "Instagram account is private"
**Solution:**
- Only public accounts can be scraped
- Ask user to make account public or use different account

### Issue: "Gemini API validation failed"
**Solution:**
- Get new API key from Google AI Studio
- Check API is enabled in Google Cloud Console
- Verify no billing issues

### Issue: Slow processing
**Solution:**
- Normal for accounts with 100+ posts
- Each item needs 1 second delay
- Consider batch processing
- Process incrementally (new content only)

### Issue: "User not found"
**Solution:**
- Ensure user is registered via `/users/register`
- Wallet address must match exactly
- Case-sensitive

## 📈 Monitoring & Analytics

### Check Processing Status

```bash
# Get content statistics
curl http://localhost:3000/instagram/0x123.../content

# Response shows:
{
  "content": {
    "totalPosts": 50,
    "totalReels": 15,
    "analyzedPosts": 45,  // 5 pending
    "analyzedReels": 12   // 3 pending
  }
}
```

### Monitor Karma Awards

```bash
# Get user activities
curl http://localhost:3000/activities/0x123...

# Filter Instagram activities
curl http://localhost:3000/activities/0x123...?source=instagram
```

## 🚀 Advanced Usage

### Scheduled Processing

Set up a cron job to automatically process Instagram content:

```javascript
// scheduler.js
const cron = require('node-cron');
const axios = require('axios');
const User = require('./models/User');

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Starting scheduled Instagram processing...');
  
  const users = await User.find({ 
    'socialMedia.instagram': { $exists: true, $ne: '' }
  });
  
  for (const user of users) {
    try {
      await axios.post(
        `http://localhost:3000/instagram/${user.walletAddress}/process`
      );
      console.log(`✅ Processed ${user.walletAddress}`);
    } catch (error) {
      console.error(`❌ Error processing ${user.walletAddress}:`, error.message);
    }
    
    // Wait 5 seconds between users
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('Scheduled processing completed');
});
```

### Batch Processing

```javascript
// Process multiple users
async function processBatch(walletAddresses) {
  const results = [];
  
  for (const wallet of walletAddresses) {
    try {
      const response = await axios.post(
        `http://localhost:3000/instagram/${wallet}/process`
      );
      results.push({ wallet, success: true, data: response.data });
    } catch (error) {
      results.push({ wallet, success: false, error: error.message });
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  return results;
}
```

## 📝 License & Credits

This integration is part of the Karma Engine project.

**Third-party Services:**
- RapidAPI - Instagram scraping
- Google Gemini - AI sentiment analysis
- MongoDB - Data storage

**Important:** Always comply with:
- Instagram's Terms of Service
- Third-party API terms
- Data privacy regulations (GDPR, CCPA, etc.)
- Rate limiting policies

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Review `src/docs/instagramAPI.md`
3. Run test script: `node src/utils/testInstagram.js`
4. Check server logs for errors
5. Verify all environment variables are set

## 🔮 Future Enhancements

- [ ] Instagram Stories support
- [ ] Multi-platform integration (Twitter, TikTok)
- [ ] Advanced image sentiment analysis
- [ ] Fraud detection for fake engagement
- [ ] Real-time webhook processing
- [ ] User dashboard for analytics
- [ ] Karma decay for old content
- [ ] Content moderation features
