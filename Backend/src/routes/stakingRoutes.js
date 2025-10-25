const express = require('express');
const router = express.Router();
const stakingController = require('../controllers/stakingController');

// Stake tokens
router.post('/stake', stakingController.stakeTokensController);

// Unstake tokens
router.post('/unstake', stakingController.unstakeTokensController);

// Get user staking records
router.get('/:walletAddress', stakingController.getUserStakingRecords);

module.exports = router;