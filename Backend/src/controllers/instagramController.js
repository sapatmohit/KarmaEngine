const User = require('../models/User');
const InstagramContent = require('../models/InstagramContent');
const Activity = require('../models/Activity');
const instagramScraperService = require('../services/instagramScraperService');
const sentimentAnalysisService = require('../services/sentimentAnalysisService');

/**
 * Scrape Instagram content for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const scrapeUserInstagram = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { forceRescrape = false } = req.query;

    console.log(`\n📸 Instagram Scrape Request for wallet: ${walletAddress}`);

    // Find user in database
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has Instagram username configured
    const instagramUsername = user.socialMedia?.instagram;
    if (!instagramUsername) {
      return res.status(400).json({ 
        message: 'Instagram username not configured for this user',
        hint: 'Update user profile with Instagram username first using PUT /instagram/:walletAddress/username'
      });
    }

    console.log(`🔍 Target Instagram: @${instagramUsername}`);

    // Validate Instagram username
    const validation = await instagramScraperService.validateUsername(instagramUsername);
    if (!validation.exists) {
      return res.status(404).json({ message: 'Instagram account not found' });
    }
    if (validation.isPrivate) {
      return res.status(403).json({ message: 'Instagram account is private. Only public accounts can be scraped.' });
    }

    // Check if content was recently scraped (within last 24 hours)
    if (!forceRescrape) {
      const recentScrape = await InstagramContent.findOne({
        userId: user._id,
        scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      if (recentScrape) {
        console.log('📦 Using cached content (scraped within last 24 hours)');
        const existingContent = await InstagramContent.find({ userId: user._id })
          .sort({ scrapedAt: -1 });

        return res.json({
          message: 'Using cached Instagram content (scraped within last 24 hours)',
          cached: true,
          content: {
            posts: existingContent.filter(c => c.contentType === 'post'),
            reels: existingContent.filter(c => c.contentType === 'reel'),
            totalPosts: existingContent.filter(c => c.contentType === 'post').length,
            totalReels: existingContent.filter(c => c.contentType === 'reel').length
          },
          lastScraped: recentScrape.scrapedAt
        });
      }
    }

    // Scrape Instagram content
    const scrapedData = await instagramScraperService.scrapeUserContent(instagramUsername);

    // Save to database
    const savedContent = [];

    console.log('💾 Saving content to database...');
    // Save posts
    for (const post of scrapedData.posts) {
      const existingContent = await InstagramContent.findOne({ shortcode: post.shortcode });
      
      if (!existingContent) {
        const content = new InstagramContent({
          userId: user._id,
          walletAddress: user.walletAddress,
          instagramUsername,
          contentType: 'post',
          url: post.url,
          shortcode: post.shortcode,
          metadata: post.metadata
        });
        await content.save();
        savedContent.push(content);
      }
    }

    // Save reels
    for (const reel of scrapedData.reels) {
      const existingContent = await InstagramContent.findOne({ shortcode: reel.shortcode });
      
      if (!existingContent) {
        const content = new InstagramContent({
          userId: user._id,
          walletAddress: user.walletAddress,
          instagramUsername,
          contentType: 'reel',
          url: reel.url,
          shortcode: reel.shortcode,
          metadata: reel.metadata
        });
        await content.save();
        savedContent.push(content);
      }
    }

    console.log(`✅ Scraping complete! Saved ${savedContent.length} new items\n`);

    res.status(201).json({
      message: 'Instagram content scraped successfully',
      instagramUsername,
      content: {
        posts: scrapedData.posts,
        reels: scrapedData.reels,
        totalPosts: scrapedData.totalPosts,
        totalReels: scrapedData.totalReels
      },
      newContentSaved: savedContent.length,
      scrapedAt: scrapedData.scrapedAt
    });

  } catch (error) {
    console.error('❌ Instagram scraping error:', error.message);
    res.status(500).json({ 
      message: 'Error scraping Instagram content',
      error: error.message 
    });
  }
};

/**
 * Get stored Instagram content for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserInstagramContent = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { contentType, analyzed, limit = 50 } = req.query;

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build query
    const query = { userId: user._id };
    if (contentType) {
      query.contentType = contentType;
    }
    if (analyzed !== undefined) {
      query.sentimentAnalyzed = analyzed === 'true';
    }

    // Get content
    const content = await InstagramContent.find(query)
      .sort({ scrapedAt: -1 })
      .limit(parseInt(limit));

    // Categorize by type
    const posts = content.filter(c => c.contentType === 'post');
    const reels = content.filter(c => c.contentType === 'reel');

    res.json({
      content: {
        posts,
        reels,
        totalPosts: posts.length,
        totalReels: reels.length,
        analyzedPosts: posts.filter(p => p.sentimentAnalyzed).length,
        analyzedReels: reels.filter(r => r.sentimentAnalyzed).length
      }
    });

  } catch (error) {
    console.error('Get Instagram content error:', error);
    res.status(500).json({ 
      message: 'Error fetching Instagram content',
      error: error.message 
    });
  }
};

/**
 * Analyze sentiment for scraped content and award karma
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const analyzeSentimentAndAwardKarma = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { contentIds, analyzeAll = false } = req.body;

    console.log(`\n🧠 Sentiment Analysis Request for wallet: ${walletAddress}`);

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get content to analyze
    let contentToAnalyze;
    
    if (analyzeAll) {
      contentToAnalyze = await InstagramContent.find({
        userId: user._id,
        sentimentAnalyzed: false
      });
      console.log(`📄 Analyzing all unanalyzed content (${contentToAnalyze.length} items)`);
    } else if (contentIds && contentIds.length > 0) {
      contentToAnalyze = await InstagramContent.find({
        _id: { $in: contentIds },
        userId: user._id,
        sentimentAnalyzed: false
      });
      console.log(`📄 Analyzing ${contentToAnalyze.length} specific items`);
    } else {
      return res.status(400).json({ 
        message: 'Please provide contentIds or set analyzeAll=true' 
      });
    }

    if (contentToAnalyze.length === 0) {
      return res.json({ 
        message: 'No unanalyzed content found',
        analyzed: 0
      });
    }

    const analysisResults = [];
    let totalKarmaAwarded = 0;
    let successCount = 0;
    let errorCount = 0;

    console.log(`🚀 Processing ${contentToAnalyze.length} items...\n`);

    // Process each content
    for (let i = 0; i < contentToAnalyze.length; i++) {
      const content = contentToAnalyze[i];
      console.log(`  [${i + 1}/${contentToAnalyze.length}] Processing ${content.contentType}: ${content.shortcode}`);
      
      try {
        // Fetch detailed post information if needed
        let postDetails = content.metadata;
        
        if (!postDetails.caption) {
          postDetails = await instagramScraperService.fetchPostDetails(content.shortcode);
        }

        // PLACEHOLDER: This is where you integrate with your external API
        // for fetching additional post details before sending to Gemini
        // Example:
        // const externalApiData = await yourExternalAPI.getPostDetails(content.url);
        // postDetails = { ...postDetails, ...externalApiData };

        // Analyze sentiment
        const sentimentResult = await sentimentAnalysisService.analyzeContent({
          caption: postDetails.caption || '',
          likes: postDetails.likes || 0,
          comments: postDetails.comments || 0,
          hashtags: postDetails.hashtags || [],
          mentions: postDetails.mentions || [],
          mediaType: content.contentType,
          shortcode: content.shortcode
        });

        // Update content with sentiment data
        content.sentimentAnalyzed = true;
        content.sentimentScore = sentimentResult.sentimentScore;
        content.sentimentData = {
          sentiment: sentimentResult.sentiment,
          category: sentimentResult.category,
          keywords: sentimentResult.keywords,
          analysis: sentimentResult.analysis,
          confidence: sentimentResult.confidence
        };
        content.karmaPoints = sentimentResult.karmaPoints;
        content.karmaAwarded = true;
        await content.save();

        // Award karma to user
        const finalKarma = sentimentResult.karmaPoints * user.multiplier;
        user.karmaPoints += finalKarma;
        totalKarmaAwarded += finalKarma;

        // Create activity record
        const activity = new Activity({
          userId: user._id,
          walletAddress: user.walletAddress,
          type: 'post', // Instagram content
          value: sentimentResult.karmaPoints,
          multiplier: user.multiplier,
          finalKarma,
          metadata: {
            source: 'instagram',
            contentType: content.contentType,
            url: content.url,
            sentimentScore: sentimentResult.sentimentScore,
            sentiment: sentimentResult.sentiment
          }
        });
        await activity.save();

        analysisResults.push({
          contentId: content._id,
          url: content.url,
          contentType: content.contentType,
          sentiment: sentimentResult.sentiment,
          sentimentScore: sentimentResult.sentimentScore,
          karmaAwarded: finalKarma,
          success: true
        });
        
        successCount++;

        // Rate limiting: wait 1 second between analyses
        if (i < contentToAnalyze.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
        errorCount++;
        analysisResults.push({
          contentId: content._id,
          url: content.url,
          error: error.message,
          success: false
        });
      }
    }

    // Update user
    user.lastActivity = Date.now();
    await user.save();

    console.log(`\n✅ Analysis complete! Success: ${successCount}, Errors: ${errorCount}`);
    console.log(`🎉 Total karma awarded: ${totalKarmaAwarded.toFixed(0)}\n`);

    res.json({
      message: 'Sentiment analysis completed',
      analyzed: analysisResults.length,
      successful: successCount,
      failed: errorCount,
      totalKarmaAwarded: Math.round(totalKarmaAwarded),
      results: analysisResults,
      user: {
        walletAddress: user.walletAddress,
        karmaPoints: user.karmaPoints
      }
    });

  } catch (error) {
    console.error('❌ Sentiment analysis error:', error);
    res.status(500).json({ 
      message: 'Error during sentiment analysis',
      error: error.message 
    });
  }
};

/**
 * Complete workflow: Scrape, analyze, and award karma
 * This is the main middleware function that does everything
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const processInstagramKarma = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    console.log(`\n🚀 Instagram Karma Full Process for wallet: ${walletAddress}`);

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check Instagram username
    const instagramUsername = user.socialMedia?.instagram;
    if (!instagramUsername) {
      return res.status(400).json({ 
        message: 'Instagram username not configured for this user',
        hint: 'Use PUT /instagram/:walletAddress/username to set Instagram username first'
      });
    }

    // Step 1: Scrape content
    console.log(`\n🔍 Step 1/3: Scraping Instagram content for @${instagramUsername}...`);
    const scrapedData = await instagramScraperService.scrapeUserContent(instagramUsername);

    // Step 2: Save to database
    console.log(`\n💾 Step 2/3: Saving content to database...`);
    const newContent = [];
    
    for (const item of [...scrapedData.posts, ...scrapedData.reels]) {
      const existing = await InstagramContent.findOne({ shortcode: item.shortcode });
      
      if (!existing || !existing.sentimentAnalyzed) {
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
        
        newContent.push(content);
      }
    }

    console.log(`  ✅ Saved ${newContent.length} items for analysis`);

    // Step 3: Analyze sentiment for new/unanalyzed content
    console.log(`\n🧠 Step 3/3: Analyzing sentiment for ${newContent.length} items...`);
    const analysisResults = [];
    let totalKarmaAwarded = 0;

    for (let i = 0; i < newContent.length; i++) {
      const content = newContent[i];
      console.log(`  [${i + 1}/${newContent.length}] ${content.contentType}: ${content.shortcode}`);
      
      try {
        // Fetch detailed information
        const postDetails = await instagramScraperService.fetchPostDetails(content.shortcode);

        // PLACEHOLDER: External API integration point
        // const externalData = await yourExternalAPI.getDetails(content.url);

        // Analyze sentiment
        const sentimentResult = await sentimentAnalysisService.analyzeContent({
          caption: postDetails.caption || content.metadata.caption || '',
          likes: postDetails.likes || content.metadata.likes || 0,
          comments: postDetails.comments || content.metadata.comments || 0,
          hashtags: postDetails.hashtags || [],
          mentions: postDetails.mentions || [],
          mediaType: content.contentType,
          shortcode: content.shortcode
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
            sentiment: sentimentResult.sentiment,
            category: sentimentResult.category
          }
        });
        await activity.save();

        analysisResults.push({
          url: content.url,
          contentType: content.contentType,
          sentiment: sentimentResult.sentiment,
          sentimentScore: sentimentResult.sentimentScore,
          category: sentimentResult.category,
          karmaAwarded: finalKarma
        });

        // Rate limiting
        if (i < newContent.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
        analysisResults.push({
          url: content.url,
          error: error.message
        });
      }
    }

    // Step 4: Update user
    user.lastActivity = Date.now();
    await user.save();

    console.log(`\n✅ 🎉 Process Complete!`);
    console.log(`   Scraped: ${scrapedData.totalPosts} posts, ${scrapedData.totalReels} reels`);
    console.log(`   Analyzed: ${analysisResults.length} items`);
    console.log(`   Total karma awarded: ${totalKarmaAwarded.toFixed(0)}`);
    console.log(`   New karma balance: ${user.karmaPoints.toFixed(0)}\n`);

    res.json({
      message: 'Instagram karma processing completed successfully',
      instagramUsername,
      scraped: {
        totalPosts: scrapedData.totalPosts,
        totalReels: scrapedData.totalReels
      },
      analyzed: analysisResults.length,
      totalKarmaAwarded: Math.round(totalKarmaAwarded),
      results: analysisResults,
      user: {
        walletAddress: user.walletAddress,
        karmaPoints: user.karmaPoints,
        multiplier: user.multiplier
      }
    });

  } catch (error) {
    console.error('\n❌ Instagram karma processing error:', error.message);
    res.status(500).json({ 
      message: 'Error processing Instagram karma',
      error: error.message 
    });
  }
};

/**
 * Update user's Instagram username
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateInstagramUsername = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { instagramUsername } = req.body;

    if (!instagramUsername) {
      return res.status(400).json({ message: 'Instagram username is required' });
    }

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate Instagram username
    const validation = await instagramScraperService.validateUsername(instagramUsername);
    if (!validation.exists) {
      return res.status(404).json({ message: 'Instagram account not found' });
    }
    if (validation.isPrivate) {
      return res.status(403).json({ message: 'Instagram account is private. Please use a public account.' });
    }

    // Update user
    user.socialMedia = user.socialMedia || {};
    user.socialMedia.instagram = validation.username;
    await user.save();

    res.json({
      message: 'Instagram username updated successfully',
      instagramUsername: validation.username
    });

  } catch (error) {
    console.error('Update Instagram username error:', error);
    res.status(500).json({ 
      message: 'Error updating Instagram username',
      error: error.message 
    });
  }
};

module.exports = {
  scrapeUserInstagram,
  getUserInstagramContent,
  analyzeSentimentAndAwardKarma,
  processInstagramKarma,
  updateInstagramUsername
};
