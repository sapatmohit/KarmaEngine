'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI, karmaAPI, stakingAPI, activityAPI } from '../utils/api';

const KarmaContext = createContext();

export const useKarma = () => {
  const context = useContext(KarmaContext);
  if (!context) {
    throw new Error('useKarma must be used within a KarmaProvider');
  }
  return context;
};

export const KarmaProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [karmaBalance, setKarmaBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize user data (mock for now)
  useEffect(() => {
    // In a real app, this would come from wallet connection
    const mockUser = {
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      registered: true,
    };
    
    setUser(mockUser);
    
    // Load initial data
    loadUserData(mockUser.walletAddress);
  }, []);

  const loadUserData = async (walletAddress) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, these would be actual API calls
      // const userData = await userAPI.getUserByWallet(walletAddress);
      // const karmaData = await karmaAPI.getKarmaBalance(walletAddress);
      // const stakingData = await stakingAPI.getUserStakingRecords(walletAddress);
      // const activityData = await activityAPI.getUserActivities(walletAddress);
      
      // Mock data for now
      setKarmaBalance(1250);
      setStakeAmount(350);
      setActivities([
        { id: 1, type: 'post', karma: 5, multiplier: 1.5, timestamp: '2 hours ago' },
        { id: 2, type: 'comment', karma: 3, multiplier: 1.5, timestamp: '5 hours ago' },
        { id: 3, type: 'like', karma: 1, multiplier: 1.5, timestamp: '1 day ago' },
        { id: 4, type: 'repost', karma: 2, multiplier: 1.5, timestamp: '2 days ago' },
      ]);
      
      setLeaderboard([
        { rank: 1, user: '0x742d...25a3', karma: 15420, tier: 'Influencer' },
        { rank: 2, user: '0xa1b2...abcd', karma: 12850, tier: 'Influencer' },
        { rank: 3, user: '0x4567...def0', karma: 11230, tier: 'Influencer' },
      ]);
    } catch (err) {
      setError(err.message);
      console.error('Error loading user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    // In a real app, this would connect to a wallet like MetaMask
    // For now, we'll just use mock data
    const mockUser = {
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      registered: true,
    };
    
    setUser(mockUser);
    loadUserData(mockUser.walletAddress);
  };

  const recordActivity = async (activityData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app: await activityAPI.recordActivity(activityData);
      
      // Mock implementation
      const newActivity = {
        id: activities.length + 1,
        ...activityData,
        karma: activityData.type === 'post' ? 5 : 
               activityData.type === 'comment' ? 3 : 
               activityData.type === 'like' ? 1 : 
               activityData.type === 'repost' ? 2 : -5,
        multiplier: stakeAmount >= 500 ? 2 : stakeAmount >= 100 ? 1.5 : 1,
        timestamp: 'Just now'
      };
      
      setActivities(prev => [newActivity, ...prev]);
      setKarmaBalance(prev => prev + (newActivity.karma * newActivity.multiplier));
      
      return newActivity;
    } catch (err) {
      setError(err.message);
      console.error('Error recording activity:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const stakeTokens = async (amount) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app: await stakingAPI.stakeTokens({ amount, walletAddress: user.walletAddress });
      
      // Mock implementation
      setStakeAmount(prev => prev + parseFloat(amount));
      setKarmaBalance(prev => prev + 10); // Bonus for staking
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error staking tokens:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unstakeTokens = async (amount) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app: await stakingAPI.unstakeTokens({ amount, walletAddress: user.walletAddress });
      
      // Mock implementation
      setStakeAmount(prev => Math.max(0, prev - parseFloat(amount)));
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error unstaking tokens:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    karmaBalance,
    stakeAmount,
    activities,
    leaderboard,
    isLoading,
    error,
    connectWallet,
    recordActivity,
    stakeTokens,
    unstakeTokens,
  };

  return (
    <KarmaContext.Provider value={value}>
      {children}
    </KarmaContext.Provider>
  );
};