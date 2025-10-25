const Staking = require('../models/Staking');
const User = require('../models/User');
const { stakeTokens, unstakeTokens } = require('../services/blockchainService');

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
const stakeTokensController = async (req, res) => {
  try {
    const { walletAddress, amount, transactionHash } = req.body;

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Stake tokens on blockchain (placeholder)
    const blockchainResult = await stakeTokens(walletAddress, amount, transactionHash);

    // Create staking record
    const staking = new Staking({
      userId: user._id,
      walletAddress,
      amount,
      multiplier: getMultiplier(amount),
      transactionHash,
      isActive: true
    });

    await staking.save();

    // Update user's staked amount and multiplier
    user.stakedAmount += amount;
    user.multiplier = getMultiplier(user.stakedAmount);
    await user.save();

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
const unstakeTokensController = async (req, res) => {
  try {
    const { walletAddress, stakingId } = req.body;

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find staking record
    const staking = await Staking.findOne({ _id: stakingId, userId: user._id, isActive: true });
    if (!staking) {
      return res.status(404).json({ message: 'Staking record not found or already unstaked' });
    }

    // Unstake tokens on blockchain (placeholder)
    const blockchainResult = await unstakeTokens(walletAddress, staking.amount, staking.transactionHash);

    // Update staking record
    staking.isActive = false;
    staking.endDate = Date.now();
    await staking.save();

    // Update user's staked amount and multiplier
    user.stakedAmount -= staking.amount;
    user.multiplier = getMultiplier(user.stakedAmount);
    await user.save();

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

module.exports = {
  stakeTokensController,
  unstakeTokensController,
  getUserStakingRecords
};