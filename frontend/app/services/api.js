const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // User endpoints
  async registerUser(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserByWallet(walletAddress) {
    return this.request(`/users/${walletAddress}`);
  }

  async updateUserKarma(walletAddress, karmaPoints) {
    return this.request(`/users/${walletAddress}/karma`, {
      method: 'PUT',
      body: JSON.stringify({ karmaPoints }),
    });
  }

  // Activity endpoints
  async getUserActivities(walletAddress) {
    return this.request(`/activities/user/${walletAddress}`);
  }

  async recordActivity(activityData) {
    return this.request('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  // Karma endpoints
  async getKarmaHistory(walletAddress) {
    return this.request(`/karma/history/${walletAddress}`);
  }

  async getLeaderboard() {
    return this.request('/karma/leaderboard');
  }

  // Staking endpoints
  async stakeKarma(walletAddress, amount) {
    return this.request('/staking/stake', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, amount }),
    });
  }

  async unstakeKarma(walletAddress, amount) {
    return this.request('/staking/unstake', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, amount }),
    });
  }

  async getStakingInfo(walletAddress) {
    return this.request(`/staking/${walletAddress}`);
  }
}

export default new ApiService();
