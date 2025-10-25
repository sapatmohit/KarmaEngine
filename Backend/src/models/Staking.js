const mongoose = require('mongoose');

const stakingSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true
  },
  multiplier: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  transactionHash: {
    type: String,
    required: true
  }
});

// Index for faster queries
stakingSchema.index({ userId: 1, isActive: 1 });
stakingSchema.index({ walletAddress: 1, startDate: -1 });

module.exports = mongoose.model('Staking', stakingSchema);