const User = require('../models/User');
const { getKarmaBalance, getStakingInfo } = require('../services/blockchainService');

/**
 * Get user's karma balance
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getKarmaBalanceController = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Find user in database
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get karma balance from blockchain
    const blockchainKarma = await getKarmaBalance(walletAddress);

    res.json({
      user: {
        walletAddress: user.walletAddress,
        databaseKarma: user.karmaPoints,
        blockchainKarma: blockchainKarma.karmaBalance,
        stakedAmount: user.stakedAmount,
        multiplier: user.multiplier
      }
    });
  } catch (error) {
    console.error('Get karma balance error:', error);
    res.status(500).json({ message: 'Server error while fetching karma balance' });
  }
};

/**
 * Sync user's karma between database and blockchain
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const syncKarmaController = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Find user in database
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get karma balance from blockchain
    const blockchainKarma = await getKarmaBalance(walletAddress);
    const stakingInfo = await getStakingInfo(walletAddress);

    // Update user in database
    user.karmaPoints = blockchainKarma.karmaBalance;
    user.stakedAmount = stakingInfo.stakedAmount;
    user.multiplier = stakingInfo.multiplier;
    user.lastActivity = Date.now();
    
    await user.save();

    res.json({
      message: 'Karma synced successfully',
      user: {
        walletAddress: user.walletAddress,
        karmaPoints: user.karmaPoints,
        stakedAmount: user.stakedAmount,
        multiplier: user.multiplier
      }
    });
  } catch (error) {
    console.error('Sync karma error:', error);
    res.status(500).json({ message: 'Server error while syncing karma' });
  }
};

/**
 * Get leaderboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLeaderboardController = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get top users by karma points
    const users = await User.find({ isActive: true })
      .sort({ karmaPoints: -1 })
      .limit(parseInt(limit));

    res.json({
      leaderboard: users.map((user, index) => ({
        rank: index + 1,
        walletAddress: user.walletAddress,
        karmaPoints: user.karmaPoints,
        stakedAmount: user.stakedAmount,
        multiplier: user.multiplier
      }))
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error while fetching leaderboard' });
  }
};

module.exports = {
  getKarmaBalanceController,
  syncKarmaController,
  getLeaderboardController
};