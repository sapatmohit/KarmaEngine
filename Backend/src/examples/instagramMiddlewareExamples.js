/**
 * EXAMPLE USAGE: Instagram Karma Middleware Integration
 * 
 * This file shows how to use the Instagram karma middleware
 * in your existing routes to automatically process Instagram content
 */

const express = require('express');
const router = express.Router();
const { 
  processInstagramKarmaAsync,
  processInstagramKarmaSync,
  processInstagramKarmaIfNeeded 
} = require('../middleware/instagramKarmaMiddleware');

// ============================================================================
// EXAMPLE 1: Async Processing (Non-blocking)
// ============================================================================
// Use this when you want Instagram processing to happen in the background
// without affecting response time

/**
 * When user logs in, trigger Instagram karma processing in background
 */
router.post('/login', 
  processInstagramKarmaAsync,  // <-- Middleware processes Instagram in background
  async (req, res) => {
    // Your login logic here
    res.json({ message: 'Login successful' });
    // Instagram processing happens after response is sent
  }
);

// ============================================================================
// EXAMPLE 2: Sync Processing (Blocking)
// ============================================================================
// Use this when you want to include Instagram karma results in the response

/**
 * Get user profile with fresh Instagram karma calculation
 */
router.get('/profile/:walletAddress', 
  processInstagramKarmaSync,  // <-- Waits for processing to complete
  async (req, res) => {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    
    res.json({
      user,
      instagramProcessing: req.instagramKarma  // <-- Results attached to request
    });
  }
);

// ============================================================================
// EXAMPLE 3: Conditional Processing
// ============================================================================
// Use this to only process if not done recently (within 24 hours)

/**
 * Update user activity and process Instagram if needed
 */
router.post('/user/:walletAddress/activity', 
  processInstagramKarmaIfNeeded,  // <-- Only processes if needed
  async (req, res) => {
    // Your activity logic here
    res.json({ message: 'Activity recorded' });
  }
);

// ============================================================================
// EXAMPLE 4: Direct API Endpoints (Without Middleware)
// ============================================================================

/**
 * Manual Instagram processing endpoint
 */
router.post('/instagram/:walletAddress/process', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Import the controller
    const { processInstagramKarma } = require('../controllers/instagramController');
    
    // Call controller directly
    await processInstagramKarma(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// EXAMPLE 5: Scheduled Processing
// ============================================================================

/**
 * Set up a cron job to process all users' Instagram content daily
 */
const cron = require('node-cron');
const { processUserInstagramKarma } = require('../middleware/instagramKarmaMiddleware');
const User = require('../models/User');

// Run every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Starting scheduled Instagram karma processing...');
  
  try {
    // Get all users with Instagram configured
    const users = await User.find({ 
      'socialMedia.instagram': { $exists: true, $ne: '' }
    });
    
    console.log(`Processing ${users.length} users...`);
    
    for (const user of users) {
      try {
        const result = await processUserInstagramKarma(user.walletAddress);
        console.log(`✅ ${user.walletAddress}: ${result.message}, Karma: +${result.totalKarmaAwarded}`);
      } catch (error) {
        console.error(`❌ ${user.walletAddress}: ${error.message}`);
      }
      
      // Wait 5 seconds between users to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log('Scheduled Instagram processing completed');
  } catch (error) {
    console.error('Scheduled processing error:', error);
  }
});

// ============================================================================
// EXAMPLE 6: Webhook Integration
// ============================================================================

/**
 * If you have a webhook from an external service notifying you
 * when a user posts new content, you can trigger processing
 */
router.post('/webhook/instagram-update', async (req, res) => {
  try {
    const { username, postUrl } = req.body;
    
    // Find user by Instagram username
    const user = await User.findOne({ 'socialMedia.instagram': username });
    
    if (user) {
      // Trigger Instagram processing
      const { processUserInstagramKarma } = require('../middleware/instagramKarmaMiddleware');
      const result = await processUserInstagramKarma(user.walletAddress);
      
      res.json({ 
        message: 'Instagram content processed',
        result 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// EXAMPLE 7: Batch Processing Endpoint
// ============================================================================

/**
 * Process Instagram karma for multiple users
 */
router.post('/batch/instagram-process', async (req, res) => {
  try {
    const { walletAddresses } = req.body;
    
    if (!Array.isArray(walletAddresses)) {
      return res.status(400).json({ error: 'walletAddresses must be an array' });
    }
    
    const results = [];
    const { processUserInstagramKarma } = require('../middleware/instagramKarmaMiddleware');
    
    for (const walletAddress of walletAddresses) {
      try {
        const result = await processUserInstagramKarma(walletAddress);
        results.push({ walletAddress, ...result });
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        results.push({ 
          walletAddress, 
          success: false, 
          message: error.message 
        });
      }
    }
    
    res.json({
      message: 'Batch processing completed',
      results,
      totalProcessed: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// EXAMPLE 8: User Dashboard Integration
// ============================================================================

/**
 * Get user dashboard with Instagram stats
 */
router.get('/dashboard/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const user = await User.findOne({ walletAddress });
    const InstagramContent = require('../models/InstagramContent');
    
    // Get Instagram statistics
    const instagramStats = await InstagramContent.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$contentType',
          count: { $sum: 1 },
          totalKarma: { $sum: '$karmaPoints' },
          avgSentiment: { $avg: '$sentimentScore' }
        }
      }
    ]);
    
    res.json({
      user: {
        walletAddress: user.walletAddress,
        karmaPoints: user.karmaPoints,
        instagramUsername: user.socialMedia?.instagram
      },
      instagramStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// EXAMPLE 9: Real-time Processing with Socket.io
// ============================================================================

/**
 * If using Socket.io, you can emit progress updates
 */
const { Server } = require('socket.io');
const io = new Server(server);

router.post('/instagram/:walletAddress/process-realtime', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Start processing
    res.json({ message: 'Processing started', trackingId: walletAddress });
    
    // Emit progress updates via socket
    io.to(walletAddress).emit('instagram-processing-started', {
      message: 'Scraping Instagram content...'
    });
    
    const { processUserInstagramKarma } = require('../middleware/instagramKarmaMiddleware');
    const result = await processUserInstagramKarma(walletAddress);
    
    io.to(walletAddress).emit('instagram-processing-completed', result);
  } catch (error) {
    io.to(req.params.walletAddress).emit('instagram-processing-error', {
      error: error.message
    });
  }
});

// ============================================================================
// EXAMPLE 10: Testing Endpoint
// ============================================================================

/**
 * Test endpoint to verify Instagram integration
 */
router.get('/test/instagram/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const InstagramContent = require('../models/InstagramContent');
    
    // Get content stats
    const contentCount = await InstagramContent.countDocuments({ userId: user._id });
    const analyzedCount = await InstagramContent.countDocuments({ 
      userId: user._id, 
      sentimentAnalyzed: true 
    });
    
    // Get last scrape time
    const lastScrape = await InstagramContent.findOne({ userId: user._id })
      .sort({ scrapedAt: -1 });
    
    res.json({
      instagramConfigured: !!user.socialMedia?.instagram,
      instagramUsername: user.socialMedia?.instagram,
      contentScraped: contentCount,
      contentAnalyzed: analyzedCount,
      lastScrapeTime: lastScrape?.scrapedAt,
      needsProcessing: !lastScrape || 
        (Date.now() - lastScrape.scrapedAt.getTime() > 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
