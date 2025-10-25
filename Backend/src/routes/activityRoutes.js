const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Record a new activity
router.post('/', activityController.recordActivity);

// Get user activities
router.get('/:walletAddress', activityController.getUserActivities);

// Get activity statistics
router.get('/:walletAddress/stats', activityController.getActivityStats);

module.exports = router;