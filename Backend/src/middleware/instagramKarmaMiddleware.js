const User = require('../models/User');
const InstagramContent = require('../models/InstagramContent');
const instagramScraperService = require('../services/instagramScraperService');
const sentimentAnalysisService = require('../services/sentimentAnalysisService');
const Activity = require('../models/Activity');

/**
 * Instagram Karma Middleware
 * 
 * This middleware can be used to automatically process Instagram content
 * for users when they perform certain actions in your app.
 * 
 * Usage in routes:
 * router.post('/user/action', instagramKarmaMiddleware, yourController);
 */

/**
 * Process Instagram karma for user in the background
 * This middleware doesn't block the response
 */
const processInstagramKarmaAsync = async (req, res, next) => {
  try {
    const walletAddress = req.params.walletAddress || req.body.walletAddress;
    
    if (!walletAddress) {
      return next(); // Skip if no wallet address
    }

    // Run processing in background (non-blocking)
    setImmediate(async () => {
      try {
        await processUserInstagramKarma(walletAddress);
      } catch (error) {
        console.error('Background Instagram processing error:', error);
      }
    });

    // Continue with the request
    next();
  } catch (error) {
    // Don't block request on error
    console.error('Instagram middleware error:', error);
    next();
  }
};

/**
 * Process Instagram karma for user synchronously
 * This middleware blocks until processing is complete
 */
const processInstagramKarmaSync = async (req, res, next) => {
  try {
    const walletAddress = req.params.walletAddress || req.body.walletAddress;
    
    if (!walletAddress) {
      return next(); // Skip if no wallet address
    }

    // Process Instagram karma
    const result = await processUserInstagramKarma(walletAddress);
    
    // Attach result to request object
    req.instagramKarma = result;
    
    next();
  } catch (error) {
    console.error('Instagram middleware error:', error);
    // Don't fail the request, just continue
    req.instagramKarma = { error: error.message };
    next();
  }
};

/**
 * Core processing function
 * @param {String} walletAddress - User's wallet address
 * @returns {Object} Processing result
 */
async function processUserInstagramKarma(walletAddress) {
  // Find user
  const user = await User.findOne({ walletAddress });
  if (!user) {
    throw new Error('User not found');
  }

  // Check if user has Instagram configured
  const instagramUsername = user.socialMedia?.instagram;
  if (!instagramUsername) {
    return {
      success: false,
      message: 'Instagram not configured',
      karmaAwarded: 0
    };
  }

  // Check if recently processed (within last 24 hours)
  const recentContent = await InstagramContent.findOne({
    userId: user._id,
    scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  if (recentContent) {
    return {
      success: true,
      message: 'Instagram already processed in last 24 hours',
      karmaAwarded: 0,
      cached: true
    };
  }

  let totalKarmaAwarded = 0;
  let itemsProcessed = 0;

  try {
    // Scrape Instagram content
    const scrapedData = await instagramScraperService.scrapeUserContent(instagramUsername);

    // Process new content
    const allContent = [...scrapedData.posts, ...scrapedData.reels];
    
    for (const item of allContent) {
      // Check if already exists and analyzed
      const existing = await InstagramContent.findOne({ 
        shortcode: item.shortcode 
      });

      if (existing && existing.sentimentAnalyzed) {
        continue; // Skip already analyzed content
      }

      // Save or update content
      let content = existing;
      if (!existing) {
        content = new InstagramContent({
          userId: user._id,
          walletAddress: user.walletAddress,
          instagramUsername,
          contentType: item.type === 'reel' ? 'reel' : 'post',
          url: item.url,
          shortcode: item.shortcode,
          metadata: item.metadata
        });
        await content.save();
      }

      // Fetch detailed information
      const postDetails = await instagramScraperService.fetchPostDetails(item.shortcode);

      // Analyze sentiment
      const sentimentResult = await sentimentAnalysisService.analyzeContent({
        caption: postDetails.caption || item.metadata?.caption || '',
        likes: postDetails.likes || item.metadata?.likes || 0,
        comments: postDetails.comments || item.metadata?.comments || 0,
        hashtags: postDetails.hashtags || [],
        mentions: postDetails.mentions || [],
        mediaType: content.contentType,
        shortcode: item.shortcode
      });

      // Update content
      content.sentimentAnalyzed = true;
      content.sentimentScore = sentimentResult.sentimentScore;
      content.sentimentData = {
        sentiment: sentimentResult.sentiment,
        category: sentimentResult.category,
        keywords: sentimentResult.keywords,
        analysis: sentimentResult.analysis
      };
      content.karmaPoints = sentimentResult.karmaPoints;
      content.karmaAwarded = true;
      await content.save();

      // Award karma
      const finalKarma = sentimentResult.karmaPoints * user.multiplier;
      user.karmaPoints += finalKarma;
      totalKarmaAwarded += finalKarma;
      itemsProcessed++;

      // Create activity
      const activity = new Activity({
        userId: user._id,
        walletAddress: user.walletAddress,
        type: 'post',
        value: sentimentResult.karmaPoints,
        multiplier: user.multiplier,
        finalKarma,
        metadata: {
          source: 'instagram',
          contentType: content.contentType,
          url: content.url,
          sentiment: sentimentResult.sentiment
        }
      });
      await activity.save();

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Limit processing to prevent timeout (max 10 items per run)
      if (itemsProcessed >= 10) {
        break;
      }
    }

    // Update user
    user.lastActivity = Date.now();
    await user.save();

    return {
      success: true,
      message: 'Instagram karma processed',
      itemsProcessed,
      totalKarmaAwarded,
      userKarmaBalance: user.karmaPoints
    };

  } catch (error) {
    console.error('Instagram processing error:', error);
    return {
      success: false,
      message: error.message,
      karmaAwarded: totalKarmaAwarded,
      itemsProcessed
    };
  }
}

/**
 * Check if user needs Instagram karma processing
 * Useful for conditional middleware
 */
const shouldProcessInstagramKarma = async (req, res, next) => {
  try {
    const walletAddress = req.params.walletAddress || req.body.walletAddress;
    
    if (!walletAddress) {
      req.needsInstagramProcessing = false;
      return next();
    }

    const user = await User.findOne({ walletAddress });
    if (!user || !user.socialMedia?.instagram) {
      req.needsInstagramProcessing = false;
      return next();
    }

    // Check last processing time
    const recentContent = await InstagramContent.findOne({
      userId: user._id,
      scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    req.needsInstagramProcessing = !recentContent;
    next();
  } catch (error) {
    req.needsInstagramProcessing = false;
    next();
  }
};

/**
 * Conditional Instagram processing
 * Only processes if needed (not processed in last 24 hours)
 */
const processInstagramKarmaIfNeeded = async (req, res, next) => {
  try {
    await shouldProcessInstagramKarma(req, res, () => {});
    
    if (req.needsInstagramProcessing) {
      return processInstagramKarmaAsync(req, res, next);
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  processInstagramKarmaAsync,
  processInstagramKarmaSync,
  processInstagramKarmaIfNeeded,
  shouldProcessInstagramKarma,
  processUserInstagramKarma
};
