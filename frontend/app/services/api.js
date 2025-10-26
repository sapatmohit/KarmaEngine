const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
			// More specific error handling for network issues
			if (error instanceof TypeError && error.message.includes('fetch')) {
				throw new Error(
					'Network error: Unable to connect to the server. Please check if the backend is running on ' +
						this.baseURL
				);
			}
			throw error;
		}
	}

	// User endpoints
	async registerUser(userData) {
		return this.request('/api/users/register', {
			method: 'POST',
			body: JSON.stringify(userData),
		});
	}

	async registerEmailUser(userData) {
		return this.request('/api/users/register-email', {
			method: 'POST',
			body: JSON.stringify(userData),
		});
	}

	async loginEmailUser(credentials) {
		return this.request('/api/users/login', {
			method: 'POST',
			body: JSON.stringify(credentials),
		});
	}

	async getCurrentUser() {
		const token = localStorage.getItem('authToken');
		return this.request('/api/users/me', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	async getUserByWallet(walletAddress) {
		return this.request(`/api/users/wallet/${walletAddress}`);
	}

	async updateUserProfile(walletAddress, profileData) {
		return this.request(`/api/users/profile/${walletAddress}`, {
			method: 'PUT',
			body: JSON.stringify(profileData),
		});
	}

	async updateUserKarma(walletAddress, karmaPoints) {
		return this.request(`/api/users/${walletAddress}/karma`, {
			method: 'PUT',
			body: JSON.stringify({ karmaPoints }),
		});
	}

	// Activity endpoints
	async recordActivity(activityData) {
		return this.request('/api/activities', {
			method: 'POST',
			body: JSON.stringify(activityData),
		});
	}

	async getUserActivities(walletAddress) {
		return this.request(`/api/activities/user/${walletAddress}`);
	}

	// Karma endpoints
	async getKarmaHistory(walletAddress) {
		return this.request(`/api/karma/history/${walletAddress}`);
	}

	async getLeaderboard() {
		return this.request('/api/karma/leaderboard');
	}

	// Staking endpoints
	async stakeKarma(walletAddress, amount) {
		return this.request('/api/staking/stake', {
			method: 'POST',
			body: JSON.stringify({ walletAddress, amount }),
		});
	}

	async unstakeKarma(walletAddress, amount) {
		return this.request('/api/staking/unstake', {
			method: 'POST',
			body: JSON.stringify({ walletAddress, amount }),
		});
	}

	async redeemKarma(walletAddress, karmaAmount) {
		return this.request('/api/staking/redeem', {
			method: 'POST',
			body: JSON.stringify({ walletAddress, karmaPoints: karmaAmount }),
		});
	}

	async getStakingInfo(walletAddress) {
		return this.request(`/api/staking/${walletAddress}`);
	}

	// Transaction history endpoints
	async getUserTransactions(walletAddress) {
		return this.request(`/api/activities/user/${walletAddress}`);
	}
}

export default new ApiService();