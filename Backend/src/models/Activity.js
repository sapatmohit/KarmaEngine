const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['post', 'comment', 'like', 'repost', 'report', 'stake', 'unstake', 'redeem']
  },
  value: {
    type: Number,
    required: true
  },
  multiplier: {
    type: Number,
    default: 1.0
  },
  finalKarma: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object,
    default: {}
  }
});

// Index for faster queries
activitySchema.index({ userId: 1, type: 1 });
activitySchema.index({ walletAddress: 1, timestamp: -1 });

module.exports = mongoose.model('Activity', activitySchema);