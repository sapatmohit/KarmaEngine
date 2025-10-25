const mongoose = require('mongoose');

const instagramContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  walletAddress: {
    type: String,
    required: true,
    index: true
  },
  instagramUsername: {
    type: String,
    required: true,
    index: true
  },
  contentType: {
    type: String,
    required: true,
    enum: ['reel', 'post']
  },
  url: {
    type: String,
    required: true
  },
  shortcode: {
    type: String,
    required: true,
    unique: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  },
  sentimentAnalyzed: {
    type: Boolean,
    default: false
  },
  sentimentScore: {
    type: Number,
    default: null
  },
  sentimentData: {
    type: Object,
    default: {}
  },
  karmaAwarded: {
    type: Boolean,
    default: false
  },
  karmaPoints: {
    type: Number,
    default: 0
  },
  metadata: {
    caption: String,
    likes: Number,
    comments: Number,
    timestamp: Date,
    mediaType: String,
    thumbnailUrl: String
  }
});

// Compound index for efficient queries
instagramContentSchema.index({ userId: 1, contentType: 1 });
instagramContentSchema.index({ walletAddress: 1, scrapedAt: -1 });
instagramContentSchema.index({ sentimentAnalyzed: 1, karmaAwarded: 1 });

module.exports = mongoose.model('InstagramContent', instagramContentSchema);
