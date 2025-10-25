const Activity = require('../models/Activity');
const User = require('../models/User');
const { updateKarmaOnBlockchain } = require('../services/blockchainService');

// Karma values based on activity type
const KARMA_VALUES = {
  post: 5,
  comment: 3,
  like: 1,
  repost: 2,
  report: -5
};

/**
 * Record a new activity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const recordActivity = async (req, res) => {
  try {
    const { walletAddress, type, metadata } = req.body;

    // Validate activity type
    if (!KARMA_VALUES.hasOwnProperty(type)) {
      return res.status(400).json({ message: 'Invalid activity type' });
    }

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate karma value with multiplier
    const baseKarma = KARMA_VALUES[type];
    const finalKarma = baseKarma * user.multiplier;

    // Update user's karma points
    user.karmaPoints += finalKarma;
    user.lastActivity = Date.now();
    await user.save();

    // Create activity record
    const activity = new Activity({
      userId: user._id,
      walletAddress,
      type,
      value: baseKarma,
      multiplier: user.multiplier,
      finalKarma,
      metadata
    });

    await activity.save();

    // Update karma on blockchain by recording the specific activity
    const blockchainResult = await updateKarmaOnBlockchain(walletAddress, type);

    res.status(201).json({
      message: 'Activity recorded successfully',
      activity: {
        id: activity._id,
        type: activity.type,
        value: activity.value,
        multiplier: activity.multiplier,
        finalKarma: activity.finalKarma,
        timestamp: activity.timestamp
      },
      user: {
        walletAddress: user.walletAddress,
        karmaPoints: user.karmaPoints
      },
      blockchainResult
    });
  } catch (error) {
    console.error('Activity recording error:', error);
    res.status(500).json({ message: 'Server error during activity recording' });
  }
};

/**
 * Get user activities
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserActivities = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get activities
    const activities = await Activity.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(offset);

    res.json({
      activities: activities.map(activity => ({
        id: activity._id,
        type: activity.type,
        value: activity.value,
        multiplier: activity.multiplier,
        finalKarma: activity.finalKarma,
        timestamp: activity.timestamp,
        metadata: activity.metadata
      }))
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error while fetching activities' });
  }
};

/**
 * Get activity statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getActivityStats = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get activity statistics
    const stats = await Activity.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalKarma: { $sum: '$finalKarma' }
        }
      }
    ]);

    res.json({
      stats
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({ message: 'Server error while fetching activity stats' });
  }
};

module.exports = {
  recordActivity,
  getUserActivities,
  getActivityStats
};