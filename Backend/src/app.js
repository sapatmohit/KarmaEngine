const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const stakingRoutes = require('./routes/stakingRoutes');
const karmaRoutes = require('./routes/karmaRoutes');
const instagramRoutes = require('./routes/instagramRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', userRoutes);
app.use('/activities', activityRoutes);
app.use('/staking', stakingRoutes);
app.use('/karma', karmaRoutes);
app.use('/instagram', instagramRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;