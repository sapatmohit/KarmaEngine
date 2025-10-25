const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	walletAddress: {
		type: String,
		unique: true,
		sparse: true,
	},
	email: {
		type: String,
		unique: true,
		sparse: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		minlength: 6,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	dateOfBirth: {
		type: Date,
	},
	isOver18: {
		type: Boolean,
		default: false,
	},
	username: {
		type: String,
		unique: true,
		trim: true,
	},
	avatar: {
		type: String,
		default: '',
	},
	socialMedia: {
		instagram: { type: String, default: '' },
		facebook: { type: String, default: '' },
		twitter: { type: String, default: '' },
	},
	karmaPoints: {
		type: Number,
		default: 0,
	},
	stakedAmount: {
		type: Number,
		default: 0,
	},
	multiplier: {
		type: Number,
		default: 1.0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	lastActivity: {
		type: Date,
		default: Date.now,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});

// Index for faster queries
userSchema.index({ walletAddress: 1 });
userSchema.index({ karmaPoints: -1 });
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		const bcrypt = require('bcryptjs');
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
	const bcrypt = require('bcryptjs');
	return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
	const jwt = require('jsonwebtoken');
	const config = require('../config');
	return jwt.sign(
		{
			userId: this._id,
			email: this.email,
			walletAddress: this.walletAddress,
		},
		config.jwtSecret,
		{ expiresIn: '7d' }
	);
};

module.exports = mongoose.model('User', userSchema);
