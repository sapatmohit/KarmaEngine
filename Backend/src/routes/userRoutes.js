const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
// Register a new user (wallet-based)
router.post('/register', userController.registerUser);

// Register user with email and password
router.post('/register-email', userController.registerEmailUser);

// Login with email and password
router.post('/login', userController.loginEmailUser);

// Get user by wallet address
router.get('/wallet/:walletAddress', userController.getUserByWallet);

// Protected routes
// Get current user profile
router.get('/me', auth, userController.getCurrentUser);

// Update user karma points
router.put('/:walletAddress/karma', userController.updateUserKarma);

module.exports = router;
