const express = require('express');
const router = express.Router();
const karmaController = require('../controllers/karmaController');

// Get user's karma balance
router.get('/balance/:walletAddress', karmaController.getKarmaBalanceController);

// Sync user's karma between database and blockchain
router.post('/sync/:walletAddress', karmaController.syncKarmaController);

// Get leaderboard
router.get('/leaderboard', karmaController.getLeaderboardController);

module.exports = router;