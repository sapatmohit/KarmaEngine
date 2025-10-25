'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isConnecting, setIsConnecting] = useState(false);

	// Check if user is already logged in on app start
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		const savedWallet = localStorage.getItem('walletAddress');
		const savedUser = localStorage.getItem('ke_user');
		const authToken = localStorage.getItem('authToken');

		if (authToken) {
			// Check if token is valid by getting current user
			try {
				const response = await ApiService.getCurrentUser();
				setUser(response.user);
			} catch (error) {
				console.error('Token validation failed:', error);
				localStorage.removeItem('authToken');
				localStorage.removeItem('ke_user');
			}
			setIsLoading(false);
		} else if (savedWallet) {
			await checkUserExists(savedWallet);
		} else if (savedUser) {
			// Handle email-based login
			try {
				const userData = JSON.parse(savedUser);
				setUser(userData);
			} catch (error) {
				console.error('Error parsing user data:', error);
				localStorage.removeItem('ke_user');
			}
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	};

	const checkUserExists = async (walletAddress) => {
		try {
			const response = await ApiService.getUserByWallet(walletAddress);
			setUser(response.user);
			localStorage.setItem('walletAddress', walletAddress);
		} catch (error) {
			console.error('User not found:', error);
			localStorage.removeItem('walletAddress');
		} finally {
			setIsLoading(false);
		}
	};

	const connectWallet = async () => {
		// Check if we're in a browser environment
		if (typeof window === 'undefined') {
			throw new Error('Wallet connection is only available in browser');
		}

		// Check for Freighter (Stellar) or MetaMask (Ethereum)
		const hasFreighter = typeof window.freighterApi !== 'undefined';
		const hasMetaMask = typeof window.ethereum !== 'undefined';

		if (!hasFreighter && !hasMetaMask) {
			throw new Error(
				'No wallet extension found. Please install Freighter or MetaMask to continue.'
			);
		}

		setIsConnecting(true);
		try {
			let walletAddress;

			if (hasFreighter) {
				// Use Freighter for Stellar wallet
				const { freighterApi } = await import('@stellar/freighter-api');
				walletAddress = await freighterApi.getPublicKey();
			} else if (hasMetaMask) {
				// Use MetaMask for Ethereum wallet
				const accounts = await window.ethereum.request({
					method: 'eth_requestAccounts',
				});

				if (accounts.length === 0) {
					throw new Error('No accounts found. Please connect your wallet.');
				}

				walletAddress = accounts[0];
			}

			// Check if user exists in backend
			try {
				const response = await ApiService.getUserByWallet(walletAddress);
				setUser(response.user);
				localStorage.setItem('walletAddress', walletAddress);
				return { success: true, user: response.user, isNewUser: false };
			} catch (error) {
				// User doesn't exist, need to register
				return { success: true, walletAddress, isNewUser: true };
			}
		} catch (error) {
			console.error('Wallet connection error:', error);
			throw error;
		} finally {
			setIsConnecting(false);
		}
	};

	const registerUser = async (userData) => {
		try {
			const response = await ApiService.registerUser(userData);
			setUser(response.user);
			localStorage.setItem('walletAddress', userData.walletAddress);
			return response;
		} catch (error) {
			console.error('Registration error:', error);
			throw error;
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('walletAddress');
		localStorage.removeItem('ke_user');
		localStorage.removeItem('authToken');
	};

	const updateUserKarma = async (karmaPoints) => {
		if (!user) return;

		try {
			const response = await ApiService.updateUserKarma(
				user.walletAddress,
				karmaPoints
			);
			setUser((prev) => ({ ...prev, karmaPoints }));
			return response;
		} catch (error) {
			console.error('Update karma error:', error);
			throw error;
		}
	};

	const emailLogin = async (credentials) => {
		try {
			const response = await ApiService.loginEmailUser(credentials);
			setUser(response.user);
			localStorage.setItem('authToken', response.token);
			localStorage.setItem('ke_user', JSON.stringify(response.user));
			return response;
		} catch (error) {
			console.error('Email login error:', error);
			throw error;
		}
	};

	const emailRegister = async (userData) => {
		try {
			const response = await ApiService.registerEmailUser(userData);
			setUser(response.user);
			localStorage.setItem('authToken', response.token);
			localStorage.setItem('ke_user', JSON.stringify(response.user));
			return response;
		} catch (error) {
			console.error('Email registration error:', error);
			throw error;
		}
	};

	const value = {
		user,
		isLoading,
		isConnecting,
		connectWallet,
		registerUser,
		logout,
		updateUserKarma,
		emailLogin,
		emailRegister,
		isAuthenticated: !!user,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
