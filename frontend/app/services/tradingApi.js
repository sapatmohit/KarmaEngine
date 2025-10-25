// Trading API service
import { generateMockTokens, generateMockPriceData } from '../types/trading';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class TradingAPI {
  // Get all karma tokens
  static async getKarmaTokens(filters = {}) {
    try {
      // For now, return mock data - replace with actual API call
      const tokens = generateMockTokens();
      
      // Apply filters
      let filteredTokens = tokens;
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredTokens = tokens.filter(token => 
          token.name.toLowerCase().includes(searchTerm) ||
          token.username.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.filter) {
        switch (filters.filter) {
          case 'Trending':
            filteredTokens = filteredTokens.filter(token => token.volume24h > 5000000);
            break;
          case 'Top Gainers':
            filteredTokens = filteredTokens.filter(token => token.priceChangePercentage24h > 0);
            break;
          case 'Top Losers':
            filteredTokens = filteredTokens.filter(token => token.priceChangePercentage24h < 0);
            break;
          case 'New':
            filteredTokens = filteredTokens.filter(token => token.karmaScore < 7000);
            break;
        }
      }
      
      return {
        success: true,
        data: filteredTokens
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get specific karma token
  static async getKarmaToken(userId) {
    try {
      const tokens = generateMockTokens();
      const token = tokens.find(t => t.userId === userId);
      
      if (!token) {
        throw new Error('Token not found');
      }
      
      return {
        success: true,
        data: token
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get price history for a token
  static async getPriceHistory(userId, timeframe = '1D') {
    try {
      // Generate different amounts of data based on timeframe
      let hours;
      switch (timeframe) {
        case '1H':
          hours = 1;
          break;
        case '1D':
          hours = 24;
          break;
        case '1W':
          hours = 24 * 7;
          break;
        case '1M':
          hours = 24 * 30;
          break;
        case '1Y':
          hours = 24 * 365;
          break;
        default:
          hours = 24;
      }
      
      const priceHistory = generateMockPriceData(hours);
      
      return {
        success: true,
        data: priceHistory
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Execute a trade
  static async executeTrade(tradeData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful trade response
      const trade = {
        id: `trade_${Date.now()}`,
        userId: 'current_user',
        targetUserId: tradeData.targetUserId,
        type: tradeData.type,
        amount: tradeData.amount,
        price: tradeData.price,
        totalValue: tradeData.amount * tradeData.price,
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };
      
      return {
        success: true,
        data: trade
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's trade history
  static async getUserTrades(userId) {
    try {
      // Mock trade history
      const trades = [
        {
          id: 'trade_1',
          targetUserId: 'user1',
          targetUsername: 'ethereum_trader',
          type: 'buy',
          amount: 10,
          price: 3943.51,
          totalValue: 39435.10,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'trade_2',
          targetUserId: 'user2',
          targetUsername: 'bitcoin_bull',
          type: 'sell',
          amount: 5,
          price: 2156.78,
          totalValue: 10783.90,
          status: 'completed',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      return {
        success: true,
        data: trades
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get market statistics
  static async getMarketStats() {
    try {
      const stats = {
        totalVolume24h: 125000000,
        totalMarketCap: 1200000000,
        activeTraders24h: 15420,
        totalTrades24h: 8934,
        topGainers: ['bitcoin_bull', 'nft_collector'],
        topLosers: ['ethereum_trader', 'defi_master']
      };
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get order book for a token
  static async getOrderBook(userId) {
    try {
      const orderBook = {
        bids: [
          { price: 3940.00, amount: 2.5, total: 9850.00 },
          { price: 3935.00, amount: 5.2, total: 20462.00 },
          { price: 3930.00, amount: 1.8, total: 7074.00 }
        ],
        asks: [
          { price: 3945.00, amount: 3.1, total: 12229.50 },
          { price: 3950.00, amount: 4.7, total: 18565.00 },
          { price: 3955.00, amount: 2.3, total: 9096.50 }
        ]
      };
      
      return {
        success: true,
        data: orderBook
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default TradingAPI;
