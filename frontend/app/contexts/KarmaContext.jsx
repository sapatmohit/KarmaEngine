'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import ApiService from '../services/api';

const KarmaContext = createContext();

export const useKarma = () => {
  const context = useContext(KarmaContext);
  if (!context) {
    throw new Error('useKarma must be used within a KarmaProvider');
  }
  return context;
};

export const KarmaProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [karmaBalance, setKarmaBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [activities, setActivities] = useState([]);
  const [karmaHistory, setKarmaHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update karma balance when user changes
  useEffect(() => {
    if (user) {
      setKarmaBalance(user.karmaPoints || 0);
      setStakeAmount(user.stakedAmount || 0);
      loadUserData();
    } else {
      setKarmaBalance(0);
      setStakeAmount(0);
      setActivities([]);
      setKarmaHistory([]);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user?.walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Load user activities
      const activitiesResponse = await ApiService.getUserActivities(user.walletAddress);
      setActivities(activitiesResponse.activities || []);
      
      // Load karma history
      const karmaResponse = await ApiService.getKarmaHistory(user.walletAddress);
      setKarmaHistory(karmaResponse.history || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading user data:', err);
      
      // Use mock data as fallback
      setActivities([
        { id: 1, type: 'post', karma: 5, multiplier: 1.5, timestamp: '2 hours ago' },
        { id: 2, type: 'comment', karma: 3, multiplier: 1.5, timestamp: '5 hours ago' },
        { id: 3, type: 'like', karma: 1, multiplier: 1.5, timestamp: '1 day ago' },
        { id: 4, type: 'repost', karma: 2, multiplier: 1.5, timestamp: '2 days ago' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const recordActivity = async (activityData) => {
    if (!user?.walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ApiService.recordActivity({
        walletAddress: user.walletAddress,
        ...activityData
      });
      
      // Update local state
      setKarmaBalance(response.newKarmaBalance);
      loadUserData(); // Reload activities
      
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error recording activity:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const stakeKarma = async (amount) => {
    if (!user?.walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ApiService.stakeKarma(user.walletAddress, amount);
      
      // Update local state
      setKarmaBalance(prev => prev - amount);
      setStakeAmount(prev => prev + amount);
      
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error staking karma:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unstakeKarma = async (amount) => {
    if (!user?.walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ApiService.unstakeKarma(user.walletAddress, amount);
      
      // Update local state
      setKarmaBalance(prev => prev + amount);
      setStakeAmount(prev => prev - amount);
      
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error unstaking karma:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    karmaBalance,
    stakeAmount,
    activities,
    karmaHistory,
    isLoading,
    error,
    recordActivity,
    stakeKarma,
    unstakeKarma,
    loadUserData,
  };

  return (
    <KarmaContext.Provider value={value}>
      {children}
    </KarmaContext.Provider>
  );
};
