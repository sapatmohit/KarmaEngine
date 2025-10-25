const instagramScraperService = require('./src/services/instagramScraperService');
const sentimentAnalysisService = require('./src/services/sentimentAnalysisService');

async function testInstagramServices() {
  try {
    console.log('🔍 Testing Instagram Services Directly...\n');
    
    // Test Instagram scraping
    console.log('1️⃣ Testing Instagram scraping...');
    const scrapeResult = await instagramScraperService.scrapeUserContent('natgeo');
    console.log('   ✅ Scraping successful!');
    console.log('   📊 Results:', {
      totalPosts: scrapeResult.totalPosts,
      totalReels: scrapeResult.totalReels
    });
    
    // Show sample post data
    if (scrapeResult.posts.length > 0) {
      console.log('   📷 Sample post:', {
        url: scrapeResult.posts[0].url,
        shortcode: scrapeResult.posts[0].shortcode
      });
      
      // Test fetching post details
      console.log('\n2️⃣ Testing post details fetch...');
      const postDetails = await instagramScraperService.fetchPostDetails(scrapeResult.posts[0].shortcode);
      console.log('   ✅ Post details fetched!');
      console.log('   📝 Details:', {
        caption: postDetails.caption?.substring(0, 50) + '...',
        likes: postDetails.likes,
        comments: postDetails.comments
      });
      
      // Test sentiment analysis
      console.log('\n3️⃣ Testing sentiment analysis...');
      const sentimentResult = await sentimentAnalysisService.analyzeContent({
        caption: postDetails.caption || '',
        likes: postDetails.likes || 0,
        comments: postDetails.comments || 0,
        hashtags: postDetails.hashtags || [],
        mentions: postDetails.mentions || [],
        mediaType: 'post'
      });
      console.log('   ✅ Sentiment analysis complete!');
      console.log('   🧠 Results:', {
        sentiment: sentimentResult.sentiment,
        score: sentimentResult.sentimentScore,
        category: sentimentResult.category,
        karmaPoints: sentimentResult.karmaPoints
      });
    }
    
    console.log('\n🎉 Instagram Services Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testInstagramServices();