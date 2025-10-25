// API utility functions for KarmaChain frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// User API functions
export const userAPI = {
  // Register a new user
  registerUser: async (walletAddress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Get user by wallet address
  getUserByWallet: async (walletAddress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${walletAddress}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user karma points
  updateUserKarma: async (walletAddress, karmaPoints) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${walletAddress}/karma`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ karmaPoints }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user karma:', error);
      throw error;
    }
  },
};

// Karma API functions
export const karmaAPI = {
  // Get user's karma balance
  getKarmaBalance: async (walletAddress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/karma/balance/${walletAddress}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching karma balance:', error);
      throw error;
    }
  },

  // Sync user's karma between database and blockchain
  syncKarma: async (walletAddress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/karma/sync/${walletAddress}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error syncing karma:', error);
      throw error;
    }
  },

  // Get leaderboard
  getLeaderboard: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/karma/leaderboard`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },
};

// Activity API functions
export const activityAPI = {
  // Record a new activity
  recordActivity: async (activityData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error recording activity:', error);
      throw error;
    }
  },

  // Get user activities
  getUserActivities: async (walletAddress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${walletAddress}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  },

  // Get activity statistics
  getActivityStats: async (walletAddress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${walletAddress}/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching activity stats:', error);
      throw error;
    }
  },
};

// Staking API functions
export const stakingAPI = {
  // Stake tokens
  stakeTokens: async (stakeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/staking/stake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stakeData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error staking tokens:', error);
      throw error;
    }
  },

  // Unstake tokens
  unstakeTokens: async (unstakeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/staking/unstake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unstakeData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      throw error;
    }
  },

  // Get user staking records
  getUserStakingRecords: async (walletAddress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/staking/${walletAddress}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching staking records:', error);
      throw error;
    }
  },
};

export default {
  userAPI,
  karmaAPI,
  activityAPI,
  stakingAPI,
};