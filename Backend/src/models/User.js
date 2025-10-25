const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  isOver18: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    unique: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  socialMedia: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' }
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