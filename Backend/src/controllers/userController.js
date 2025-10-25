const User = require('../models/User');
const { registerUserOnBlockchain } = require('../services/blockchainService');
const {
	generateRandomUsername,
	generateRandomAvatar,
	isOver18,
} = require('../utils/helpers');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const registerUser = async (req, res) => {
	try {
		const { walletAddress, name, dateOfBirth, instagram, facebook, twitter } =
			req.body;

		// Validate required fields
		if (!walletAddress || !name || !dateOfBirth) {
			return res.status(400).json({
				message: 'Wallet address, name, and date of birth are required',
			});
		}

		// Check if user already exists
		let user = await User.findOne({ walletAddress });
		if (user) {
			return res.status(400).json({ message: 'User already registered' });
		}

		// Check if username is already taken or generate a new one
		let username = await User.findOne({ username: name.replace(/\s+/g, '') });
		if (username) {
			username = generateRandomUsername();
		} else {
			username = name.replace(/\s+/g, '');
		}

		// Generate avatar
		const avatar = generateRandomAvatar();

		// Check age verification
		const isOver18User = isOver18(dateOfBirth);
		if (!isOver18User) {
			return res
				.status(400)
				.json({ message: 'User must be over 18 years old to register' });
		}

		// Create new user
		user = new User({
			walletAddress,
			name,
			dateOfBirth: new Date(dateOfBirth),
			isOver18: isOver18User,
			username,
			avatar,
			socialMedia: {
				instagram: instagram || '',
				facebook: facebook || '',
				twitter: twitter || '',
			},
			karmaPoints: 0,
		});

		// Save user to database
		await user.save();

		// Prepare user data for blockchain registration
		const userData = {
			name: user.name,
			username: user.username,
			dateOfBirth: user.dateOfBirth,
			isOver18: user.isOver18,
			socialMedia: user.socialMedia,
		};

		// Register user on blockchain
		const blockchainResult = await registerUserOnBlockchain(
			walletAddress,
			userData
		);

		res.status(201).json({
			message: 'User registered successfully',
			user: {
				id: user._id,
				walletAddress: user.walletAddress,
				name: user.name,
				username: user.username,
				avatar: user.avatar,
				karmaPoints: user.karmaPoints,
				isOver18: user.isOver18,
			},
			blockchainResult,
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ message: 'Server error during registration' });
	}
};

/**
 * Get user by wallet address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserByWallet = async (req, res) => {
	try {
		const { walletAddress } = req.params;
		const user = await User.findOne({ walletAddress });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json({
			user: {
				id: user._id,
				walletAddress: user.walletAddress,
				name: user.name,
				username: user.username,
				avatar: user.avatar,
				dateOfBirth: user.dateOfBirth,
				isOver18: user.isOver18,
				socialMedia: user.socialMedia,
				karmaPoints: user.karmaPoints,
				stakedAmount: user.stakedAmount,
				multiplier: user.multiplier,
				createdAt: user.createdAt,
				lastActivity: user.lastActivity,
				isActive: user.isActive,
			},
		});
	} catch (error) {
		console.error('Get user error:', error);
		res.status(500).json({ message: 'Server error while fetching user' });
	}
};

/**
 * Update user profile information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserProfile = async (req, res) => {
	try {
		const { walletAddress } = req.params;
		const { name, dateOfBirth, instagram, facebook, twitter } = req.body;

		// Find user
		const user = await User.findOne({ walletAddress });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Update user profile
		if (name) user.name = name;
		if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
		if (dateOfBirth) user.isOver18 = isOver18(dateOfBirth);
		
		if (instagram !== undefined) user.socialMedia.instagram = instagram;
		if (facebook !== undefined) user.socialMedia.facebook = facebook;
		if (twitter !== undefined) user.socialMedia.twitter = twitter;

		// Save updated user
		await user.save();

		res.json({
			message: 'User profile updated successfully',
			user: {
				id: user._id,
				walletAddress: user.walletAddress,
				name: user.name,
				username: user.username,
				avatar: user.avatar,
				dateOfBirth: user.dateOfBirth,
				isOver18: user.isOver18,
				socialMedia: user.socialMedia,
				karmaPoints: user.karmaPoints,
				stakedAmount: user.stakedAmount,
				multiplier: user.multiplier,
			},
		});
	} catch (error) {
		console.error('Update profile error:', error);
		res.status(500).json({ message: 'Server error while updating profile' });
	}
};

/**
 * Register user with email and password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const registerEmailUser = async (req, res) => {
	try {
		const { email, password, name, dateOfBirth, instagram, facebook, twitter } =
			req.body;

		// Validate required fields
		if (!email || !password || !name || !dateOfBirth) {
			return res
				.status(400)
				.json({
					message: 'Email, password, name, and date of birth are required',
				});
		}

		// Check if user already exists
		let user = await User.findOne({ email });
		if (user) {
			return res
				.status(400)
				.json({ message: 'User already registered with this email' });
		}

		// Check age verification
		const isOver18User = isOver18(dateOfBirth);
		if (!isOver18User) {
			return res
				.status(400)
				.json({ message: 'User must be over 18 years old to register' });
		}

		// Generate username from email
		const username =
			email.split('@')[0] + Math.random().toString(36).substr(2, 4);

		// Create new user
		user = new User({
			email,
			password,
			name,
			dateOfBirth: new Date(dateOfBirth),
			isOver18: isOver18User,
			username,
			avatar: generateRandomAvatar(),
			socialMedia: {
				instagram: instagram || '',
				facebook: facebook || '',
				twitter: twitter || '',
			},
			karmaPoints: 0,
		});

		// Save user to database
		await user.save();

		// Generate JWT token
		const token = user.generateAuthToken();

		res.status(201).json({
			message: 'User registered successfully',
			token,
			user: {
				id: user._id,
				email: user.email,
				name: user.name,
				username: user.username,
				avatar: user.avatar,
				dateOfBirth: user.dateOfBirth,
				isOver18: user.isOver18,
				socialMedia: user.socialMedia,
				karmaPoints: user.karmaPoints,
			},
		});
	} catch (error) {
		console.error('Email registration error:', error);
		res.status(500).json({ message: 'Server error during registration' });
	}
};

/**
 * Login user with email and password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const loginEmailUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate required fields
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: 'Email and password are required' });
		}

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// Check password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// Generate JWT token
		const token = user.generateAuthToken();

		res.json({
			message: 'Login successful',
			token,
			user: {
				id: user._id,
				email: user.email,
				name: user.name,
				username: user.username,
				avatar: user.avatar,
				karmaPoints: user.karmaPoints,
				walletAddress: user.walletAddress,
			},
		});
	} catch (error) {
		console.error('Email login error:', error);
		res.status(500).json({ message: 'Server error during login' });
	}
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCurrentUser = async (req, res) => {
	try {
		const user = req.user;
		res.json({
			user: {
				id: user._id,
				email: user.email,
				name: user.name,
				username: user.username,
				avatar: user.avatar,
				dateOfBirth: user.dateOfBirth,
				isOver18: user.isOver18,
				socialMedia: user.socialMedia,
				walletAddress: user.walletAddress,
				karmaPoints: user.karmaPoints,
				stakedAmount: user.stakedAmount,
				multiplier: user.multiplier,
				createdAt: user.createdAt,
				lastActivity: user.lastActivity,
				isActive: user.isActive,
			},
		});
	} catch (error) {
		console.error('Get current user error:', error);
		res.status(500).json({ message: 'Server error while fetching user' });
	}
};

module.exports = {
	registerUser,
	registerEmailUser,
	loginEmailUser,
	getUserByWallet,
	getCurrentUser,
	updateUserProfile,
};