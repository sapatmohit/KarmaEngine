const User = require('../models/User');
const { registerUserOnBlockchain } = require('../services/blockchainService');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const registerUser = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    // Check if user already exists
    let user = await User.findOne({ walletAddress });
    if (user) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Create new user with initial karma points
    user = new User({
      walletAddress,
      karmaPoints: 0
    });

    // Save user to database
    await user.save();

    // Register user on blockchain (placeholder)
    const blockchainResult = await registerUserOnBlockchain(walletAddress);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        karmaPoints: user.karmaPoints
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