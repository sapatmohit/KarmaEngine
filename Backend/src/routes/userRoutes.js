const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.registerUser);

// Get user by wallet address
router.get('/:walletAddress', userController.getUserByWallet);

// Update user karma points
router.put('/:walletAddress/karma', userController.updateUserKarma);

module.exports = router;