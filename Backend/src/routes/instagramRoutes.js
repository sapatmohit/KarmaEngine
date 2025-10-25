const express = require('express');
const router = express.Router();
const {
  scrapeUserInstagram,
  getUserInstagramContent,
  analyzeSentimentAndAwardKarma,
  processInstagramKarma,
  updateInstagramUsername
} = require('../controllers/instagramController');

/**
 * @route   PUT /instagram/:walletAddress/username
 * @desc    Update user's Instagram username
 * @access  Public
 */
router.put('/:walletAddress/username', updateInstagramUsername);

/**
 * @route   POST /instagram/:walletAddress/scrape
 * @desc    Scrape Instagram content for a user
 * @access  Public
 * @query   forceRescrape - Boolean to force rescraping (default: false)
 */
router.post('/:walletAddress/scrape', scrapeUserInstagram);

/**
 * @route   GET /instagram/:walletAddress/content
 * @desc    Get stored Instagram content for a user
 * @access  Public
 * @query   contentType - Filter by 'post' or 'reel'
 * @query   analyzed - Filter by sentiment analysis status (true/false)
 * @query   limit - Number of items to return (default: 50)
 */
router.get('/:walletAddress/content', getUserInstagramContent);

/**
 * @route   POST /instagram/:walletAddress/analyze
 * @desc    Analyze sentiment for scraped content and award karma
 * @access  Public
 * @body    contentIds - Array of content IDs to analyze
 * @body    analyzeAll - Boolean to analyze all unanalyzed content
 */
router.post('/:walletAddress/analyze', analyzeSentimentAndAwardKarma);

/**
 * @route   POST /instagram/:walletAddress/process
 * @desc    Complete workflow: Scrape, analyze, and award karma
 * @access  Public
 * @description This is the main endpoint that performs all steps:
 *              1. Scrapes Instagram content
 *              2. Saves to MongoDB
 *              3. Analyzes sentiment
 *              4. Awards karma points
 */
router.post('/:walletAddress/process', processInstagramKarma);

module.exports = router;
