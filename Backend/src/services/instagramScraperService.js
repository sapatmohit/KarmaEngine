const axios = require('axios');

/**
 * Instagram Scraping Service
 * This service handles scraping Instagram content from public profiles
 * 
 * IMPORTANT: This is a template implementation. For production use:
 * 1. Use official Instagram Graph API if possible
 * 2. Use third-party services like Apify, RapidAPI Instagram scrapers
 * 3. Implement proper rate limiting and error handling
 * 4. Consider using puppeteer/playwright for browser automation
 */

class InstagramScraperService {
  constructor() {
    // RapidAPI is the default and recommended method
    this.scrapingMethod = process.env.INSTAGRAM_SCRAPING_METHOD || 'rapidapi';
    this.rapidApiKey = process.env.RAPIDAPI_KEY || '';
    this.rapidApiHost = process.env.RAPIDAPI_HOST || 'instagram-scraper-api2.p.rapidapi.com';
    
    // Validate configuration on initialization
    if (!this.rapidApiKey && this.scrapingMethod === 'rapidapi') {
      console.warn('⚠️  RAPIDAPI_KEY not configured. Instagram scraping will not work.');
      console.warn('   Get your key from: https://rapidapi.com/');
    }
  }

  /**
   * Scrape user's posts and reels using RapidAPI
   * @param {String} username - Instagram username
   * @returns {Object} - Categorized content URLs
   */
  async scrapeUserContent(username) {
    try {
      console.log(`🔍 Starting to scrape content for Instagram user: @${username}`);

      // Validate API key first
      if (!this.rapidApiKey) {
        throw new Error('RAPIDAPI_KEY not configured in .env file. Get your key from https://rapidapi.com/');
      }

      // Default to RapidAPI (recommended)
      if (this.scrapingMethod === 'rapidapi') {
        return await this.scrapeWithRapidAPI(username);
      }

      // Alternative: Apify
      if (this.scrapingMethod === 'apify') {
        return await this.scrapeWithApify(username);
      }

      // Custom implementation
      return await this.scrapeWithCustomMethod(username);

    } catch (error) {
      console.error('❌ Instagram scraping error:', error.message);
      throw new Error(`Failed to scrape Instagram content: ${error.message}`);
    }
  }

  /**
   * Scrape using RapidAPI Instagram Scraper
   * Example API: https://rapidapi.com/scraperapi-scraperapi-default/api/instagram-scraper-api2
   */
  async scrapeWithRapidAPI(username) {
    try {
      console.log(`📡 Using RapidAPI to scrape @${username}...`);
      const posts = [];
      const reels = [];

      // Step 1: Get user information
      console.log('  Step 1/2: Fetching user profile...');
      const userInfoResponse = await axios.get(
        `https://${this.rapidApiHost}/v1/info`,
        {
          params: { username_or_id_or_url: username },
          headers: {
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': this.rapidApiHost
          },
          timeout: 30000 // 30 second timeout
        }
      );

      const userId = userInfoResponse.data?.data?.id;
      const isPrivate = userInfoResponse.data?.data?.is_private;
      
      if (!userId) {
        throw new Error('User not found. Please check the username.');
      }
      
      if (isPrivate) {
        throw new Error('This Instagram account is private. Only public accounts can be scraped.');
      }

      console.log(`  ✅ User found: @${username} (ID: ${userId})`);

      // Step 2: Get user's posts and reels
      console.log('  Step 2/2: Fetching posts and reels...');
      const postsResponse = await axios.get(
        `https://${this.rapidApiHost}/v1/posts`,
        {
          params: { 
            username_or_id_or_url: username,
            count: 50 // Get up to 50 recent posts
          },
          headers: {
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': this.rapidApiHost
          },
          timeout: 30000
        }
      );

      // Process posts and categorize
      if (postsResponse.data?.data?.items) {
        const items = postsResponse.data.data.items;
        console.log(`  📦 Processing ${items.length} items...`);
        
        items.forEach(item => {
          // Determine content type
          const isReel = item.product_type === 'clips' || 
                        item.product_type === 'igtv' ||
                        (item.media_type === 2 && item.video_duration > 0);
          
          const content = {
            url: `https://www.instagram.com/p/${item.code}/`,
            shortcode: item.code,
            type: isReel ? 'reel' : 'post',
            metadata: {
              caption: item.caption?.text || '',
              likes: item.like_count || 0,
              comments: item.comment_count || 0,
              timestamp: new Date(item.taken_at * 1000),
              mediaType: item.media_type, // 1=photo, 2=video, 8=carousel
              thumbnailUrl: item.thumbnail_url || item.image_versions2?.candidates?.[0]?.url || '',
              videoDuration: item.video_duration || 0,
              productType: item.product_type || 'feed'
            }
          };

          // Categorize
          if (isReel) {
            reels.push(content);
          } else {
            posts.push(content);
          }
        });
      }

      console.log(`  ✅ Scraped ${posts.length} posts and ${reels.length} reels`);

      return {
        username,
        posts,
        reels,
        totalPosts: posts.length,
        totalReels: reels.length,
        scrapedAt: new Date()
      };

    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid RapidAPI key. Please check RAPIDAPI_KEY in .env file. Get your key from https://rapidapi.com/');
      }
      if (error.response?.status === 429) {
        throw new Error('RapidAPI rate limit exceeded. Please wait or upgrade your plan.');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Instagram API is slow or unavailable.');
      }
      throw error;
    }
  }

  /**
   * Scrape using Apify Instagram Scraper
   * Example: https://apify.com/apify/instagram-scraper
   */
  async scrapeWithApify(username) {
    try {
      const apifyToken = process.env.APIFY_TOKEN;
      const posts = [];
      const reels = [];

      // Start Apify actor
      const runResponse = await axios.post(
        'https://api.apify.com/v2/acts/apify~instagram-scraper/runs',
        {
          username: [username],
          resultsLimit: 50
        },
        {
          params: { token: apifyToken },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const runId = runResponse.data?.data?.id;

      // Wait for completion and get results
      let completed = false;
      let attempts = 0;
      const maxAttempts = 30;

      while (!completed && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

        const statusResponse = await axios.get(
          `https://api.apify.com/v2/acts/apify~instagram-scraper/runs/${runId}`,
          { params: { token: apifyToken } }
        );

        if (statusResponse.data?.data?.status === 'SUCCEEDED') {
          completed = true;
        }
        attempts++;
      }

      if (!completed) {
        throw new Error('Apify scraping timeout');
      }

      // Get dataset results
      const datasetId = runResponse.data?.data?.defaultDatasetId;
      const resultsResponse = await axios.get(
        `https://api.apify.com/v2/datasets/${datasetId}/items`,
        { params: { token: apifyToken } }
      );

      // Process results
      resultsResponse.data.forEach(item => {
        const content = {
          url: item.url,
          shortcode: item.shortCode,
          type: item.type === 'Video' || item.type === 'Reel' ? 'reel' : 'post',
          metadata: {
            caption: item.caption || '',
            likes: item.likesCount || 0,
            comments: item.commentsCount || 0,
            timestamp: new Date(item.timestamp),
            mediaType: item.type,
            thumbnailUrl: item.displayUrl
          }
        };

        if (content.type === 'reel') {
          reels.push(content);
        } else {
          posts.push(content);
        }
      });

      return {
        username,
        posts,
        reels,
        totalPosts: posts.length,
        totalReels: reels.length,
        scrapedAt: new Date()
      };

    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid Apify token. Please configure APIFY_TOKEN in .env');
      }
      throw error;
    }
  }

  /**
   * Custom scraping method (placeholder for your own implementation)
   * You can implement this using Puppeteer, Playwright, or other tools
   */
  async scrapeWithCustomMethod(username) {
    // PLACEHOLDER: This is where you would implement your custom scraping logic
    // Example using puppeteer:
    /*
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://www.instagram.com/${username}/`);
    // ... scraping logic ...
    await browser.close();
    */

    throw new Error('Custom scraping method not implemented. Please configure RapidAPI or Apify.');
  }

  /**
   * Fetch detailed post information
   * This is called after scraping to get additional details needed for sentiment analysis
   * 
   * @param {String} shortcode - Instagram post shortcode
   * @returns {Object} - Detailed post information
   */
  async fetchPostDetails(shortcode) {
    try {
      console.log(`    📝 Fetching details for post: ${shortcode}`);
      
      if (!this.rapidApiKey) {
        console.warn('    ⚠️  RapidAPI key not configured, skipping detailed fetch');
        return {};
      }

      if (this.scrapingMethod === 'rapidapi') {
        const response = await axios.get(
          `https://${this.rapidApiHost}/v1/post_info`,
          {
            params: { code_or_id_or_url: shortcode },
            headers: {
              'X-RapidAPI-Key': this.rapidApiKey,
              'X-RapidAPI-Host': this.rapidApiHost
            },
            timeout: 15000 // 15 second timeout
          }
        );

        const data = response.data?.data;
        const caption = data?.caption?.text || '';

        const details = {
          caption,
          likes: data?.like_count || 0,
          comments: data?.comment_count || 0,
          timestamp: data?.taken_at ? new Date(data.taken_at * 1000) : new Date(),
          mediaType: data?.media_type,
          videoUrl: data?.video_url || '',
          imageUrl: data?.image_versions2?.candidates?.[0]?.url || '',
          location: data?.location?.name || '',
          hashtags: this.extractHashtags(caption),
          mentions: this.extractMentions(caption),
          viewCount: data?.view_count || 0,
          playCount: data?.play_count || 0
        };

        console.log(`    ✅ Details fetched: ${details.likes} likes, ${details.comments} comments`);
        return details;
      }

      // Fallback for other methods
      return {};

    } catch (error) {
      if (error.response?.status === 429) {
        console.warn(`    ⚠️  Rate limit hit for ${shortcode}, using cached data`);
      } else {
        console.warn(`    ⚠️  Error fetching details for ${shortcode}: ${error.message}`);
      }
      return {};
    }
  }

  /**
   * Extract hashtags from caption
   */
  extractHashtags(caption) {
    const hashtagRegex = /#[\w]+/g;
    return caption.match(hashtagRegex) || [];
  }

  /**
   * Extract mentions from caption
   */
  extractMentions(caption) {
    const mentionRegex = /@[\w.]+/g;
    return caption.match(mentionRegex) || [];
  }

  /**
   * Validate if Instagram username exists and is public
   */
  async validateUsername(username) {
    try {
      console.log(`🔍 Validating Instagram username: @${username}`);
      
      if (!this.rapidApiKey) {
        throw new Error('RAPIDAPI_KEY not configured');
      }

      if (this.scrapingMethod === 'rapidapi') {
        const response = await axios.get(
          `https://${this.rapidApiHost}/v1/info`,
          {
            params: { username_or_id_or_url: username },
            headers: {
              'X-RapidAPI-Key': this.rapidApiKey,
              'X-RapidAPI-Host': this.rapidApiHost
            },
            timeout: 15000
          }
        );

        const exists = !!response.data?.data;
        const isPrivate = response.data?.data?.is_private || false;
        const validatedUsername = response.data?.data?.username || username;

        if (exists && isPrivate) {
          console.log(`  ⚠️  Account exists but is private: @${validatedUsername}`);
        } else if (exists) {
          console.log(`  ✅ Valid public account: @${validatedUsername}`);
        } else {
          console.log(`  ❌ Account not found: @${username}`);
        }

        return {
          exists,
          isPrivate,
          username: validatedUsername
        };
      }

      return { exists: false, isPrivate: true };
    } catch (error) {
      console.error(`  ❌ Validation error: ${error.message}`);
      return { exists: false, isPrivate: true };
    }
  }
}

module.exports = new InstagramScraperService();
