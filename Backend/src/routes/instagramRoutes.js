const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { fetchFromRapidAPI } = require('../utils/rapidapiHelper');

/**
 * Instagram Routes for KarmaEngine
 *
 * These routes integrate with RapidAPI Instagram scraper to:
 * 1. Fetch user posts and award karma points
 * 2. Fetch post comments and award karma points
 * 3. Fetch post likes and award karma points
 *
 * Point System (based on README):
 * - Posts: +10 karma points per post
 * - Comments: +2 karma points per comment
 * - Likes: +1 karma point per like
 */

/**
 * GET /api/instagram/fetch-user-posts/:username
 *
 * Fetches all posts from a user's Instagram profile and awards karma points
 * Awards +10 karma points per new post found
 *
 * @param {string} username - Instagram username to fetch posts for
 * @returns {Object} Response with username, all posts data, new posts count, karma added, and total karma
 */
router.get('/fetch-user-posts/:username', async (req, res) => {
	try {
		const { username } = req.params;

		console.log(`Fetching Instagram posts for username: ${username}`);

		// Validate username parameter
		if (!username || username.trim() === '') {
			return res.status(400).json({
				error: 'Username is required',
				message: 'Please provide a valid Instagram username',
			});
		}

		// Fetch posts from RapidAPI
		const apiPath = `/userposts/?username_or_id=${encodeURIComponent(
			username
		)}`;
		const postsData = await fetchFromRapidAPI(apiPath, 3);

		console.log(`Received ${postsData?.data?.length || 0} posts from API`);

		// Extract post data from the response
		const posts = [];
		if (postsData?.data && Array.isArray(postsData.data)) {
			postsData.data.forEach((post) => {
				if (post.shortcode) {
					posts.push({
						id: post.shortcode,
						code: post.shortcode,
						likes: post.likes_count || 0,
						comments: post.comments_count || 0,
						timestamp: post.taken_at || null,
						// Include other relevant post data
						thumbnail: post.thumbnail_url || null,
						caption: post.caption_text || ''
					});
				}
			});
		}

		// Find or create user in database
		let user = await User.findOne({ username: username });
		if (!user) {
			// Create new user if not found
			user = new User({
				username: username,
				name: username, // Use username as default name
				karmaPoints: 0,
				posts: [],
				comments: [],
				likes: [],
			});
			console.log(`Created new user for username: ${username}`);
		}

		// Find new posts (not already in user's posts array)
		const existingPosts = new Set(user.posts || []);
		const newPostIds = posts.map(post => post.id).filter((postId) => !existingPosts.has(postId));

		console.log(
			`Found ${newPostIds.length} new posts out of ${posts.length} total posts`
		);

		// Calculate karma points (10 points per new post)
		const karmaToAdd = newPostIds.length * 10;

		// Update user data with all post IDs (to track past activity)
		const allPostIds = posts.map(post => post.id);
		user.posts = [...new Set([...(user.posts || []), ...allPostIds])]; // Use Set to avoid duplicates
		user.karmaPoints = (user.karmaPoints || 0) + karmaToAdd;
		user.lastActivity = new Date();

		// Save user to database
		await user.save();

		console.log(`Awarded ${karmaToAdd} karma points to user ${username}`);

		// Return response with all posts data
		res.json({
			username: username,
			posts: posts, // Return all posts with their codes
			newPosts: newPostIds.length,
			karmaAdded: karmaToAdd,
			totalKarma: user.karmaPoints,
			totalPosts: user.posts.length,
			message: `Successfully processed ${posts.length} total posts, ${newPostIds.length} new`,
		});
	} catch (error) {
		console.error('Error fetching user posts:', error);

		// Handle specific error types
		if (error.message.includes('RAPIDAPI_KEY')) {
			return res.status(500).json({
				error: 'Configuration Error',
				message:
					'RapidAPI key not configured. Please set RAPIDAPI_KEY environment variable.',
			});
		}

		if (error.message.includes('status 404')) {
			return res.status(404).json({
				error: 'User Not Found',
				message: `Instagram user '${req.params.username}' not found or account is private`,
			});
		}

		res.status(500).json({
			error: 'Internal Server Error',
			message: 'Failed to fetch Instagram posts',
			details: error.message,
		});
	}
});

/**
 * GET /api/instagram/fetch-post-comments/:username/:postCode
 *
 * Fetches comments from a specific Instagram post and awards karma points
 * Awards +2 karma points per new comment found
 *
 * @param {string} username - Instagram username
 * @param {string} postCode - Instagram post shortcode/ID
 * @returns {Object} Response with username, activity type, items processed, karma added, and total karma
 */
router.get('/fetch-post-comments/:username/:postCode', async (req, res) => {
	try {
		const { username, postCode } = req.params;

		console.log(`Fetching comments for post ${postCode} by user ${username}`);

		// Validate parameters
		if (!username || !postCode) {
			return res.status(400).json({
				error: 'Missing Parameters',
				message: 'Both username and postCode are required',
			});
		}

		// Fetch comments from RapidAPI
		const apiPath = `/postcomments/?code_or_url=${encodeURIComponent(
			postCode
		)}`;
		const commentsData = await fetchFromRapidAPI(apiPath, 3);

		console.log(
			`Received ${commentsData?.data?.length || 0} comments from API`
		);

		// Extract comment IDs/texts from the response
		const comments = [];
		if (commentsData?.data && Array.isArray(commentsData.data)) {
			commentsData.data.forEach((comment) => {
				comments.push({
					id: comment.id,
					text: comment.text,
					username: comment.user?.username || 'unknown',
					timestamp: comment.created_at || null
				});
			});
		}

		// Find user in database
		let user = await User.findOne({ username: username });
		if (!user) {
			// Create new user if not found
			user = new User({
				username: username,
				name: username, // Use username as default name
				karmaPoints: 0,
				posts: [],
				comments: [],
				likes: [],
			});
			console.log(`Created new user for username: ${username}`);
		}

		// Find new comments (not already in user's comments array)
		const existingComments = new Set(user.comments || []);
		const newComments = comments.filter(
			(comment) => !existingComments.has(comment.id)
		);

		console.log(
			`Found ${newComments.length} new comments out of ${comments.length} total comments`
		);

		// Calculate karma points (2 points per new comment)
		const karmaToAdd = newComments.length * 2;

		// Update user data with all comment IDs
		const allCommentIds = comments.map(comment => comment.id);
		user.comments = [...new Set([...(user.comments || []), ...allCommentIds])]; // Use Set to avoid duplicates
		user.karmaPoints = (user.karmaPoints || 0) + karmaToAdd;
		user.lastActivity = new Date();

		// Save user to database
		await user.save();

		console.log(
			`Awarded ${karmaToAdd} karma points to user ${username} for comments`
		);

		// Return response
		res.json({
			username: username,
			postCode: postCode,
			activity: 'comments',
			allComments: comments, // Return all comments
			newComments: newComments.length,
			karmaAdded: karmaToAdd,
			totalKarma: user.karmaPoints,
			totalComments: user.comments.length,
			message: `Successfully processed ${comments.length} total comments, ${newComments.length} new`,
		});
	} catch (error) {
		console.error('Error fetching post comments:', error);

		// Handle specific error types
		if (error.message.includes('RAPIDAPI_KEY')) {
			return res.status(500).json({
				error: 'Configuration Error',
				message:
					'RapidAPI key not configured. Please set RAPIDAPI_KEY environment variable.',
			});
		}

		if (error.message.includes('status 404')) {
			return res.status(404).json({
				error: 'Post Not Found',
				message: `Instagram post '${req.params.postCode}' not found or is private`,
			});
		}

		res.status(500).json({
			error: 'Internal Server Error',
			message: 'Failed to fetch Instagram post comments',
			details: error.message,
		});
	}
});

/**
 * GET /api/instagram/fetch-post-likes/:username/:postCode
 *
 * Fetches likes from a specific Instagram post and awards karma points
 * Awards +1 karma point per new like found
 *
 * @param {string} username - Instagram username
 * @param {string} postCode - Instagram post shortcode/ID
 * @returns {Object} Response with username, activity type, items processed, karma added, and total karma
 */
router.get('/fetch-post-likes/:username/:postCode', async (req, res) => {
	try {
		const { username, postCode } = req.params;

		console.log(`Fetching likes for post ${postCode} by user ${username}`);

		// Validate parameters
		if (!username || !postCode) {
			return res.status(400).json({
				error: 'Missing Parameters',
				message: 'Both username and postCode are required',
			});
		}

		// Fetch likes from RapidAPI (limit to 50 as specified)
		const apiPath = `/postlikes/?code_or_url=${encodeURIComponent(
			postCode
		)}&count=50`;
		const likesData = await fetchFromRapidAPI(apiPath, 3);

		console.log(`Received ${likesData?.data?.length || 0} likes from API`);

		// Extract usernames from the response
		const likes = [];
		if (likesData?.data && Array.isArray(likesData.data)) {
			likesData.data.forEach((like) => {
				likes.push({
					username: like.username,
					id: like.id || like.username,
					timestamp: like.taken_at || null
				});
			});
		}

		// Find user in database
		let user = await User.findOne({ username: username });
		if (!user) {
			// Create new user if not found
			user = new User({
				username: username,
				name: username, // Use username as default name
				karmaPoints: 0,
				posts: [],
				comments: [],
				likes: [],
			});
			console.log(`Created new user for username: ${username}`);
		}

		// Find new likes (not already in user's likes array)
		const existingLikes = new Set(user.likes || []);
		const newLikes = likes.filter(
			(like) => !existingLikes.has(like.id)
		);

		console.log(
			`Found ${newLikes.length} new likes out of ${likes.length} total likes`
		);

		// Calculate karma points (1 point per new like)
		const karmaToAdd = newLikes.length * 1;

		// Update user data with all like IDs
		const allLikeIds = likes.map(like => like.id);
		user.likes = [...new Set([...(user.likes || []), ...allLikeIds])]; // Use Set to avoid duplicates
		user.karmaPoints = (user.karmaPoints || 0) + karmaToAdd;
		user.lastActivity = new Date();

		// Save user to database
		await user.save();

		console.log(
			`Awarded ${karmaToAdd} karma points to user ${username} for likes`
		);

		// Return response
		res.json({
			username: username,
			postCode: postCode,
			activity: 'likes',
			allLikes: likes, // Return all likes
			newLikes: newLikes.length,
			karmaAdded: karmaToAdd,
			totalKarma: user.karmaPoints,
			totalLikes: user.likes.length,
			message: `Successfully processed ${likes.length} total likes, ${newLikes.length} new`,
		});
	} catch (error) {
		console.error('Error fetching post likes:', error);

		// Handle specific error types
		if (error.message.includes('RAPIDAPI_KEY')) {
			return res.status(500).json({
				error: 'Configuration Error',
				message:
					'RapidAPI key not configured. Please set RAPIDAPI_KEY environment variable.',
			});
		}

		if (error.message.includes('status 404')) {
			return res.status(404).json({
				error: 'Post Not Found',
				message: `Instagram post '${req.params.postCode}' not found or is private`,
			});
		}

		res.status(500).json({
			error: 'Internal Server Error',
			message: 'Failed to fetch Instagram post likes',
			details: error.message,
		});
	}
});

/**
 * GET /api/instagram/fetch-user-activity/:username
 *
 * Fetches summary of all activity for an Instagram user
 *
 * @param {string} username - Instagram username to fetch all activity for
 * @returns {Object} Response with username, karma points, and activity counts
 */
router.get('/fetch-user-activity/:username', async (req, res) => {
	try {
		const { username } = req.params;

		console.log(`Fetching all Instagram activity for username: ${username}`);

		// Validate username parameter
		if (!username || username.trim() === '') {
			return res.status(400).json({
				error: 'Username is required',
				message: 'Please provide a valid Instagram username',
			});
		}

		// Find user in database
		let user = await User.findOne({ username: username });
		if (!user) {
			return res.status(404).json({
				error: 'User Not Found',
				message: `User '${username}' not found in database`,
			});
		}

		// Return user activity summary
		res.json({
			username: username,
			totalKarma: user.karmaPoints,
			totalPosts: user.posts.length,
			totalComments: user.comments.length,
			totalLikes: user.likes.length,
			message: `Successfully fetched activity summary for user ${username}`
		});
	} catch (error) {
		console.error('Error fetching user activity:', error);
		res.status(500).json({
			error: 'Internal Server Error',
			message: 'Failed to fetch Instagram user activity',
			details: error.message,
		});
	}
});

module.exports = router;
