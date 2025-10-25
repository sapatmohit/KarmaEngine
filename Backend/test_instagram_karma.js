const axios = require('axios');

// Test Instagram scraping and karma calculation
async function testInstagramKarma() {
  try {
    console.log('🔍 Testing Instagram Karma System...\n');
    
    // Test wallet address (you can replace this with an actual user's wallet address)
    const testWalletAddress = 'GCFXHSZV34W6PHKJUR56JNRJ7VZ52WP4J6OPT5AUR5H676FZMLSEPNYA';
    
    // 1. First, let's register a test user with an Instagram username
    console.log('1️⃣ Setting Instagram username for test user...');
    const setUsernameResponse = await axios.put(
      `http://localhost:5000/instagram/${testWalletAddress}/username`,
      {
        instagramUsername: 'natgeo' // Using National Geographic as a test public account
      }
    );
    console.log('   ✅ Instagram username set:', setUsernameResponse.data);
    
    // 2. Now let's scrape the Instagram content
    console.log('\n2️⃣ Scraping Instagram content...');
    const scrapeResponse = await axios.post(
      `http://localhost:5000/instagram/${testWalletAddress}/scrape`
    );
    console.log('   ✅ Scraping complete:', scrapeResponse.data.message);
    console.log('   📊 Results:', {
      totalPosts: scrapeResponse.data.content.totalPosts,
      totalReels: scrapeResponse.data.content.totalReels,
      newContentSaved: scrapeResponse.data.newContentSaved
    });
    
    // 3. Analyze sentiment and award karma
    console.log('\n3️⃣ Analyzing sentiment and awarding karma...');
    const analyzeResponse = await axios.post(
      `http://localhost:5000/instagram/${testWalletAddress}/analyze`,
      {
        analyzeAll: true
      }
    );
    console.log('   ✅ Analysis complete:', analyzeResponse.data.message);
    console.log('   🧠 Results:', {
      analyzed: analyzeResponse.data.analyzed,
      successful: analyzeResponse.data.successful,
      failed: analyzeResponse.data.failed,
      totalKarmaAwarded: analyzeResponse.data.totalKarmaAwarded
    });
    
    // 4. Get user's updated karma points
    console.log('\n4️⃣ Checking user karma balance...');
    const userResponse = await axios.get(
      `http://localhost:5000/users/wallet/${testWalletAddress}`
    );
    console.log('   ✅ User karma updated:', {
      walletAddress: userResponse.data.user.walletAddress,
      karmaPoints: userResponse.data.user.karmaPoints,
      stakedAmount: userResponse.data.user.stakedAmount,
      multiplier: userResponse.data.user.multiplier
    });
    
    // 5. Get user activities
    console.log('\n5️⃣ Checking user activities...');
    const activitiesResponse = await axios.get(
      `http://localhost:5000/activities/${testWalletAddress}`
    );
    console.log('   ✅ Activities found:', activitiesResponse.data.activities.length);
    
    // 6. Get leaderboard
    console.log('\n6️⃣ Checking leaderboard...');
    const leaderboardResponse = await axios.get(
      `http://localhost:5000/karma/leaderboard`
    );
    console.log('   ✅ Leaderboard updated:', leaderboardResponse.data.leaderboard.length, 'users');
    
    console.log('\n🎉 Instagram Karma System Test Complete!');
    console.log('📊 Summary:');
    console.log('   - User karma points:', userResponse.data.user.karmaPoints);
    console.log('   - Activities recorded:', activitiesResponse.data.activities.length);
    console.log('   - Leaderboard position: Check if user is in leaderboard');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testInstagramKarma();