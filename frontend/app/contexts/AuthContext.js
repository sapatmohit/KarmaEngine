'use client';

import { createContext, useContext, useState, useEffect } from 'react';
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
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      checkUserExists(savedWallet);
    } else {
      setIsLoading(false);
    }
  }, []);

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
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      const walletAddress = accounts[0];
      
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
  };

  const updateUserKarma = async (karmaPoints) => {
    if (!user) return;
    
    try {
      const response = await ApiService.updateUserKarma(user.walletAddress, karmaPoints);
      setUser(prev => ({ ...prev, karmaPoints }));
      return response;
    } catch (error) {
      console.error('Update karma error:', error);
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
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
