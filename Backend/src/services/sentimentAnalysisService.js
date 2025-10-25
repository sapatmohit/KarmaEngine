const axios = require('axios');

/**
 * Sentiment Analysis Service
 * Integrates with AI services for content sentiment analysis
 * Uses Google Gemini API for analyzing Instagram content
 */

class SentimentAnalysisService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    this.geminiModel = process.env.GEMINI_MODEL || 'gemini-pro';
    this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    
    // Validate configuration on initialization
    if (!this.geminiApiKey) {
      console.warn('⚠️  GEMINI_API_KEY not configured. Sentiment analysis will use fallback method.');
      console.warn('   Get your key from: https://makersuite.google.com/app/apikey');
    }
  }

  /**
   * Analyze sentiment of Instagram content
   * @param {Object} contentDetails - Details of the Instagram post/reel
   * @returns {Object} - Sentiment analysis result with karma score
   */
  async analyzeContent(contentDetails) {
    try {
      const { caption, likes, comments, hashtags, mentions, mediaType } = contentDetails;
      
      console.log(`    🧠 Analyzing sentiment for ${mediaType}...`);

      // Prepare prompt for Gemini
      const prompt = this.buildAnalysisPrompt(contentDetails);

      // Call Gemini API
      const sentimentResult = await this.callGeminiAPI(prompt);

      // Calculate karma points based on sentiment
      const karmaPoints = this.calculateKarmaFromSentiment(sentimentResult, {
        likes,
        comments,
        mediaType
      });

      console.log(`    ✅ Analysis complete: ${sentimentResult.sentiment} (${sentimentResult.score}/100) = ${karmaPoints} karma`);

      return {
        sentimentScore: sentimentResult.score,
        sentiment: sentimentResult.sentiment,
        category: sentimentResult.category,
        keywords: sentimentResult.keywords,
        karmaPoints,
        analysis: sentimentResult.analysis,
        confidence: sentimentResult.confidence
      };

    } catch (error) {
      console.error('    ❌ Sentiment analysis error:', error.message);
      throw new Error(`Sentiment analysis failed: ${error.message}`);
    }
  }

  /**
   * Build analysis prompt for Gemini
   */
  buildAnalysisPrompt(contentDetails) {
    const { caption, likes, comments, hashtags, mentions, mediaType } = contentDetails;

    return `
Analyze the following Instagram ${mediaType === 'reel' ? 'reel' : 'post'} for sentiment and content quality to determine karma points in a social reputation system.

**Content Details:**
- Caption: "${caption}"
- Likes: ${likes}
- Comments: ${comments}
- Hashtags: ${hashtags?.join(', ') || 'None'}
- Mentions: ${mentions?.join(', ') || 'None'}

**Analysis Requirements:**
1. Determine the overall sentiment (positive, neutral, negative)
2. Assign a sentiment score from -100 to +100
3. Categorize the content (educational, entertainment, inspirational, promotional, personal, etc.)
4. Extract key themes and keywords
5. Assess content quality and authenticity
6. Evaluate potential positive or negative social impact

**Karma Point Guidelines:**
- Positive, helpful, educational, or inspirational content: High karma (50-100 points)
- Neutral, entertainment, or personal content: Medium karma (10-49 points)
- Promotional or sales-focused content: Low karma (1-9 points)
- Negative, harmful, or misleading content: Negative karma (-100 to -1 points)

Consider engagement metrics (likes, comments) as secondary factors.

Respond ONLY with a valid JSON object in this exact format:
{
  "sentiment": "positive|neutral|negative",
  "score": <number between -100 and 100>,
  "category": "<content category>",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "analysis": "<brief explanation>",
  "confidence": <number between 0 and 1>,
  "suggestedKarmaMultiplier": <number between 0.1 and 2.0>
}
`;
  }

  /**
   * Call Gemini API for analysis
   */
  async callGeminiAPI(prompt) {
    try {
      // Check if API key is configured
      if (!this.geminiApiKey) {
        console.warn('    ⚠️  Gemini API key not configured, using fallback analysis');
        return this.fallbackSentimentAnalysis(prompt);
      }

      // Call Gemini API
      const response = await axios.post(
        `${this.geminiApiUrl}/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_NONE'
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      // Parse Gemini response
      const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        console.warn('    ⚠️  Invalid Gemini response, using fallback');
        return this.fallbackSentimentAnalysis(prompt);
      }

      // Extract JSON from response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('    ⚠️  Could not parse Gemini JSON, using fallback');
        return this.fallbackSentimentAnalysis(prompt);
      }

      const result = JSON.parse(jsonMatch[0]);
      
      return {
        sentiment: result.sentiment || 'neutral',
        score: result.score || 0,
        category: result.category || 'general',
        keywords: result.keywords || [],
        analysis: result.analysis || '',
        confidence: result.confidence || 0.5,
        suggestedKarmaMultiplier: result.suggestedKarmaMultiplier || 1.0
      };

    } catch (error) {
      if (error.response?.status === 400) {
        console.error('    ❌ Gemini API error - Invalid request:', error.response.data?.error?.message);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('    ❌ Gemini API authentication error. Check your GEMINI_API_KEY');
      } else if (error.response?.status === 429) {
        console.warn('    ⚠️  Gemini API rate limit exceeded');
      } else if (error.code === 'ECONNABORTED') {
        console.warn('    ⚠️  Gemini API timeout');
      }

      // Fallback to basic sentiment analysis
      console.warn('    ➡️  Using fallback sentiment analysis');
      return this.fallbackSentimentAnalysis(prompt);
    }
  }

  /**
   * Fallback sentiment analysis if Gemini API fails
   * Uses simple keyword-based analysis
   */
  fallbackSentimentAnalysis(prompt) {
    console.log('    🔍 Using keyword-based fallback analysis');

    // Extract caption from prompt
    const captionMatch = prompt.match(/Caption: "(.+?)"/);
    const caption = captionMatch ? captionMatch[1].toLowerCase() : '';
    
    // Extract engagement metrics
    const likesMatch = prompt.match(/Likes: (\d+)/);
    const commentsMatch = prompt.match(/Comments: (\d+)/);
    const likes = likesMatch ? parseInt(likesMatch[1]) : 0;
    const comments = commentsMatch ? parseInt(commentsMatch[1]) : 0;

    // Enhanced keyword lists
    const positiveKeywords = [
      'love', 'happy', 'great', 'amazing', 'beautiful', 'thanks', 'grateful', 
      'blessed', 'joy', 'inspire', 'awesome', 'wonderful', 'perfect', 'excellent',
      'fantastic', 'incredible', 'stunning', 'lovely', 'proud', 'excited',
      'congratulations', 'success', 'achievement', 'celebrate', 'hope', 'peace'
    ];
    
    const negativeKeywords = [
      'hate', 'angry', 'sad', 'terrible', 'awful', 'bad', 'worst', 
      'disappointed', 'upset', 'horrible', 'disgusting', 'annoying', 'frustrating',
      'pathetic', 'useless', 'fail', 'sucks', 'stupid', 'ridiculous'
    ];
    
    const educationalKeywords = [
      'learn', 'tutorial', 'how to', 'guide', 'education', 'teach', 'lesson',
      'tip', 'advice', 'information', 'knowledge', 'skill', 'training'
    ];
    
    const inspirationalKeywords = [
      'inspire', 'motivate', 'believe', 'dream', 'achieve', 'goal', 'vision',
      'passion', 'journey', 'growth', 'transformation', 'change', 'improve'
    ];

    let score = 0;
    let category = 'general';
    const foundKeywords = [];

    // Calculate sentiment score
    positiveKeywords.forEach(word => {
      if (caption.includes(word)) {
        score += 10;
        foundKeywords.push(word);
      }
    });
    
    negativeKeywords.forEach(word => {
      if (caption.includes(word)) {
        score -= 10;
        foundKeywords.push(word);
      }
    });

    // Determine category
    const eduCount = educationalKeywords.filter(w => caption.includes(w)).length;
    const inspCount = inspirationalKeywords.filter(w => caption.includes(w)).length;
    
    if (eduCount > 0) category = 'educational';
    else if (inspCount > 0) category = 'inspirational';
    else if (caption.includes('buy') || caption.includes('shop') || caption.includes('sale')) category = 'promotional';
    else if (likes > 100 || comments > 20) category = 'entertainment';
    else category = 'personal';

    // Engagement boost
    if (likes > 500) score += 15;
    else if (likes > 100) score += 10;
    else if (likes > 50) score += 5;

    if (comments > 50) score += 10;
    else if (comments > 20) score += 5;

    // Clamp score between -100 and 100
    score = Math.max(-100, Math.min(100, score));

    const sentiment = score > 20 ? 'positive' : (score < -20 ? 'negative' : 'neutral');

    // Determine multiplier based on category
    let suggestedKarmaMultiplier = 1.0;
    if (category === 'educational') suggestedKarmaMultiplier = 1.5;
    else if (category === 'inspirational') suggestedKarmaMultiplier = 1.4;
    else if (category === 'promotional') suggestedKarmaMultiplier = 0.7;

    return {
      sentiment,
      score,
      category,
      keywords: foundKeywords.slice(0, 5),
      analysis: `Fallback analysis: ${sentiment} content (${category}) with ${likes} likes and ${comments} comments`,
      confidence: 0.4, // Lower confidence for fallback
      suggestedKarmaMultiplier
    };
  }

  /**
   * Calculate karma points from sentiment analysis
   */
  calculateKarmaFromSentiment(sentimentResult, metrics) {
    const { score, suggestedKarmaMultiplier, confidence } = sentimentResult;
    const { likes, comments } = metrics;

    // Base karma from sentiment score
    let baseKarma = 0;
    
    if (score >= 80) {
      baseKarma = 100;
    } else if (score >= 50) {
      baseKarma = 75;
    } else if (score >= 20) {
      baseKarma = 50;
    } else if (score >= 0) {
      baseKarma = 25;
    } else if (score >= -20) {
      baseKarma = 10;
    } else if (score >= -50) {
      baseKarma = 0;
    } else {
      baseKarma = -50;
    }

    // Apply AI-suggested multiplier
    baseKarma *= suggestedKarmaMultiplier;

    // Engagement bonus (max 20% boost)
    const engagementScore = Math.log10((likes || 0) + (comments || 0) * 5 + 1);
    const engagementMultiplier = 1 + Math.min(0.2, engagementScore / 50);
    
    baseKarma *= engagementMultiplier;

    // Apply confidence factor
    baseKarma *= confidence;

    // Round to whole number
    return Math.round(baseKarma);
  }

  /**
   * Batch analyze multiple contents
   */
  async batchAnalyze(contentDetailsArray) {
    const results = [];
    
    for (const content of contentDetailsArray) {
      try {
        const result = await this.analyzeContent(content);
        results.push({
          shortcode: content.shortcode,
          success: true,
          ...result
        });
        
        // Rate limiting: wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          shortcode: content.shortcode,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Validate Gemini API configuration
   */
  async validateGeminiAPI() {
    if (!this.geminiApiKey) {
      return {
        valid: false,
        message: 'GEMINI_API_KEY not configured in .env file'
      };
    }

    try {
      const response = await axios.post(
        `${this.geminiApiUrl}/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: 'Test'
            }]
          }]
        }
      );

      return {
        valid: true,
        message: 'Gemini API configured correctly'
      };
    } catch (error) {
      return {
        valid: false,
        message: `Gemini API validation failed: ${error.message}`
      };
    }
  }
}

module.exports = new SentimentAnalysisService();
