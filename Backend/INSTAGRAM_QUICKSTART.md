# Instagram Karma Integration - Quick Start

## ✨ What You Got

A complete Instagram scraping and sentiment analysis system that:
1. ✅ Scrapes posts and reels from public Instagram accounts
2. ✅ Stores URLs categorized by type (posts/reels) in MongoDB
3. ✅ Performs AI sentiment analysis using Google Gemini
4. ✅ Awards karma points based on content quality
5. ✅ Integrates seamlessly with your existing MERN stack

## 📁 New Files Created

### Models
- `src/models/InstagramContent.js` - Database schema for Instagram content

### Services
- `src/services/instagramScraperService.js` - Instagram scraping logic (RapidAPI/Apify)
- `src/services/sentimentAnalysisService.js` - AI sentiment analysis with Gemini

### Controllers
- `src/controllers/instagramController.js` - Request handlers for Instagram endpoints

### Routes
- `src/routes/instagramRoutes.js` - API route definitions

### Middleware
- `src/middleware/instagramKarmaMiddleware.js` - Reusable middleware for auto-processing

### Documentation
- `INSTAGRAM_INTEGRATION.md` - Complete setup and usage guide
- `src/docs/instagramAPI.md` - Detailed API documentation
- `src/examples/instagramMiddlewareExamples.js` - Usage examples

### Utilities
- `src/utils/testInstagram.js` - Automated test script
- `.env.example` - Updated with required API keys
- `KarmaEngine_Instagram.postman_collection.json` - Postman collection

### Modified Files
- `src/app.js` - Added Instagram routes

## 🚀 Quick Setup (5 Steps)

### 1. Get API Keys

**RapidAPI** (for Instagram scraping):
- Go to https://rapidapi.com/
- Subscribe to "Instagram Scraper API"
- Copy your API key

**Google Gemini** (for sentiment analysis):
- Go to https://makersuite.google.com/app/apikey
- Create an API key
- Copy it

### 2. Configure Environment

Create/update `.env` file:
```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# Instagram Scraping
INSTAGRAM_SCRAPING_METHOD=rapidapi
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=instagram-scraper-api2.p.rapidapi.com

# AI Sentiment Analysis
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
```

### 3. Start Server

```bash
cd Backend
npm start
```

### 4. Test the Integration

Option A - Use test script:
```bash
node src/utils/testInstagram.js
```

Option B - Manual test:
```bash
# Register user
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0xTEST", "name": "Test", "dateOfBirth": "1990-01-01"}'

# Set Instagram username
curl -X PUT http://localhost:3000/instagram/0xTEST/username \
  -H "Content-Type: application/json" \
  -d '{"instagramUsername": "natgeo"}'

# Process everything
curl -X POST http://localhost:3000/instagram/0xTEST/process
```

Option C - Use Postman:
- Import `KarmaEngine_Instagram.postman_collection.json`
- Run requests in order

### 5. Integrate into Your App

Use the middleware in your existing routes:

```javascript
const { processInstagramKarmaAsync } = require('./middleware/instagramKarmaMiddleware');

// Auto-process Instagram on user login
router.post('/login', 
  processInstagramKarmaAsync,  // <-- Add this
  loginController
);
```

## 🎯 Main Endpoint (One-Stop Solution)

```
POST /instagram/:walletAddress/process
```

This single endpoint does everything:
1. Scrapes Instagram posts and reels
2. Saves URLs to MongoDB
3. Fetches post details
4. Analyzes sentiment with Gemini AI
5. Awards karma points
6. Updates user balance

**Response:**
```json
{
  "message": "Instagram karma processing completed",
  "instagramUsername": "johndoe",
  "scraped": {
    "totalPosts": 25,
    "totalReels": 10
  },
  "analyzed": 35,
  "totalKarmaAwarded": 1250,
  "user": {
    "walletAddress": "0x123...",
    "karmaPoints": 2750
  }
}
```

## 📊 How Karma is Calculated

1. **Sentiment Analysis** (-100 to +100)
   - Gemini AI analyzes caption, engagement, context
   - Determines: positive, neutral, or negative

2. **Base Karma** (from sentiment score)
   - Highly positive (80-100): 100 karma
   - Positive (50-79): 75 karma
   - Neutral (20-49): 50 karma
   - Negative: 0 to -50 karma

3. **AI Multiplier** (content quality)
   - Educational/inspirational: 1.8x
   - Entertainment: 1.2x
   - Promotional: 0.8x

4. **Engagement Bonus** (up to 20%)
   - Based on likes + comments
   - Logarithmic scale

5. **User Staking Multiplier**
   - Applied last
   - From your existing staking system

**Example:**
```
Post: "Started a charity drive for homeless!"
Sentiment: +90, Category: Inspirational
Likes: 500, Comments: 100

100 × 1.8 (AI) × 1.15 (engagement) × 0.95 (confidence) × 1.5 (staking)
= 295 karma awarded ✨
```

## 🔗 API Integration Placeholder

In `instagramController.js`, there's a placeholder for your external API:

```javascript
// Line ~280 and ~470
// PLACEHOLDER: External API integration
const externalApiData = await yourExternalAPI.getPostDetails(content.url);
postDetails = { ...postDetails, ...externalApiData };
```

Replace with your API call to fetch additional post details before sentiment analysis.

## 📚 All Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/instagram/:wallet/username` | PUT | Set Instagram username |
| `/instagram/:wallet/scrape` | POST | Scrape content only |
| `/instagram/:wallet/content` | GET | Get stored content |
| `/instagram/:wallet/analyze` | POST | Analyze & award karma |
| `/instagram/:wallet/process` | POST | Complete workflow ⭐ |

## 🛠️ Advanced Usage

### Auto-process on login:
```javascript
router.post('/login', processInstagramKarmaAsync, loginController);
```

### Scheduled daily processing:
```javascript
cron.schedule('0 2 * * *', async () => {
  // Process all users' Instagram
});
```

### Batch processing:
```javascript
POST /batch/instagram-process
{ "walletAddresses": ["0x1", "0x2"] }
```

See `src/examples/instagramMiddlewareExamples.js` for 10+ usage examples.

## 📖 Documentation

- **Main Guide**: `INSTAGRAM_INTEGRATION.md` - Complete setup and usage
- **API Docs**: `src/docs/instagramAPI.md` - Detailed endpoint documentation
- **Examples**: `src/examples/instagramMiddlewareExamples.js` - Code examples
- **Tests**: `src/utils/testInstagram.js` - Automated testing

## 🔒 Important Notes

1. **Public Accounts Only**: System only works with public Instagram profiles
2. **Rate Limiting**: 1-second delay between API calls to avoid limits
3. **Caching**: Content cached for 24 hours to reduce API costs
4. **API Costs**: Monitor RapidAPI and Gemini usage
5. **Privacy**: Follow Instagram's Terms of Service

## 🐛 Troubleshooting

### "Invalid RapidAPI key"
→ Check `.env` has correct `RAPIDAPI_KEY`

### "Gemini API validation failed"
→ Get new key from https://makersuite.google.com/app/apikey

### "Instagram account is private"
→ Only public accounts work

### Slow processing
→ Normal for large accounts (1 sec per post)

## 📞 Support

1. Check documentation files
2. Run test script: `node src/utils/testInstagram.js`
3. Review examples: `src/examples/instagramMiddlewareExamples.js`
4. Check server logs for errors

## 🎉 You're Ready!

Your Instagram karma integration is complete and ready to use. Start with the one-stop endpoint:

```bash
POST /instagram/:walletAddress/process
```

This handles everything automatically! 🚀
