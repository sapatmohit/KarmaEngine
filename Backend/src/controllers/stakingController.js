const Staking = require('../models/Staking');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { stakeTokensOnBlockchain, unstakeTokensOnBlockchain, redeemKarmaForXLMOnBlockchain } = require('../services/blockchainService');
const mongoose = require('mongoose');

// Multiplier tiers based on staked amount
const MULTIPLIER_TIERS = [
  { min: 0, max: 100, multiplier: 1.0 },
  { min: 100, max: 500, multiplier: 1.5 },
  { min: 500, max: Infinity, multiplier: 2.0 }
];

/**
 * Get multiplier based on staked amount
 * @param {number} amount - Staked amount
 * @returns {number} - Multiplier value
 */
const getMultiplier = (amount) => {
  for (const tier of MULTIPLIER_TIERS) {
    if (amount >= tier.min && amount < tier.max) {
      return tier.multiplier;
    }
  }
  return 1.0;
};

/**
 * Stake tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const stakeTokens = async (req, res) => {
  try {
    const { walletAddress, amount } = req.body;

    // Validate required fields
    if (!walletAddress || !amount) {
      return res.status(400).json({ message: 'Wallet address and amount are required' });
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has enough karma points
    if (user.karmaPoints < amountNum) {
      return res.status(400).json({ message: 'Insufficient karma points' });
    }

    // Stake tokens on blockchain
    const blockchainResult = await stakeTokensOnBlockchain(walletAddress, amountNum);

    // Create staking record
    const staking = new Staking({
      userId: user._id,
      walletAddress,
      amount: amountNum,
      multiplier: getMultiplier(user.stakedAmount + amountNum),
      transactionHash: blockchainResult.transactionHash || '0x' + Math.random().toString(36).substring(2, 15),
      isActive: true
    });

    await staking.save();

    // Update user's staked amount and multiplier
    user.stakedAmount = (user.stakedAmount || 0) + amountNum;
    user.karmaPoints = (user.karmaPoints || 0) - amountNum;
    user.multiplier = getMultiplier(user.stakedAmount);
    await user.save();

    // Create activity record for staking
    console.log('Creating staking activity record for user:', user.walletAddress);
    const activity = new Activity({
      userId: new mongoose.Types.ObjectId(user._id), // Ensure proper ObjectId type
      walletAddress: user.walletAddress,
      type: 'stake',
      value: amountNum,
      multiplier: user.multiplier,
      finalKarma: -amountNum, // Negative because it's deducted from karma
      timestamp: new Date(),
      metadata: {
        stakingId: staking._id,
        transactionHash: staking.transactionHash
      }
    });

    await activity.save();
    console.log('Staking activity record saved successfully');

    res.status(201).json({
      message: 'Tokens staked successfully',
      staking: {
        id: staking._id,
        amount: staking.amount,
        multiplier: staking.multiplier,
        startDate: staking.startDate,
        transactionHash: staking.transactionHash
      },
      user: {
        walletAddress: user.walletAddress,
        stakedAmount: user.stakedAmount,
        karmaPoints: user.karmaPoints,
        multiplier: user.multiplier
      },
      blockchainResult
    });
  } catch (error) {
    console.error('Staking error:', error);
    res.status(500).json({ message: 'Server error during staking' });
  }
};

/**
 * Unstake tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const unstakeTokens = async (req, res) => {
  try {
    const { walletAddress, amount } = req.body;

    // Validate required fields
    if (!walletAddress || !amount) {
      return res.status(400).json({ message: 'Wallet address and amount are required' });
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has enough staked amount
    if ((user.stakedAmount || 0) < amountNum) {
      return res.status(400).json({ message: 'Insufficient staked amount' });
    }

    // Unstake tokens on blockchain
    const blockchainResult = await unstakeTokensOnBlockchain(walletAddress, amountNum);

    // Create unstaking record
    const staking = new Staking({
      userId: user._id,
      walletAddress,
      amount: amountNum,
      multiplier: getMultiplier(user.stakedAmount - amountNum),
      transactionHash: blockchainResult.transactionHash || '0x' + Math.random().toString(36).substring(2, 15),
      isActive: false,
      startDate: Date.now(),
      endDate: Date.now()
    });

    await staking.save();

    // Update user's staked amount and multiplier
    user.stakedAmount = (user.stakedAmount || 0) - amountNum;
    user.karmaPoints = (user.karmaPoints || 0) + amountNum;
    user.multiplier = getMultiplier(user.stakedAmount);
    await user.save();

    // Create activity record for unstaking
    console.log('Creating unstaking activity record for user:', user.walletAddress);
    const activity = new Activity({
      userId: new mongoose.Types.ObjectId(user._id), // Ensure proper ObjectId type
      walletAddress: user.walletAddress,
      type: 'unstake',
      value: amountNum,
      multiplier: user.multiplier,
      finalKarma: amountNum, // Positive because it's added to karma
      timestamp: new Date(),
      metadata: {
        stakingId: staking._id,
        transactionHash: staking.transactionHash
      }
    });

    await activity.save();
    console.log('Unstaking activity record saved successfully');

    res.json({
      message: 'Tokens unstaked successfully',
      staking: {
        id: staking._id,
        amount: staking.amount,
        multiplier: staking.multiplier,
        startDate: staking.startDate,
        endDate: staking.endDate
      },
      user: {
        walletAddress: user.walletAddress,
        stakedAmount: user.stakedAmount,
        karmaPoints: user.karmaPoints,
        multiplier: user.multiplier
      },
      blockchainResult
    });
  } catch (error) {
    console.error('Unstaking error:', error);
    res.status(500).json({ message: 'Server error during unstaking' });
  }
};

/**
 * Get user staking records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserStakingRecords = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { activeOnly = true } = req.query;

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get staking records
    const query = { userId: user._id };
    if (activeOnly === 'true') {
      query.isActive = true;
    }

    const stakingRecords = await Staking.find(query).sort({ startDate: -1 });

    res.json({
      stakingRecords: stakingRecords.map(record => ({
        id: record._id,
        amount: record.amount,
        multiplier: record.multiplier,
        startDate: record.startDate,
        endDate: record.endDate,
        isActive: record.isActive,
        transactionHash: record.transactionHash
      }))
    });
  } catch (error) {
    console.error('Get staking records error:', error);
    res.status(500).json({ message: 'Server error while fetching staking records' });
  }
};

/**
 * Redeem karma points for XLM tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const redeemKarma = async (req, res) => {
  try {
    const { walletAddress, karmaPoints } = req.body;

    // Validate input
    if (!walletAddress || !karmaPoints) {
      return res.status(400).json({ message: 'Wallet address and karma points are required' });
    }

    const karmaPointsNum = parseFloat(karmaPoints);
    if (isNaN(karmaPointsNum) || karmaPointsNum <= 0) {
      return res.status(400).json({ message: 'Karma points must be a positive number' });
    }

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has enough karma points
    if ((user.karmaPoints || 0) < karmaPointsNum) {
      return res.status(400).json({ message: 'Insufficient karma points' });
    }

    // Redeem karma points on blockchain
    const blockchainResult = await redeemKarmaForXLMOnBlockchain(walletAddress, karmaPointsNum);

    // Update user's karma points
    user.karmaPoints = (user.karmaPoints || 0) - karmaPointsNum;
    user.lastActivity = Date.now();
    await user.save();

    // Create activity record for redemption
    console.log('Creating redemption activity record for user:', user.walletAddress);
    const activity = new Activity({
      userId: new mongoose.Types.ObjectId(user._id), // Ensure proper ObjectId type
      walletAddress: user.walletAddress,
      type: 'redeem',
      value: karmaPointsNum,
      multiplier: 1.0,
      finalKarma: -karmaPointsNum, // Negative because it's deducted from karma
      timestamp: new Date(),
      metadata: {
        xlmTokens: blockchainResult.xlmTokensReceived,
        transactionHash: blockchainResult.transactionHash
      }
    });

    await activity.save();
    console.log('Redemption activity record saved successfully');

    res.status(200).json({
      message: 'Karma points redeemed successfully',
      redeemed: {
        karmaPoints: karmaPointsNum,
        xlmTokens: blockchainResult.xlmTokensReceived,
        transactionHash: blockchainResult.transactionHash
      },
      user: {
        walletAddress: user.walletAddress,
        remainingKarmaPoints: user.karmaPoints
      },
      blockchainResult
    });
  } catch (error) {
    console.error('Redeem error:', error);
    res.status(500).json({ message: 'Server error during redemption' });
  }
};

module.exports = {
  stakeTokens,
  unstakeTokens,
  getUserStakingRecords,
  redeemKarma
};