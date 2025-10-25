const axios = require('axios');

/**
 * Test script for Instagram integration
 * Run this to test the complete Instagram karma flow
 * 
 * Usage: node src/utils/testInstagram.js
 */

const BASE_URL = 'http://localhost:3000';
const TEST_WALLET = '0xTEST_INSTAGRAM_' + Date.now();
const TEST_INSTAGRAM_USERNAME = 'natgeo'; // Use a known public account for testing

async function testInstagramIntegration() {
  console.log('🚀 Starting Instagram Integration Tests\n');
  console.log(`Test Wallet: ${TEST_WALLET}`);
  console.log(`Instagram Username: ${TEST_INSTAGRAM_USERNAME}\n`);

  try {
    // Step 1: Register user
    console.log('📝 Step 1: Registering user...');
    const registerResponse = await axios.post(`${BASE_URL}/users/register`, {
      walletAddress: TEST_WALLET,
      name: 'Test Instagram User',
      dateOfBirth: '1990-01-01'
    });
    console.log('✅ User registered:', registerResponse.data);
    console.log('');

    // Step 2: Set Instagram username
    console.log('📸 Step 2: Setting Instagram username...');
    const usernameResponse = await axios.put(
      `${BASE_URL}/instagram/${TEST_WALLET}/username`,
      { instagramUsername: TEST_INSTAGRAM_USERNAME }
    );
    console.log('✅ Instagram username set:', usernameResponse.data);
    console.log('');

    // Step 3: Scrape Instagram content
    console.log('🔍 Step 3: Scraping Instagram content...');
    console.log('(This may take a minute...)');
    const scrapeResponse = await axios.post(
      `${BASE_URL}/instagram/${TEST_WALLET}/scrape`
    );
    console.log('✅ Content scraped:');
    console.log(`   - Posts: ${scrapeResponse.data.content.totalPosts}`);
    console.log(`   - Reels: ${scrapeResponse.data.content.totalReels}`);
    console.log('');

    // Step 4: Get stored content
    console.log('📦 Step 4: Retrieving stored content...');
    const contentResponse = await axios.get(
      `${BASE_URL}/instagram/${TEST_WALLET}/content?limit=5`
    );
    console.log('✅ Retrieved content:');
    console.log(`   - Total posts: ${contentResponse.data.content.totalPosts}`);
    console.log(`   - Total reels: ${contentResponse.data.content.totalReels}`);
    console.log('');

    // Step 5: Analyze sentiment (limit to 3 items for testing)
    console.log('🧠 Step 5: Analyzing sentiment (3 items)...');
    console.log('(This may take a few seconds per item...)');
    
    const allContent = [
      ...contentResponse.data.content.posts,
      ...contentResponse.data.content.reels
    ];
    const contentToAnalyze = allContent.slice(0, 3).map(c => c._id);

    const analyzeResponse = await axios.post(
      `${BASE_URL}/instagram/${TEST_WALLET}/analyze`,
      { contentIds: contentToAnalyze }
    );
    console.log('✅ Sentiment analysis completed:');
    console.log(`   - Items analyzed: ${analyzeResponse.data.analyzed}`);
    console.log(`   - Total karma awarded: ${analyzeResponse.data.totalKarmaAwarded}`);
    console.log(`   - User karma balance: ${analyzeResponse.data.user.karmaPoints}`);
    console.log('\n   Results:');
    analyzeResponse.data.results.forEach((result, i) => {
      console.log(`   ${i + 1}. ${result.contentType}: ${result.sentiment} (${result.sentimentScore})`);
      console.log(`      Karma awarded: ${result.karmaAwarded}`);
      console.log(`      URL: ${result.url}`);
    });
    console.log('');

    // Step 6: Complete workflow test (for new user)
    console.log('🎯 Step 6: Testing complete workflow...');
    console.log('(Creating new test user for full workflow)');
    
    const TEST_WALLET_2 = '0xTEST_WORKFLOW_' + Date.now();
    
    // Register new user
    await axios.post(`${BASE_URL}/users/register`, {
      walletAddress: TEST_WALLET_2,
      name: 'Test Workflow User',
      dateOfBirth: '1990-01-01'
    });

    // Set Instagram username
    await axios.put(
      `${BASE_URL}/instagram/${TEST_WALLET_2}/username`,
      { instagramUsername: TEST_INSTAGRAM_USERNAME }
    );

    // Process everything in one call
    console.log('Processing Instagram karma (scrape + analyze + award)...');
    const processResponse = await axios.post(
      `${BASE_URL}/instagram/${TEST_WALLET_2}/process`
    );
    
    console.log('✅ Complete workflow finished:');
    console.log(`   - Posts scraped: ${processResponse.data.scraped.totalPosts}`);
    console.log(`   - Reels scraped: ${processResponse.data.scraped.totalReels}`);
    console.log(`   - Items analyzed: ${processResponse.data.analyzed}`);
    console.log(`   - Total karma awarded: ${processResponse.data.totalKarmaAwarded}`);
    console.log(`   - Final karma balance: ${processResponse.data.user.karmaPoints}`);
    console.log('');

    console.log('✨ All tests completed successfully!\n');
    console.log('Test Summary:');
    console.log('-------------');
    console.log('✅ User registration');
    console.log('✅ Instagram username setup');
    console.log('✅ Content scraping');
    console.log('✅ Content retrieval');
    console.log('✅ Sentiment analysis');
    console.log('✅ Karma awarding');
    console.log('✅ Complete workflow');
    console.log('');

  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Make sure the backend server is running (npm start)');
    console.error('2. Check your .env file has all required API keys:');
    console.error('   - RAPIDAPI_KEY or APIFY_TOKEN');
    console.error('   - GEMINI_API_KEY');
    console.error('3. Verify MongoDB connection is working');
    console.error('4. Check that the test Instagram account is public');
    process.exit(1);
  }
}

// Run tests
testInstagramIntegration();
