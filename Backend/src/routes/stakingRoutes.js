const express = require('express');
const router = express.Router();
const stakingController = require('../controllers/stakingController');

// Stake tokens
router.post('/stake', stakingController.stakeTokensController);

// Unstake tokens
router.post('/unstake', stakingController.unstakeTokensController);

// Redeem karma points for XLM tokens
router.post('/redeem', stakingController.redeemKarmaController);

// Get user staking records
router.get('/:walletAddress', stakingController.getUserStakingRecords);

module.exports = router;