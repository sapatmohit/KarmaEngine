const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  karmaPoints: {
    type: Number,
    default: 0
  },
  stakedAmount: {
    type: Number,
    default: 0
  },
  multiplier: {
    type: Number,
    default: 1.0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Index for faster queries
userSchema.index({ walletAddress: 1 });
userSchema.index({ karmaPoints: -1 });

module.exports = mongoose.model('User', userSchema);