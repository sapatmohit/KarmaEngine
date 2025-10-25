const express = require('express');
const router = express.Router();
const stakingController = require('../controllers/stakingController');

// Stake tokens
router.post('/stake', stakingController.stakeTokens);

// Unstake tokens
router.post('/unstake', stakingController.unstakeTokens);

// Redeem karma points for XLM tokens
router.post('/redeem', stakingController.redeemKarma);

// Get user staking records
router.get('/:walletAddress', stakingController.getUserStakingRecords);

module.exports = router;