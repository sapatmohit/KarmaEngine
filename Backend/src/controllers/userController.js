const User = require('../models/User');
const { registerUserOnBlockchain } = require('../services/blockchainService');
const { generateRandomUsername, generateRandomAvatar, isOver18 } = require('../utils/helpers');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const registerUser = async (req, res) => {
  try {
    const { 
      walletAddress, 
      name, 
      dateOfBirth, 
      instagram, 
      facebook, 
      twitter 
    } = req.body;

    // Validate required fields
    if (!walletAddress || !name || !dateOfBirth) {
      return res.status(400).json({ message: 'Wallet address, name, and date of birth are required' });
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
      return res.status(400).json({ message: 'User must be over 18 years old to register' });
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
        twitter: twitter || ''
      },
      karmaPoints: 0
    });

    // Save user to database
    await user.save();

    // Prepare user data for blockchain registration
    const userData = {
      name: user.name,
      username: user.username,
      dateOfBirth: user.dateOfBirth,
      isOver18: user.isOver18,
      socialMedia: user.socialMedia
    };

    // Register user on blockchain (placeholder)
    const blockchainResult = await registerUserOnBlockchain(walletAddress, userData);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        karmaPoints: user.karmaPoints,
        isOver18: user.isOver18
      },
      blockchainResult
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
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

/**
 * Update user karma points
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserKarma = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { karmaPoints } = req.body;

    const user = await User.findOneAndUpdate(
      { walletAddress },
      { karmaPoints, lastActivity: Date.now() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User karma updated successfully',
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        karmaPoints: user.karmaPoints
      }
    });
  } catch (error) {
    console.error('Update karma error:', error);
    res.status(500).json({ message: 'Server error while updating karma' });
  }
};

module.exports = {
  registerUser,
  getUserByWallet,
  updateUserKarma
};